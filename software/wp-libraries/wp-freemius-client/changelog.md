# Changelog

## 3.0.0

Rebrand from DuckDev to Foxe Labs, and a rename from `freemius-plugin-licensing` to `wp-freemius-client` to match the sibling `wp-*` libraries.

::: danger Required: migrate your activation data
This release renames the option that stores every license activation. **Host plugins must migrate it themselves — the library does not.** If you skip this step there is no error and no warning: every license silently reads as inactive, activation UI resets, and premium update delivery stops.

See [Migrating from 2.x](./installation#migrating-from-2-x) for the migration recipe.
:::

### Changed
- Composer package renamed `duckdev/freemius-plugin-licensing` → **`foxelabs/wp-freemius-client`**.
- Namespace renamed `DuckDev\Freemius\` → **`FoxeLabs\Freemius\`**. Update every `use` statement.
- **Breaking:** the activation option key moved from `duckdev_freemius_activation_data` → **`foxelabs_freemius_activation_data`**. This is the one that needs migrating.
- The addon cache transient prefix moved from `duckdev_freemius_{plugin_id}_` → `foxelabs_freemius_{plugin_id}_`. No migration needed — these are 24-hour caches that repopulate on the next API call, and WordPress expires the stale rows on its own.

### Unchanged
- Public API (`Freemius::get_instance()`, `license()`, `update()`, `addon()`, `plugin()`), the constructor options, and all behaviour.
- The stored activation *data shape* — only the option name changed, so a straight copy is enough.

## 2.0.2

- Tests: gate `ReflectionProperty::setAccessible` on PHP < 8.1.
- CI: consolidate `phpcs`, `phpunit`, and release into a single workflow.
- Fix tests: read the response code from the array and drop the deprecated `setAccessible` call.

## 2.0.0

- Rewritten as a lite, UI-free Freemius SDK — no admin screens, host plugins own the UI.
- Modular architecture: DI container (`Freemius`), `Api/`, `Services/` (`License`, `Update`, `Addon`), `Storage/`, `Data/`, `Contracts/`.
- License activation / deactivation, update delivery, and addon listing against the Freemius API.
- Signed API requests using the FS / FSP header-signing scheme.
- Full unit-test suite.
