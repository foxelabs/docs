# Installation

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Composer

## Composer

```console
composer require foxelabs/wp-flash-notices
```

Classes autoload under the `FoxeLabs\Notices\` namespace via PSR-4.

## Bootstrapping

Register on `plugins_loaded`. `register()` is what hooks `admin_notices`, `network_admin_notices`, the front-end action, and the `shutdown` flush. Constructing without `register()` does nothing — useful for tests, or when you want to render notices manually.

```php
add_action( 'plugins_loaded', function () {
    \FoxeLabs\Notices\Notices::get_instance( 'my_plugin' )->register();
} );
```

The prefix is the library's whole isolation story: every transient key and every hook name is derived from it. Use something specific to your plugin.

Anywhere else in your plugin, `get_instance()` with the same prefix hands back the same container, so you never need to pass it around:

```php
\FoxeLabs\Notices\Notices::get_instance( 'my_plugin' )
    ->add( 'settings-saved', 'Your settings have been saved.', 'success' );
```

To inject your own store or renderer, construct directly instead — see [Custom storage and rendering](./usage#custom-storage-and-rendering).

## Storage keys

| Purpose | Key | Storage |
| --- | --- | --- |
| Site notice queue | `{prefix}_flash_notices` | Transient |
| Network notice queue | `{prefix}_network_flash_notices` | Site transient (multisite) |

Both expire after one day by default. That is a backstop, not a schedule — notices are normally cleared the moment they are rendered.

## Migrating from 1.x

2.0.0 is a clean break from the DuckDev 1.x release. There is no compatibility shim.

| 1.x | 2.0.0 |
| --- | --- |
| `duckdev/wp-flash-notices` | **`foxelabs/wp-flash-notices`** |
| `DuckDev\WP_Flash_Notices` | **`FoxeLabs\Notices\Notices`** |
| Constructor took a transient name | Constructor takes a **prefix**; keys are derived from it |
| Hooks attached in the constructor | Call **`register()`** explicitly |
| `wp_flash_notices_*` hooks | **`{prefix}_flash_notices_*`** / `{prefix}_flash_notice_*` |
| `front_notices` action | **`{prefix}_front_notices`** |
| `get()` / `fetch()` returned arrays | Return **`Notice`** objects (`null` / `[]` when absent) |
| `clear_after_render()` public method | Removed — clearing is internal to `render()` |
| Notices stored forever | Stored with an expiration (default one day) |

**No data migration is needed, and none is offered.** Flash notices are by definition transient: the only thing a 1.x transient can hold at upgrade time is a notice queued moments earlier and not yet displayed, which is simply not shown. Nothing else persists across the upgrade.

Rewriting the call sites is the actual work:

```php
// 1.x
use DuckDev\WP_Flash_Notices as My_Notices;

$notices = new My_Notices( 'my-custom-notices' );
$notices->add( 'custom-success', 'Saved.', 'success' );

// 2.0.0
$notices = \FoxeLabs\Notices\Notices::get_instance( 'my_plugin' );
$notices->register(); // Once, on plugins_loaded.
$notices->add( 'custom-success', 'Saved.', 'success' );
```

Two call-site details that will not fail loudly:

- **Reading a notice back.** `get()` now returns a `Notice` object or `null`, not an array — `$notices->get( 'k' )['message']` becomes `$notices->get( 'k' )->message()`. On a miss the old code got `[]`; the new code gets `null`, so guard before dereferencing.
- **Your hook callbacks stop firing.** Every hook name gained the prefix, so a 1.x `add_filter( 'wp_flash_notices_auto_clear', ... )` is now simply never called — and since the default is "clear", the symptom is your override silently vanishing rather than an error. Rename to `{prefix}_flash_notices_auto_clear`. The same applies to `front_notices`: a template still firing the unprefixed action prints nothing.

If you were relying on `clear_after_render()` as a public method, remove the call — `render()` handles clearing, gated by the `{prefix}_flash_notices_auto_clear` filter.

::: tip Two 1.x bugs are fixed
Network notices were saved from the wrong queue, so the site queue was written into the network transient and the two clobbered each other; they now use distinct keys. And the auto-clear callback was hooked with mismatched arguments, so notices were not reliably cleared after rendering. If you worked around either, drop the workaround.
:::
