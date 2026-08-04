# Installation

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Composer

## Composer

```console
composer require foxelabs/wp-review-notice
```

Classes autoload under the `FoxeLabs\Reviews\` namespace via PSR-4.

## Bootstrapping

Register on `plugins_loaded`. `register()` is what hooks `admin_notices` + `admin_init` and seeds the show-time schedule. Calling `create()` without `register()` does nothing — useful for tests, or for configuring a notice you want to render manually.

```php
add_action( 'plugins_loaded', function () {
    \FoxeLabs\Reviews\Notice::create(
        'my-plugin', // wp.org plugin slug (e.g. "hello-dolly").
        'My Plugin', // Display name shown in the notice copy.
        array(
            'days'    => 7,
            'cap'     => 'manage_options',
            'screens' => array( 'dashboard', 'plugins' ),
        )
    )->register();
} );
```

## Migrating from 1.x

In 2.0.0 the reserved segment in every storage key changed from `_reviews_` to `_review_`, so both keys the library writes were renamed:

| Purpose | 1.x key | 3.0 key | Storage |
| --- | --- | --- | --- |
| Next show time | `{prefix}_reviews_time` | `{prefix}_review_time` | Site option |
| Per-user dismissal | `{prefix}_reviews_dismissed` | `{prefix}_review_dismissed` | User meta |

The 3.0 rebrand itself renamed **no** keys — they are built from your own `prefix` (the plugin slug by default), never from a vendor name — but anyone coming from the DuckDev 1.x release crosses this rename on the way to 3.0.

**The library does not migrate this for you.** Skip it and there is no error: the old rows are simply orphaned, the timer reseeds from scratch, and every admin — including those who already dismissed the notice under 1.x — gets prompted again after `days`. That is a nag rather than a breakage, so accepting the reset and deleting the stale rows is a legitimate choice.

```php
/**
 * Move 1.x review-notice storage onto the 2.0+ key names.
 *
 * Run once, from your plugin's upgrade routine, BEFORE the notice
 * is registered.
 */
function myplugin_migrate_review_notice_keys(): void {
    // Must match the prefix the notice is constructed with — the
    // plugin slug with dashes as underscores, unless you passed an
    // explicit `prefix` option.
    $prefix = 'my_plugin';

    // 1. The timer — a site option, network-wide on multisite.
    $legacy_time = get_site_option( $prefix . '_reviews_time' );

    // Never clobber: if the new key already holds a time, this site
    // has run on 2.0+ already and the stale copy must not win.
    if ( ! empty( $legacy_time ) && empty( get_site_option( $prefix . '_review_time' ) ) ) {
        update_site_option( $prefix . '_review_time', $legacy_time );
    }

    delete_site_option( $prefix . '_reviews_time' );

    // 2. Dismissals — per-user meta. Only users who actually dismissed
    //    the notice carry the legacy key, so this set stays small.
    $user_ids = get_users(
        array(
            'meta_key' => $prefix . '_reviews_dismissed', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
            'fields'   => 'ID',
            'number'   => -1,
        )
    );

    foreach ( $user_ids as $user_id ) {
        if ( ! get_user_meta( $user_id, $prefix . '_review_dismissed', true ) ) {
            update_user_meta( $user_id, $prefix . '_review_dismissed', true );
        }

        delete_user_meta( $user_id, $prefix . '_reviews_dismissed' );
    }
}
```

Four things to get right, whatever shape your upgrade routine takes:

- **Run it before `register()`.** This is the easy one to get wrong. `register()` calls `start()`, which seeds `{prefix}_review_time` the moment it finds that key empty — so if the notice registers first, the new key already holds a fresh timestamp and the "don't clobber" guard will correctly skip your legacy value. Migrate from a version-stamped upgrade routine that runs earlier on `plugins_loaded`, or at a lower priority on the same hook.
- **Don't clobber.** Only write a key that is empty. A site already running 2.0+ has live values, and a stale 1.x copy must not overwrite them.
- **Use the options and meta APIs.** A raw `UPDATE wp_options SET option_name` bypasses the options cache and any persistent object cache, so a cached read can resurrect the old value.
- **Mind multisite.** The timer is a *site* option — `get_site_option()` / `update_site_option()` hit the network-wide row on multisite, so run that half once per network, not once per blog. Dismissals are user meta and are already network-wide.

If you would rather take the reset than write the migration, drop the two legacy keys and let the schedule start over:

```php
delete_site_option( 'my_plugin_reviews_time' );
delete_metadata( 'user', 0, 'my_plugin_reviews_dismissed', '', true );
```

## Options

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `days` | `int` | `7` | Days to wait before showing the notice for the first time. |
| `screens` | `array` | `[]` | Allowed admin screen IDs. Empty = every admin screen. |
| `cap` | `string` | `manage_options` | Capability required to see and act on the notice. |
| `classes` | `array` | `[]` | Extra CSS classes appended to the `notice notice-info` wrapper. |
| `message` | `string` | auto-generated | Custom HTML message. Not escaped — sanitise it yourself. |
| `action_labels` | `array` | bundled labels | Keys: `review`, `later`, `dismiss`. Set any to `''` to hide that link. |
| `prefix` | `string` | slug with `-` → `_` | Storage namespace. Keys are written as `{prefix}_review_{key}`. |
