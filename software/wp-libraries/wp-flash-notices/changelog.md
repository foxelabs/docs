# Changelog

## 2.0.0

Rebrand from DuckDev to FoxeLabs, combined with a full restructure onto the same PSR-4, dependency-injected shape as the other FoxeLabs libraries. Clean break — no compatibility shim from 1.x.

::: tip No data migration needed
Flash notices are transient by design: the only thing the old storage can hold at upgrade time is a notice queued moments earlier and not yet shown. Rewriting your call sites is the whole job — see [Migrating from 1.x](./installation#migrating-from-1-x).
:::

### Changed
- Composer package renamed `duckdev/wp-flash-notices` → **`foxelabs/wp-flash-notices`**. Update your `composer.json` require entry.
- Class renamed `DuckDev\WP_Flash_Notices` → **`FoxeLabs\Notices\Notices`**, autoloaded via PSR-4 under `FoxeLabs\Notices\` (was a classmapped single file).
- The constructor now takes a **prefix** rather than a transient name, and has **no side effects** — call `register()` to attach the hooks. 1.x hooked WordPress from the constructor.
- Every hook name is now scoped to that prefix: `wp_flash_notices_*` → **`{prefix}_flash_notices_*`** / `{prefix}_flash_notice_*`, and `front_notices` → **`{prefix}_front_notices`**. Two plugins on one site no longer answer each other's filters.
- `get()` returns a **`Notice`** object or `null`; `fetch()` returns `Notice[]`. Both returned raw arrays in 1.x.
- Stored queues now carry an **expiration** (default one day, configurable on `TransientStore`), so an unread queue cannot linger in the options table forever.
- Site and network queues use **distinct storage keys** (`{prefix}_flash_notices` and `{prefix}_network_flash_notices`).
- Minimum PHP raised to **7.4** (was 5.4).

### Added
- `StoreInterface` and `RendererInterface`, so storage and markup are swappable by constructor injection.
- `Notice` — an immutable value object for a single notice, with `to_array()` / `from_array()` for storage.
- `Notices::get_instance( $prefix )` — same prefix returns the same container, so notices can be queued from anywhere without passing the object around.
- `types()`, `prefixer()`, `store()` and `renderer()` accessors. Notice types are now resolved per call, so a filter registered after construction still applies.
- A malformed stored row is skipped rather than rendered, so bad data cannot fatal a page.
- Full unit test suite plus GitHub Actions for tests, PHPCS and releases.

### Fixed
- **Network notices were saved from the wrong queue.** `save()` wrote the *site* queue into the network transient, so network notices were never stored and the two queues clobbered each other.
- **Notices were not reliably cleared after rendering.** The auto-clear callback was hooked with mismatched arguments (`$transient, $notices` where it expected `$notices, $network`), so the wrong value drove the clear.
- `add()` discarded the return value of its own notice-item filter, making the filter inert. It is now honoured — return a `Notice` from `{prefix}_flash_notice_item` to replace the queued notice.

### Removed
- `clear_after_render()`. Clearing is internal to `render()`, still gated by `{prefix}_flash_notices_auto_clear`.

## 1.0.1

### Added
- `wp_flash_notices_notice_types` filter for registering custom notice types.
- `front_notices` action for printing notices in front-end templates.

### Fixed
- Notices were fetched with the wrong value passed through to the transient lookup.

## 1.0.0

Initial release, as `duckdev/wp-flash-notices`.
