# Changelog

## 3.0.0

Rebrand from DuckDev to FoxeLabs. No behavioural changes — but the rename touches the namespace and the filter name, so it is a breaking release.

::: warning Upgrading from 1.x? Migrate your stored keys
The rebrand renames no storage keys — they are derived from your own `prefix`, not from a vendor name. But if you are coming from the DuckDev **1.x** release you also cross the 2.0.0 key rename (`{prefix}_reviews_*` → `{prefix}_review_*`), and **the library does not migrate that for you.**

Nothing errors if you skip it: the old rows are orphaned, the timer reseeds, and every admin — including those who already dismissed under 1.x — is prompted again after `days`.

See [Migrating from 1.x](./installation#migrating-from-1-x) for the migration recipe. Upgrading from 2.x needs no data migration.
:::

### Changed
- Composer package renamed `duckdev/wp-review-notice` → **`foxelabs/wp-review-notice`**. Update your `composer.json` require entry.
- Namespace renamed `DuckDev\Reviews\` → **`FoxeLabs\Reviews\`**. Update every `use` statement and class reference.
- Filter renamed `duckdev_reviews_notice_message` → **`foxelabs_reviews_notice_message`**.
- The notice wrapper's HTML `id` changed from `duckdev-reviews-{slug}` to **`foxelabs-reviews-{slug}`**. Update any CSS or JS that targets it.

### Unchanged
- Public API (`Notice::create()`, `register()`, `render()`, every interface), the option list, and all behaviour.
- Storage keys are derived from your own `prefix` (`{prefix}_review_*`), so persisted schedules and dismissals survive the upgrade untouched.

## 2.0.0

Clean break — no compatibility shim from v1.

### Changed
- `Notice::get( $slug, $name, $opts )` → `Notice::create( $slug, $name, $opts )->register()`. The constructor no longer auto-registers on `is_admin()`; `register()` is now explicit.
- **Breaking:** storage keys namespaced under `{prefix}_review_*` — `{prefix}_reviews_time` → `{prefix}_review_time` (site option) and `{prefix}_reviews_dismissed` → `{prefix}_review_dismissed` (user meta). These are the keys that need migrating.
- The action GET parameter moved `{prefix}_reviews_action` → `{prefix}_review_action`. No migration needed — it only ever exists in a link the notice renders.
- Message now runs through `wp_kses_post()` (was echoed raw).
- `is_time()` (mutating) replaced with `isDue()` (pure read); seeding is handled by `start()` inside `register()`.
- Screen gate dropped from `ActionRouter`; action links are inlined.

### Migration
Existing 1.x schedules and dismissals are invisible to the new key names, so users will see the prompt again on the new schedule. Host plugins must move the two keys themselves — see [Migrating from 1.x](./installation#migrating-from-1-x) for the recipe, including the ordering trap around `register()` seeding the new timer key.
