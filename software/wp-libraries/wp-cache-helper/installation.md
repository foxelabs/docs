# Installation

## Requirements

- PHP 7.4+
- WordPress 6.1+
- Composer

## Composer

```console
composer require foxelabs/wp-cache-helper
```

Classes autoload under the `FoxeLabs\Cache\` namespace via PSR-4.

## Bootstrapping

Each container instance is scoped to a single prefix. Pass any non-empty string the first time you ask for it; the same prefix returns the same instance on subsequent calls:

```php
$cache = \FoxeLabs\Cache\Cache::get_instance( 'my_plugin' );
```

You can also instantiate directly (useful for tests where you want to inject custom drivers):

```php
$cache = new \FoxeLabs\Cache\Cache( 'my_plugin' );
```

Every key, group, and the `{prefix}_can_cache` toggle filter are namespaced under the supplied prefix.

## Upgrading from 2.x

3.0.0 is the DuckDev → Foxe Labs rebrand. Two mechanical changes:

- Package `duckdev/wp-cache-helper` → **`foxelabs/wp-cache-helper`** in `composer.json`.
- Namespace `DuckDev\Cache\` → **`FoxeLabs\Cache\`** in every `use` statement.

No cache data migration is needed. Keys, groups, and the `can_cache` filter are all derived from your own prefix, never from a vendor name, so the rebrand changes nothing the library reads or writes.

## Upgrading from 1.x

1.x hardcoded a shared `duckdev_cache` prefix for every consumer. 2.0.0 made the prefix a required constructor argument, which changed both the cache keys and the filter name:

| | 1.x | 2.0+ |
| --- | --- | --- |
| Keys and groups | `duckdev_cache_*`, shared | `{prefix}_*`, per consumer |
| Toggle filter | `duckdev_cache_can_cache` | `{prefix}_can_cache` |

Rename any `add_filter( 'duckdev_cache_can_cache', … )` to `{prefix}_can_cache`, and pass a prefix at construction: `new Cache( 'my_plugin' )`.

### Cleaning up 1.x data

There is nothing to *migrate* — every entry is a rebuildable cache value, so let `remember()` repopulate on the next request. But the two stores leave different messes behind:

- **Object cache** entries under `duckdev_cache_*` are non-persistent. They vanish on the next flush or restart. Ignore them.
- **Transients** are the ones worth cleaning. Those written without an expiry persist as `wp_options` rows that nothing will ever read or expire again, so they sit there indefinitely.

Clear the stale transient rows once, from your plugin's upgrade routine:

```php
global $wpdb;

$wpdb->query(
    "DELETE FROM {$wpdb->options}
     WHERE option_name LIKE '_transient_duckdev\_cache\_%'
        OR option_name LIKE '_transient_timeout_duckdev\_cache\_%'"
);

wp_cache_flush();
```

Direct SQL is the right call here, unlike a data migration: these rows are orphaned cache values that nothing reads, so there is no cached read to invalidate and no value to preserve. The `wp_cache_flush()` afterwards drops any stale copies a persistent object cache may still be holding.

On multisite, run the query per blog against that blog's `$wpdb->options`. Transients written with the multisite opt-in are network-wide and live in `sitemeta` instead.
