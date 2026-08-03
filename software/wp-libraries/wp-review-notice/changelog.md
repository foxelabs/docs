# Changelog

## 2.0.0

Clean break — no compatibility shim from v1.

### Changed
- `Notice::get( $slug, $name, $opts )` → `Notice::create( $slug, $name, $opts )->register()`. The constructor no longer auto-registers on `is_admin()`; `register()` is now explicit.
- Storage keys namespaced under `{prefix}_review_*` (was `{prefix}_reviews_time` etc.).
- Message now runs through `wp_kses_post()` (was echoed raw).
- `is_time()` (mutating) replaced with `isDue()` (pure read); seeding is handled by `start()` inside `register()`.
- Screen gate dropped from `ActionRouter`; action links are inlined.

### Migration
Existing v1 schedules are ignored after upgrade (different option key), so users will see the prompt again on the new schedule. If that matters, write a small migration in your plugin to rename the option once.
