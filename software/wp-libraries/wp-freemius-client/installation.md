# Installation

## Requirements

- PHP 7.4+
- WordPress 5.0+
- Composer

## Composer

```console
composer require foxelabs/wp-freemius-client
```

Classes autoload under the `FoxeLabs\Freemius\` namespace via PSR-4.

## Bootstrapping

Initialise the container by calling `Freemius::get_instance()` with your Freemius product ID and an arguments array. The first call creates the container and registers WordPress hooks; subsequent calls for the same plugin ID return the existing instance.

```php
$freemius = \FoxeLabs\Freemius\Freemius::get_instance(
    12345, // Freemius product ID.
    array(
        'slug'       => 'loggedin',
        'main_file'  => LOGGEDIN_FILE,
        'public_key' => 'pk_XXXXXXXXXXXXXXXXX',
        'is_premium' => true,
        'has_addons' => false,
    )
);
```

## Migrating from 2.x

In 3.0.0 the option that stores license activations was renamed from `duckdev_freemius_activation_data` to `foxelabs_freemius_activation_data`.

**The library does not migrate this for you.** It deliberately performs no writes of its own — host plugins own the lifecycle — so each plugin must move the option as part of its own upgrade routine. Skip it and there is no error: activations simply read as empty, so licenses appear deactivated and premium updates stop.

The stored data shape did not change, so a straight copy is all that's needed:

```php
/**
 * Copy 2.x activation data onto the 3.0 option key.
 *
 * Run once, from your plugin's upgrade routine, before anything
 * builds a Freemius instance.
 */
function myplugin_migrate_freemius_activation_data(): void {
    $legacy = get_option( 'duckdev_freemius_activation_data', null );

    // Fresh install, or already migrated.
    if ( ! is_array( $legacy ) || empty( $legacy ) ) {
        return;
    }

    // Never clobber a real activation — if the new key already holds
    // data, this site has activated since upgrading and the stale
    // legacy copy must not overwrite it.
    $current = get_option( 'foxelabs_freemius_activation_data', null );

    if ( is_array( $current ) && ! empty( $current ) ) {
        delete_option( 'duckdev_freemius_activation_data' );

        return;
    }

    // Only drop the source once the destination is safely written.
    if ( update_option( 'foxelabs_freemius_activation_data', $legacy ) ) {
        delete_option( 'duckdev_freemius_activation_data' );
    }
}
```

Three things to get right, whatever shape your upgrade routine takes:

- **Run it before the first read.** The migration has to land before anything calls `Freemius::get_instance()` and reads a license. A version-stamped upgrade routine on `plugins_loaded` works; a lazy "migrate on first access" hook does not.
- **Don't clobber.** Only write the new key when it is empty. Otherwise a site that already activated on 3.0 gets its live activation overwritten by a stale 2.x copy.
- **Copy, verify, then delete.** Use the options API rather than a raw `UPDATE wp_options SET option_name` — direct SQL bypasses the options cache and any persistent object cache, so a cached read can resurrect the old value.

The `duckdev_freemius_{plugin_id}_*` transients need no migration. They are 24-hour addon caches that repopulate on the next API call, and WordPress clears the expired rows itself.

## Constructor options

| Key | Type | Description |
| --- | --- | --- |
| `slug` | `string` | Unique Freemius slug for the plugin. |
| `main_file` | `string` | Absolute path to the plugin's main file (used for `plugin_basename()` and `get_plugin_data()`). |
| `public_key` | `string` | Freemius public key (`pk_…`). Required for plugin-scoped endpoints (addons, info). |
| `is_premium` | `bool` | Whether this build is the premium edition. Update hooks only register when `true`. Default `false`. |
| `has_addons` | `bool` | Whether the product has addons to list. Default `false`. |
