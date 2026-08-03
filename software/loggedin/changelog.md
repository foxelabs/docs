---
title: Changelog
---

# Changelog

Full release history for **Loggedin**. The plugin's bundled
`readme.txt` keeps only the latest couple of releases; the complete
history lives here.

## 3.1.0

### Added

* [WP-CLI support](/loggedin/wp-cli). `wp loggedin sessions` lists, counts and destroys a user's active sessions; `wp loggedin settings` reads and writes plugin settings. The `<user>` argument accepts an ID, username or email address, the same as the Force Logout panel.
* `wp loggedin sessions destroy <user> --token=<hash>` signs a user out of a single device instead of all of them, using the token hash from `sessions list`.
* Action [`loggedin_destroy_session`](/loggedin/developer-docs#loggedin_destroy_session) — fires when an individual session is destroyed, complementing `loggedin_destroy_all_sessions`.
* Action [`loggedin_cli_init`](/loggedin/developer-docs#loggedin_cli_init) — add-ons can register their own subcommands under the `wp loggedin` namespace.

### Improved

* Renamed to **Loggedin - Session Manager, Limit Concurrent Logins & Force Logout**, reflecting the plugin's broader scope as a session manager rather than a limiter alone. The plugin slug, settings, hooks and behaviour are all unchanged — only the display name differs, so the entry in your Plugins list will read differently after updating.
* `wp loggedin settings set` validates through the same sanitizer as the REST API and refuses a value it would reject, instead of storing the default. Without this, a typo such as `settings set logic nonsense` would silently reset a site from **Block New** back to the default **Logout All**, loosening the limit.
* `--token` passed without a value is rejected rather than falling through to "destroy every session" — an unset shell variable can no longer sign a user out everywhere.
* CLI commands are registered only on WP-CLI requests, so the command classes are never loaded during a normal page load.

## 3.0.2

### Added

* Review-request notice is back after being dropped in the 3.0 refactor. Now powered by the [`duckdev/wp-review-notice`](https://github.com/duckdev/wp-review-notice) library, scoped to the **Users → Loggedin** screen only, and prompts after 7 days of use.

### Improved

* Admin notices (including the review prompt itself) are relocated into the centered page column so they sit between the plugin header and the settings panels instead of above the header — matches the 404 to 301 plugin shell.
* Pre-3.0.2 review-notice state is migrated in-place: users who clicked **No thanks** in an earlier version stay dismissed, and anyone with a **Maybe later** deferral keeps their scheduled show time. Legacy option `loggedin_rating_notice` and user meta `loggedin_rating_notice_dismissed` are renamed to the library's storage layout in a single upgrader pass.

### Fixed

* Left-hand gap between the plugin header and the admin sidebar caused by WordPress's default `#wpcontent` padding; the header now sits flush like the 404 to 301 shell.

## 3.0.1

### Added

* JavaScript filter [`loggedin.admin.tabs`](/loggedin/developer-docs#loggedin-admin-tabs) — add-ons can register their own React component as a tab in the Loggedin admin nav. Supports `before` / `after` positioning hints and same-key replacement of built-in tabs.
* Cross-sell banner on the Force Logout panel, routed through the new [`loggedin.settings.force_logout.cross_sell`](/loggedin/developer-docs#loggedin-settings-force-logout-cross-sell) filter — add-ons return `null` (or their own React node) to hide / replace the default promo.

### Improved

* Add-on card layout now matches the 404 to 301 plugin — primary CTA pinned to the left of the footer, **More details** link on the right, title-cased license button labels.

### Fixed

* The v2 → v3 settings migration never ran on existing installs, leaving legacy option keys in place after the upgrade.
* CI matrix dropped the PHP 8.3 × WordPress 6.0 combination — that combination is unsupported by core and was failing the build for no useful signal.

## 3.0.0

### Added

* Modern React-powered admin under **Users → Loggedin** with two tabs — Settings (concurrent-login limit + login logic + Force Logout panel) and Add-ons (catalogue + license management).
* REST API at `/loggedin/v1/` for settings (`GET/POST /settings`), session management (`POST /sessions/destroy`), and add-on licensing (`GET/POST /addons`, `POST/DELETE /addons/{id}/license`).
* Unified `loggedin_settings` option registered with `show_in_rest` — the React admin reads and writes settings through `@wordpress/core-data`, and integrations can use the same endpoint.
* Force Logout panel now accepts a user **ID, email, or username** — pick whichever is fastest to type. The resolver detects the input shape automatically.
* Add-ons module powered by Freemius — first-party add-ons (Real-time Logout, Limit Per User, Limit Per Role) register themselves through the new `loggedin_register_addon` filter and surface in the Add-ons tab.
* JavaScript extension slot — add-ons can append their own React `PanelBody` to the Settings tab via the `loggedin.settings.panels` filter.
* Documented PHP hook surface — `loggedin_init`, `loggedin_settings_defaults`, `loggedin_admin_script_vars`, `loggedin_addons_catalog`, `loggedin_destroy_oldest_session`, plus the existing limit / bypass / error-message filters.

### Improved

* Reorganised plugin structure (PSR-4 namespaces under `DuckDev\Loggedin\`) and aligned with WordPress Coding Standards.
* Comprehensive sanitisation pass across every input and option write path.
* PHP 7.4 is now the minimum supported version.

## 2.0.4

### Improved

* Review-notice scheduling — the dismiss state is now respected on every admin page load instead of being re-evaluated only on the plugin's own settings screen.

### Fixed

* Invalid nonce action prevented review notices from being dismissed; dismissing now persists across reloads.

## 2.0.3

### Improved

* Removed leftover debug code that shipped accidentally in 2.0.2.

## 2.0.2

### Fixed

* Nonce verification on the Force Logout action.
* Uninstall routine now cleans up every option and user-meta key the plugin creates.

## 2.0.1

### Fixed

* Fatal errors triggered on activation under specific PHP configurations.
* Empty Add-ons page when the licensing backend was unreachable at first load.

## 2.0.0

### Added

* Settings page.
* Add-ons.
* Logout Oldest logic. Thanks [#19](https://github.com/Joel-James/loggedin/pull/19).

### Improved

* Coding standards.
* Sanitization.

## 1.3.2

### Fixed

* Security fixes.

## 1.3.1

### Improved

* Support for AJAX logins. Thanks [Carlos Faria](https://github.com/cfaria).

## 1.3.0

### Improved

* "Allow" login logic now runs only after the password check so an invalid login no longer disturbs existing sessions.

## 1.2.0

### Added

* Ability to choose between the available login-logic modes from the settings screen.

## 1.1.0

### Added

* Force-logout panel in the admin to clear every active session for a chosen user.
* Cleanup routine that removes plugin options when the plugin is uninstalled.
* Review notice prompting happy users to leave a rating.

### Improved

* General code clean-up.

## 1.0.1

### Fixed

* Misspelled variable.

## 1.0.0

### Added

* Initial release.
