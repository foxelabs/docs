---
description: "Full release history of Loggedin, the WordPress plugin that limits concurrent login sessions per user."
title: Changelog
---

# Changelog

Full release history for **Loggedin**. The plugin's bundled
`readme.txt` keeps only the latest couple of releases; the complete
history lives here.

## 3.4.0

### Added

* A new settings screen under **Users → Loggedin**, with a sidebar of pages: **Settings** › [Login limits](/loggedin/general-settings), [Lockout & recovery](/loggedin/lockout-recovery) and [Auto logout](/loggedin/auto-logout); **Manage** › [Sessions](/loggedin/force-logout); **More** › [Add-ons](/loggedin/addons/) and Help. Each page has its own address (`&tab=lockout`), and **Save** sits in the page header, with **Discard** and a count of unsaved changes. See [The settings screen](/loggedin/general-settings#the-settings-screen).
* Login limits points to the [Limit Per Role](/loggedin/addons/limit-per-role) and [Limit Per User](/loggedin/addons/limit-per-user) add-ons under the limit, each hint hidden once its add-on is active. The Add-ons page shows placeholder cards while the list loads.
* Keyboard and screen reader support on the new screens: after you remove a row from a per-role table, focus moves to **Add a role**; the **Message** label on Lockout & recovery is linked to its text box; and each **Sign out** button under **Your sessions** names the device and when it signed in. On phones, a divider separates stacked role rows.
* [Don't limit administrators](/loggedin/lockout-recovery#administrators) — users who can manage the site can sign in on any number of devices and are never signed out by the limit.
* The [blocked-login message](/loggedin/lockout-recovery#message) can be set on the Lockout & recovery page. A link, bold and italics are allowed. The `loggedin_error_message` filter still has the last word.
* [Self-unlock by email](/loggedin/lockout-recovery#let-blocked-users-sign-out-their-other-devices) — a user refused by Block New can email themselves a link that signs out their other devices, then log in. The offer only appears after the right password. Links are single-use, expire after 15 minutes, and at most one email goes out per user every 5 minutes.
* A device [signed out by a newer login](/loggedin/lockout-recovery#signed-out-by-a-newer-login) under Logout Oldest or Logout All is told why on the login screen, or [sent to a page you choose](/loggedin/lockout-recovery#send-them-to-this-page-instead) on its next front-end page view.
* [Auto logout](/loggedin/auto-logout) is now free and built in: idle logout with a warning countdown, timeouts per role (the shortest wins), and session length for normal and "Remember Me" logins. Off by default. A REST request from a session that just idled out gets a `loggedin_idle_logout` error (status 401) carrying the login URL, and the Loggedin screen sends you there.
* [Sign out on password change](/loggedin/user-sessions#sign-out-on-password-change) — a password change or reset ends the user's other sessions, so sessions that can no longer be used stop counting towards the limit. On by default.
* [Users screen](/loggedin/user-sessions#the-users-screen): a **Sessions** column, a sortable **Last login** column, and a **Sign out everywhere** row and bulk action.
* [Your sessions](/loggedin/user-sessions#your-own-profile) on the profile screen: every device you're signed in on, with the device, a masked IP address and when it signed in, and a **Sign out** button for each other device. Someone else's profile shows a count.
* [`loggedin_settings_schema`](/loggedin/developer-docs#declaring-settings-in-php) — add-ons can declare pages, cards and fields in PHP, including a per-role table, and ship no admin JavaScript. Add-ons with a screen of their own can draw it with [`window.loggedin.ui`](/loggedin/developer-docs#window-loggedin-ui), whose `TableCard` fits a table of six or seven columns on a 1280px screen without scrolling sideways.
* A notice lists add-ons built for the old settings screen: Active Sessions before 1.2.0, Limit Per Role and Real-time Logout before 2.2.0. Filterable with [`loggedin_addon_minimum_versions`](/loggedin/developer-docs#loggedin-addon-minimum-versions).
* Filters [`loggedin_displaced_message`](/loggedin/developer-docs#loggedin-displaced-message), [`loggedin_unlock_email`](/loggedin/developer-docs#loggedin-unlock-email), [`loggedin_settings_schema`](/loggedin/developer-docs#loggedin-settings-schema), [`loggedin_addon_minimum_versions`](/loggedin/developer-docs#loggedin-addon-minimum-versions) and [`loggedin_auto_logout_timeout`](/loggedin/developer-docs#loggedin-auto-logout-timeout).
* Actions [`loggedin_unlock_requested`](/loggedin/developer-docs#loggedin-unlock-requested), [`loggedin_unlocked`](/loggedin/developer-docs#loggedin-unlocked), [`loggedin_password_signout`](/loggedin/developer-docs#loggedin-password-signout), [`loggedin_users_list_sign_out`](/loggedin/developer-docs#loggedin-users-list-sign-out) and [`loggedin_auto_logout_expired`](/loggedin/developer-docs#loggedin-auto-logout-expired).

### Improved

* Logout Oldest and Logout All now also limit [logins that skip the login form](/loggedin/compatibility) — social login, magic links and popup logins that call `wp_set_auth_cookie()` directly. Block New still can't refuse those logins.
* Block New checks the password before showing the limit error. A wrong password gets WordPress's usual error, so only the account's owner learns that the limit was reached.
* Logout Oldest skips sessions that have already expired, and ends as many of the oldest live sessions as it takes for the new login to fit, for users who hold more sessions than a since-lowered limit allows.
* [`loggedin_destroy_session`](/loggedin/developer-docs#loggedin-destroy-session) now also fires when a user signs a device out from their profile.
* Add-ons built for the old screen keep working: their panels are drawn as cards on Login limits, and their tabs join the Manage group. Links from before 3.4.0 (`#addons`, `#support`) still open the right page.
* `wp loggedin settings set` accepts `true`/`false`, `yes`/`no`, `on`/`off` or `1`/`0` for on/off settings.
* Login modes added with [`loggedin_logics`](/loggedin/developer-docs#loggedin-logics) can be saved. The add-on that adds one enforces it, and if that add-on goes, the setting reads as **Logout All**.
* The old `?loggedin_logout=1` sign-out link now also needs the `manage_options` capability, as the Sessions page does, and fires [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions).

### Changed

* Requires WordPress 6.5.
* Sites updating from an earlier version keep self-unlock and **Don't limit administrators** off until an administrator turns them on, so nothing changes under them. A one-time notice suggests leaving administrators out of the limit.
* The Force Logout panel moved to **Manage › Sessions**, as **Sign out a user** and **Sign out all users**.
* The Support tab is now **Help**.
* [`loggedin_session_invalidated`](/loggedin/developer-docs#loggedin-session-invalidated) passes the session's hashed token (verifier), like the other session actions, instead of the raw token from the login cookie.

## 3.3.1

### Fixed

* Some valid add-on license keys were rejected with **Invalid license key**. The license endpoint ran the key through `sanitize_text_field()`, which strips a `%` followed by two hex characters (0–9 or a–f, in either case) as if it were a URL-encoded character. Freemius keys can contain exactly that, for example `%bB`, so those keys reached the licensing server shortened. The key is now only trimmed. If an add-on license failed to activate before, [activate it again](/loggedin/addons/#activating-a-license) after updating.

## 3.3.0

### Added

* [Logout All Users](/loggedin/force-logout#logout-all-users) — a button in the Force Logout panel that signs out every account on the site, behind a confirmation dialog. It doesn't loop through users: a single site-wide *logout epoch* timestamp invalidates every session created before it, and each stale session is destroyed on its owner's next request. Instant at any user count, works with any session storage backend, and the admin who triggers it stays logged in.
* [`wp loggedin sessions destroy-all`](/loggedin/wp-cli#wp-loggedin-sessions-destroy-all) — the same site-wide logout from WP-CLI. No exemption there: the CLI has no session of its own, so every session is logged out.
* REST endpoint [`POST /loggedin/v1/sessions/destroy-all`](/loggedin/developer-docs#post-loggedin-v1-sessions-destroy-all) backing the admin button.
* Action [`loggedin_logout_all_users`](/loggedin/developer-docs#loggedin-logout-all-users) — fires once when a site-wide logout is triggered. Note for add-on authors: the per-user `loggedin_destroy_all_sessions` action does **not** fire for a bulk logout.
* Action [`loggedin_session_invalidated`](/loggedin/developer-docs#loggedin-session-invalidated) — fires for each stale session as the epoch check rejects it.

## 3.2.0

### Improved

* Settings are now built once per request instead of on every read. The session guard checks a setting two or three times per login, and each check previously rebuilt the whole settings array; it is now cached for the request and invalidated whenever the option is written.
* Loggedin is now published under the **Foxe Labs** brand. Nothing about how the plugin works has changed.
* Every link in the plugin now points at the [foxelabs.com](https://foxelabs.com/software/plugins/loggedin) product pages and this documentation site.
* Tested with WordPress 7.1.

### Removed

* The `load_plugin_textdomain()` call. WordPress has loaded translations for wordpress.org-hosted plugins on demand since 4.6, keyed on the `Text Domain` header, so the call was redundant. The bundled `.po`/`.mo` catalogues went with it — translations now come from the wordpress.org language pack.
* The leftover **Loggedin** section on **Settings → General**. Pre-2.0 registered the plugin's options there; 2.0 replaced them with a one-line pointer to the new page for anyone who had bookmarked the old location. Now that 3.x is well established, the pointer is gone — settings live under **Users → Loggedin**.

::: info Extending the plugin
The PHP namespace changed in this release. If you have written an add-on or
custom code against it, see the [architecture
overview](/loggedin/developer-docs#architecture-overview) — the old class name
still resolves, so nothing breaks while you update.
:::

## 3.1.0

### Added

* [WP-CLI support](/loggedin/wp-cli). `wp loggedin sessions` lists, counts and destroys a user's active sessions; `wp loggedin settings` reads and writes plugin settings. The `<user>` argument accepts an ID, username or email address, the same as the Force Logout panel.
* `wp loggedin sessions destroy <user> --token=<hash>` signs a user out of a single device instead of all of them, using the token hash from `sessions list`.
* Action [`loggedin_destroy_session`](/loggedin/developer-docs#loggedin-destroy-session) — fires when an individual session is destroyed, complementing `loggedin_destroy_all_sessions`.
* Action [`loggedin_cli_init`](/loggedin/developer-docs#loggedin-cli-init) — add-ons can register their own subcommands under the `wp loggedin` namespace.

### Improved

* Renamed to **Loggedin - Session Manager, Limit Concurrent Logins & Force Logout**, reflecting the plugin's broader scope as a session manager rather than a limiter alone. The plugin slug, settings, hooks and behaviour are all unchanged — only the display name differs, so the entry in your Plugins list will read differently after updating.
* `wp loggedin settings set` validates through the same sanitizer as the REST API and refuses a value it would reject, instead of storing the default. Without this, a typo such as `settings set logic nonsense` would silently reset a site from **Block New** back to the default **Logout All**, loosening the limit.
* `--token` passed without a value is rejected rather than falling through to "destroy every session" — an unset shell variable can no longer sign a user out everywhere.
* CLI commands are registered only on WP-CLI requests, so the command classes are never loaded during a normal page load.

## 3.0.2

### Added

* Review-request notice is back after being dropped in the 3.0 refactor. Now powered by the [`duckdev/wp-review-notice`](https://github.com/foxelabs/wp-review-notice) library, scoped to the **Users → Loggedin** screen only, and prompts after 7 days of use.

### Improved

* Admin notices (including the review prompt itself) are relocated into the centered page column so they sit between the plugin header and the settings panels instead of above the header.
* Pre-3.0.2 review-notice state is migrated in-place: users who clicked **No thanks** in an earlier version stay dismissed, and anyone with a **Maybe later** deferral keeps their scheduled show time. Legacy option `loggedin_rating_notice` and user meta `loggedin_rating_notice_dismissed` are renamed to the library's storage layout in a single upgrader pass.

### Fixed

* Left-hand gap between the plugin header and the admin sidebar caused by WordPress's default `#wpcontent` padding; the header now sits flush.

## 3.0.1

### Added

* JavaScript filter [`loggedin.admin.tabs`](/loggedin/developer-docs#loggedin-admin-tabs) — add-ons can register their own React component as a tab in the Loggedin admin nav. Supports `before` / `after` positioning hints and same-key replacement of built-in tabs.
* Cross-sell banner on the Force Logout panel, routed through the new [`loggedin.settings.force_logout.cross_sell`](/loggedin/developer-docs#loggedin-settings-force-logout-cross-sell) filter — add-ons return `null` (or their own React node) to hide / replace the default promo.

### Improved

* Add-on card layout reworked — primary CTA pinned to the left of the footer, **More details** link on the right, title-cased license button labels.

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
* Logout Oldest logic. Thanks [#19](https://github.com/joel-james/loggedin/pull/19).

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
