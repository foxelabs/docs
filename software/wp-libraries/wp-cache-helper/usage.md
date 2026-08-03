# Usage

## Available methods

| Method | Backed by | Purpose |
| --- | --- | --- |
| `remember( $key, $callback, $group, $expiry )` | Object cache | Read, or compute + cache on miss. |
| `forget( $key, $group, $default )` | Object cache | Read then delete; return `$default` on miss. |
| `persist( $key, $callback, $site_wide, $expiry )` | Transients | Read, or compute + cache on miss. |
| `cease( $key, $site_wide, $default )` | Transients | Read then delete; return `$default` on miss. |
| `flush_group( $group )` | Object cache | Invalidate every entry in a group. |
| `flush()` | Object cache | Flush the entire object cache. **Last resort.** |
| `object_cache()` / `transient_cache()` | — | Access the underlying driver for finer-grained control. |

Every callback-based helper checks the callback return with `is_wp_error()` and skips caching when a `WP_Error` is returned, so a transient API failure is not memorised.

## `remember()` — object-cache read-through

```php
$cache = \DuckDev\Cache\Cache::get_instance( 'my_plugin' );

$posts = $cache->remember( 'latest_posts', function () {
    return new WP_Query( array(
        'posts_per_page' => 5,
        'orderby'        => 'post_date',
        'order'          => 'desc',
    ) );
}, 'queries', HOUR_IN_SECONDS );
```

Unlike a naive `wp_cache_get()`-then-fall-back pattern, `remember()` distinguishes a legitimately cached `0`, `''`, `[]`, or `false` from a true miss — the callback only runs when nothing was cached.

## `forget()` — one-shot read

```php
$error = $cache->forget( 'form_errors', 'flash', false );

if ( $error ) {
    echo 'An error occurred: ' . esc_html( $error );
}
```

## `persist()` — transient read-through

```php
$cache->persist( 'latest_tweets_' . $user_id, function () use ( $user_id ) {
    return get_latest_tweets_for_user( $user_id );
}, false, 15 * MINUTE_IN_SECONDS );
```

Pass `true` for the third argument to use site-wide (multisite) transients.

::: tip
Transients use boolean `false` as the miss sentinel, so a legitimately cached `false` value is indistinguishable from a miss. Reach for `remember()` if you need to cache `false`.
:::

## `flush_group()`

```php
$cache->flush_group( 'queries' );
```

On WP 6.1+ with a persistent object cache backend that advertises `flush_group` support (via `wp_cache_supports( 'flush_group' )`), this delegates directly to `wp_cache_flush_group()`. Otherwise it falls back to incrementing a per-group version sentinel — old entries become unreadable on next access without touching the rest of the object cache.

## Filters

| Filter | Arguments | Use |
| --- | --- | --- |
| `{prefix}_can_cache` | `bool $enabled, string $type` | Return `false` to disable caching. `$type` is `'object'` or `'transient'` so the two can be toggled independently. |

### Disabling caching for debugging

```php
add_filter( 'my_plugin_can_cache', '__return_false' );
```
