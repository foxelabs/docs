# Changelog

## 3.0.0

Rebrand from DuckDev to FoxeLabs. No behavioural changes — but the rename touches the package name and the namespace, so it is a breaking release.

::: tip No cache migration needed
Keys, groups, and the `can_cache` filter are all built from your own prefix, never from a vendor name, so this release changes nothing the library reads or writes. Update your `use` statements and you are done.

Coming from **1.x**? That upgrade did change the prefix, and leaves stale transient rows behind — see [Upgrading from 1.x](./installation#upgrading-from-1-x) for the one-time cleanup.
:::

### Changed
- Composer package renamed `duckdev/wp-cache-helper` → **`foxelabs/wp-cache-helper`**. Update your `composer.json` require entry.
- Namespace renamed `DuckDev\Cache\` → **`FoxeLabs\Cache\`**. Update every `use` statement and class reference.

### Unchanged
- Public API (`remember`, `forget`, `persist`, `cease`, `flush_group`, `flush`), the `{prefix}_can_cache` filter, every cache key and group name, and all behaviour.

## 2.0.2

### Added
- `ObjectCache::flush_group()` now delegates to core `wp_cache_flush_group()` on WP 6.1+ backends that advertise support via `wp_cache_supports( 'flush_group' )`. The version-sentinel workaround remains the fallback for backends that don't.
- Native-backend read/write paths skip the internal envelope so values are stored raw. Legacy envelopes left behind by the fallback path are unwrapped transparently on read.

### Changed
- Minimum WordPress version bumped from **5.0** to **6.1**.
- `ObjectCache` refactored: public methods reduced to thin dispatchers; native and fallback paths split into single-responsibility private helpers.

## 2.0.1

### Fixed
- PHP 8.4 implicit-nullable deprecation on `ObjectCache::get()`.

## 2.0.0

### Changed
- Refactored the library into `Contracts` / `Storage` / `Support` with dependency injection and a full test suite.
- Prefix is now required at construction time (`new Cache( 'my_plugin' )`); previously a shared `duckdev_cache` prefix was hardcoded.
- `can_cache` filter renamed to `{prefix}_can_cache`.

### Fixed
- `remember()` / `forget()` now correctly treat a cached `0`, `''`, `[]`, or `false` as a hit instead of re-running the callback.
