---
description: "Actions, filters, settings panels and other public extension points for customising the Loggedin WordPress plugin."
title: Developer Docs
---

# Developer Docs

Loggedin ships with a stable extension surface so you can customise
behaviour without touching plugin files. Everything documented on this
page is part of the public API and will keep working across minor
releases — PHP actions and filters, the
[add-on screen API](#add-on-screen-api) (`loggedin_settings_schema` and
the JS filters), the `/loggedin/v1` REST endpoints, and the option
schema.

All PHP examples can be dropped into your theme's `functions.php` or a
small companion plugin.

[[toc]]

## Architecture overview

```
FoxeLabs\Loggedin\
├── Plugin                       Constants (version, slug, option key, REST namespace)
├── Core                         Boot orchestrator — wires every module and fires loggedin_init
├── Setup\{Settings, Upgrader}   Options store + version bump handler
├── Front\Session_Guard          Hooks the WordPress auth pipeline; enforces the cap
├── Front\{Session_Store,        Single-session reads and ends (default storage only),
│          Logout_Epoch}         and the site-wide logout epoch
├── Front\{Unlock, Displaced}    Self-unlock by email; the "signed out by a newer login" notice
├── Front\{Password_Signout,     Ends other sessions on a password change;
│          Last_Login}           records the last login time
├── Auto_Logout\{Settings,       Idle logout and session length
│   Idle_Guard, Lifetime,
│   Retired_Addon}
├── Admin\{Admin, Assets}        Menu + page + React bundle enqueue (admin only)
├── Admin\{Users_List,           Users screen columns and actions; "Your sessions" on the profile;
│   Profile_Sessions,            the one-time administrator notice
│   Exempt_Admins_Notice}
├── Addons\{Addons, Catalog,     Freemius wiring, shaped catalogue for the React UI,
│           Outdated_Addons}     and the "add-on needs an update" notice
├── Api\{Endpoint, Settings,
│         Sessions, Addons}      REST controllers under /loggedin/v1
├── Cli\…                        WP-CLI commands (WP-CLI requests only)
├── Contracts\Singleton          Shared trait used by every module
└── Utils\…                      Shared helpers
```

::: info Namespace changed in 3.2.0
These classes lived under `DuckDev\Loggedin\` before 3.2.0, when the plugin
moved to the Foxe Labs brand. `DuckDev\Loggedin\Plugin` is kept as an alias so
add-ons and custom code written against the old name keep working, but new code
should use `FoxeLabs\Loggedin\`. Hook, filter and option names all start with
`loggedin_` and were not affected.
:::

The recommended way to extend the plugin is:

1. Hook into [`loggedin_init`](#loggedin-init) so your code runs only after
   every subsystem is up.
2. Use the documented filters and actions for everything you can — they
   are guaranteed stable.
3. For settings, declare cards and fields in PHP with
   [`loggedin_settings_schema`](#loggedin-settings-schema). Core draws them
   with its own controls and saves them with the page header's **Save**,
   so you ship no admin JavaScript. A screen of your own goes through
   [`loggedin.admin.tabs`](#loggedin-admin-tabs), drawn with
   [`window.loggedin.ui`](#window-loggedin-ui). See the
   [add-on screen API](#add-on-screen-api).

## Plugin constants

Useful when writing extensions or talking to the plugin from a sibling
add-on. All live on `FoxeLabs\Loggedin\Plugin`:

| Constant | Value | Purpose |
| --- | --- | --- |
| `VERSION` | `3.4.0` | Current plugin version. |
| `SLUG` | `loggedin` | Plugin slug; matches the Freemius and i18n slugs. |
| `TEXT_DOMAIN` | `loggedin` | Translation text domain. |
| `OPTION_KEY` | `loggedin_settings` | WP option name where every plugin setting is stored. |
| `VERSION_KEY` | `loggedin_version` | WP option holding the last version the upgrader ran for. |
| `REST_NAMESPACE` | `loggedin/v1` | Namespace for every REST route the plugin registers. |
| `FREEMIUS_ID` | `19328` | The parent plugin's Freemius id. |

## Settings storage

Loggedin stores its core settings in a single WP option:
**`loggedin_settings`**. The shape is:

```php
array(
    'maximum'            => 1,        // int, ≥1. Concurrent-session cap.
    'logic'              => 'allow',  // enum: 'allow' | 'logout_oldest' | 'block'.
    'exempt_admins'      => true,     // bool. "Don't limit administrators". Since 3.4.0.
    'message'            => '',       // string. Blocked-login message; '' = built-in. Since 3.4.0.
    'unlock'             => true,     // bool. Self-unlock by email. Since 3.4.0.
    'displaced_redirect' => '',       // string. URL for devices signed out by a newer login; '' = none. Since 3.4.0.
    'password_signout'   => true,     // bool. End other sessions on a password change. Since 3.4.0.
)
```

| Key | Screen | Notes |
| --- | --- | --- |
| `maximum`, `logic` | [Login limits](/loggedin/general-settings) | |
| `exempt_admins` | [Lockout & recovery](/loggedin/lockout-recovery#administrators) | `true` for new installs; set to `false` on sites updated from before 3.4.0. |
| `message` | [Lockout & recovery](/loggedin/lockout-recovery#message) | Sanitised with `wp_kses()`: only `<a href>`, `<strong>` and `<em>` survive. |
| `unlock` | [Lockout & recovery](/loggedin/lockout-recovery#let-blocked-users-sign-out-their-other-devices) | `true` for new installs; set to `false` on sites updated from before 3.4.0. |
| `displaced_redirect` | [Lockout & recovery](/loggedin/lockout-recovery#send-them-to-this-page-instead) | Sanitised with `esc_url_raw()` (`http` and `https` only), then `wp_validate_redirect()`: an address on a host that isn't allowed for redirects is stored as `''`. |
| `password_signout` | [Auto logout](/loggedin/user-sessions#sign-out-on-password-change) | `true` on new and updated sites. |

Auto logout keeps its settings in two options of its own, with the names
the retired Auto Logout add-on used:

```php
// loggedin_auto_logout_settings
array(
    'idle_timeout'      => 0,   // int, minutes, 0–43200. 0 = idle logout off.
    'warning'           => 60,  // int, seconds, 0–3600.
    'session_lifetime'  => 0,   // int, hours, 0–8760. 0 = WordPress default.
    'remember_lifetime' => 0,   // int, days, 0–365. 0 = WordPress default.
)

// loggedin_auto_logout_role_timeouts
array( 'editor' => 30, 'subscriber' => 5 ); // role slug => minutes, 1–43200.
```

The options are registered with `show_in_rest`, so:

- The admin screen reads and writes them through `/wp/v2/settings` via
  `useEntityProp( 'root', 'site', 'loggedin_settings' )`.
- The plugin's own [`GET / POST /loggedin/v1/settings`](#settings-endpoints)
  endpoints exist for CLI / cURL recipes.

The REST schema uses `additionalProperties: false` — **unknown keys are
dropped at the REST boundary**. If you want to extend the option with new
keys, register your own `show_in_rest` site option (the pattern every
official add-on uses) — don't try to write directly to
`loggedin_settings`; your keys will survive in storage but the sanitiser
will drop them on the next save through the UI.

::: info Logic mode internals
- `allow` is the value the screen labels as **Logout All**.
- `logout_oldest` is **Logout Oldest**.
- `block` is **Block New**.

These names are stored exactly as shown; rename them carefully — existing
installs depend on the value, not the label.
:::

## Actions

### `loggedin_init`

Fires once every plugin module has been wired up.

```php
do_action( 'loggedin_init', \FoxeLabs\Loggedin\Core $core );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$core` | `Core` | The shared `Core` instance, for context. |

This is the canonical place for an add-on plugin to boot itself — the
Settings store and the REST namespace are guaranteed to be ready by the
time this fires.

```php
add_action(
    'loggedin_init',
    array( \FoxeLabs\Loggedin\RealtimeLogout\Plugin::class, 'boot' )
);
```

### `loggedin_login_blocked`

Fires when a login is rejected because the user has reached the limit in
**Block New** mode.

Since 3.4.0 it fires only when the right password was given. A wrong
password gets WordPress's own error and doesn't fire this action.

```php
do_action( 'loggedin_login_blocked', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User id whose login was blocked. |

Use it to add audit logging, send a notification, or trigger anti-abuse
heuristics. The login has already been rejected by the time this fires —
you can't override the decision from here (use
[`loggedin_reached_limit`](#loggedin-reached-limit) or
[`loggedin_bypass`](#loggedin-bypass) for that).

```php
add_action( 'loggedin_login_blocked', function ( $user_id ) {
    error_log( sprintf( 'Loggedin: blocked login for user #%d', $user_id ) );
} );
```

### `loggedin_destroy_all_sessions`

Fires when the plugin destroys all of a user's sessions on one of these
paths:

1. The **Logout All** (`allow`) login logic, when a new login displaces
   every existing session. Since 3.4.0 this includes logins that skip the
   login form (see [Compatibility](/loggedin/compatibility)).
2. **Sign out a user** on the [Sessions page](/loggedin/force-logout),
   and the REST endpoint behind it.

Other ways of signing a user out everywhere fire their own action
instead:
[`loggedin_users_list_sign_out`](#loggedin-users-list-sign-out),
[`loggedin_unlocked`](#loggedin-unlocked),
[`loggedin_password_signout`](#loggedin-password-signout) and, for a
site-wide logout, [`loggedin_logout_all_users`](#loggedin-logout-all-users).

```php
do_action( 'loggedin_destroy_all_sessions', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User whose sessions were cleared. |

```php
add_action( 'loggedin_destroy_all_sessions', function ( $user_id ) {
    // Bust your app's per-user cache, fire a webhook, etc.
} );
```

### `loggedin_destroy_oldest_session`

Fires when the **Logout Oldest** login logic destroys a user's single
oldest active session to make room for a new one.

```php
do_action( 'loggedin_destroy_oldest_session', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User whose oldest session was cleared. |

Note: this fires **only** in `logout_oldest` mode. In `allow` (Logout
All) mode you get [`loggedin_destroy_all_sessions`](#loggedin-destroy-all-sessions)
instead.

Since 3.4.0, a login ends oldest sessions one at a time until the new
one fits, so this can fire more than once for a single login when the
limit was lowered after the user signed in.

### `loggedin_destroy_session`

Fires when a single named session is destroyed, rather than all of a
user's sessions. Triggered by:

- [`wp loggedin sessions destroy --token=`](/loggedin/wp-cli#wp-loggedin-sessions-destroy).
- A user clicking **Sign out** next to one of their devices under
  [Your sessions](/loggedin/user-sessions#your-own-profile) on their
  profile. Since 3.4.0.

```php
do_action( 'loggedin_destroy_session', int $user_id, string $token );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User whose session was destroyed. |
| `$token` | string | Hashed token of the destroyed session. The raw token is never exposed. |

```php
add_action( 'loggedin_destroy_session', function ( $user_id, $token ) {
    // Record which device was signed out.
}, 10, 2 );
```

Since 3.1.0.

### `loggedin_logout_all_users`

Fires once when a site-wide logout is triggered — by the
[Sign out all users](/loggedin/force-logout#logout-all-users) button, the
REST endpoint, or `wp loggedin sessions destroy-all`.

```php
do_action( 'loggedin_logout_all_users', int $epoch );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$epoch` | int | Unix timestamp sessions must be newer than to stay valid. |

Treat this as "every session older than `$epoch` is now dead". The
per-user [`loggedin_destroy_all_sessions`](#loggedin-destroy-all-sessions)
action never fires for a bulk logout — no per-user loop runs. Sessions
are destroyed lazily, one by one, as their owners next make a request;
each of those destructions fires
[`loggedin_session_invalidated`](#loggedin-session-invalidated).

```php
add_action( 'loggedin_logout_all_users', function ( $epoch ) {
    // Audit-log the site-wide logout.
} );
```

Since 3.3.0.

### `loggedin_session_invalidated`

Fires when a session is rejected by the logout epoch — i.e. its owner
made a request after a [site-wide logout](#loggedin-logout-all-users)
with a session predating it.

```php
do_action( 'loggedin_session_invalidated', int $user_id, string $token );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User whose session was invalidated. |
| `$token` | string | Hashed token of the destroyed session. |

Fires at most once per stale session, at the moment that session's
owner next makes an authenticated request — which may be seconds or
weeks after the bulk logout was triggered, or never.

Since 3.3.0.

### `loggedin_unlock_requested`

Fires after a user blocked by **Block New** is emailed a link to sign out
their other devices — step 2 of
[self-unlock](/loggedin/lockout-recovery#let-blocked-users-sign-out-their-other-devices).

```php
do_action( 'loggedin_unlock_requested', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User the email went to. |

It fires only when the email was handed to `wp_mail()`. It doesn't fire
when the link was invalid, when an email already went out in the last
five minutes, or when sending failed.

```php
add_action( 'loggedin_unlock_requested', function ( $user_id ) {
    error_log( sprintf( 'Loggedin: unlock email sent to user #%d', $user_id ) );
} );
```

Since 3.4.0.

### `loggedin_unlocked`

Fires after a user opens the link in the unlock email and every one of
their sessions is destroyed.

```php
do_action( 'loggedin_unlocked', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User who was signed out everywhere. |

[`loggedin_destroy_all_sessions`](#loggedin-destroy-all-sessions) does
not fire on this path.

Since 3.4.0.

### `loggedin_password_signout`

Fires after a password change or reset ended the user's other sessions.
Only fires while the **Sign out the other devices** setting
(`password_signout`) is on. See
[Sign out on password change](/loggedin/user-sessions#sign-out-on-password-change).

```php
do_action( 'loggedin_password_signout', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User whose password changed. |

When the user changed their own password, the session they did it from
is kept. Otherwise every session is destroyed.

Since 3.4.0.

### `loggedin_users_list_sign_out`

Fires after an administrator signs a user out of every device with the
**Sign out everywhere** row or bulk action on the
[Users screen](/loggedin/user-sessions#sign-out-everywhere). A bulk
action fires it once per user signed out.

```php
do_action( 'loggedin_users_list_sign_out', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User who was signed out. |

If the administrator signed themselves out, the session they are using
was kept.

Since 3.4.0.

### `loggedin_auto_logout_expired`

Fires immediately before an idle session is ended by
[auto logout](/loggedin/auto-logout), while the user can still be
resolved. Useful for audit logs.

```php
do_action( 'loggedin_auto_logout_expired', int $user_id, int $timeout );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User whose session is ending. |
| `$timeout` | int | Resolved timeout in **seconds**. |

```php
add_action( 'loggedin_auto_logout_expired', function ( $user_id, $timeout ) {
    error_log( sprintf(
        'User %d signed out after %d seconds idle.',
        $user_id,
        $timeout
    ) );
}, 10, 2 );
```

Since 3.4.0 in core. The retired Auto Logout add-on 1.0.0 added it, with
the same name and arguments.

### `loggedin_cli_init`

Fires after Loggedin registers its own [WP-CLI commands](/loggedin/wp-cli),
and only on WP-CLI requests. Add-ons should register subcommands here —
by this point the parent `wp loggedin` command exists, so a nested
command name resolves correctly.

```php
do_action( 'loggedin_cli_init' );
```

```php
add_action( 'loggedin_cli_init', function () {
    WP_CLI::add_command( 'loggedin my-addon', My_Addon_Command::class );
} );
```

Since 3.1.0.

## Filters

### `loggedin_settings_defaults`

Filters the default values returned by `Settings::defaults()`. Useful
when you're registering your own settings keys that should ship a
sensible default for first-time reads.

```php
apply_filters( 'loggedin_settings_defaults', array $defaults );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$defaults` | array | Defaults keyed by setting id. |

```php
add_filter( 'loggedin_settings_defaults', function ( $defaults ) {
    $defaults['my_addon_flag'] = true;
    return $defaults;
} );
```

::: warning Schema vs defaults
Adding a key here does **not** make it acceptable to the
`/wp/v2/settings` endpoint — the REST schema for `loggedin_settings`
rejects unknown keys. For settings that need a UI, register your own
site option via `register_setting()` with `show_in_rest` (see
[Adding a custom Settings panel](#adding-a-custom-settings-panel)) — it's
what the official add-ons do.
:::

### `loggedin_logics`

Filters the catalogue of available **Login Logic** modes. Each entry is
a `{ label, desc }` map keyed by the mode id.

```php
apply_filters( 'loggedin_logics', array $logics );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$logics` | array | `[ mode_id => [ 'label' => string, 'desc' => string ] ]` |

```php
add_filter( 'loggedin_logics', function ( $logics ) {
    $logics['notify_only'] = array(
        'label' => __( 'Notify Only', 'my-plugin' ),
        'desc'  => __( 'Email the user; do not block the login.', 'my-plugin' ),
    );

    return $logics;
} );
```

::: danger Adding a mode is two-step
The Settings sanitiser hard-codes the list of allowed modes (`allow`,
`logout_oldest`, `block`). If you only hook `loggedin_logics`, your new
mode appears as a tile on Login limits but gets **silently reverted** to `allow`
on save. To make it stick you also need to:

1. Hook `pre_update_option_loggedin_settings` (or a wrapper option's
   `sanitize_callback`) to whitelist your mode before WordPress hands the
   value to Loggedin's sanitiser, **or**
2. Translate your mode into one of the built-in modes via your own hook
   on [`loggedin_reached_limit`](#loggedin-reached-limit) or a custom
   action handler.

For most extensions the cleaner path is to keep the visible logic on a
built-in mode and add the extra behaviour as a side effect of
[`loggedin_destroy_all_sessions`](#loggedin-destroy-all-sessions) or
[`loggedin_login_blocked`](#loggedin-login-blocked).
:::

### `loggedin_admin_script_vars`

Filters the JS payload localised as `window.loggedin` on the plugin
admin page. Use this to ship extra data to a
[custom Settings panel](#adding-a-custom-settings-panel) so it doesn't
have to make a REST round-trip just to bootstrap.

```php
apply_filters( 'loggedin_admin_script_vars', array $vars );
```

Default keys: `version`, `slug`, `name`, `page`, `restUrl`, `restNonce`,
`adminUrl`, `logics`. Since 3.4.0 also `wpVersion`, `phpVersion`, `urls`,
`defaultMessage`, `activeAddons` (slugs of the registered add-ons),
`roles` (`{ slug: name }`), `autoLogout` (the largest allowed values) and
`schema` (the resolved [`loggedin_settings_schema`](#loggedin-settings-schema)).

`window.loggedin.ui` is not part of this payload: the admin script adds it
in the browser. See [`window.loggedin.ui`](#window-loggedin-ui).

```php
add_filter( 'loggedin_admin_script_vars', function ( $vars ) {
    $vars['my_feature_flag'] = (bool) get_option( 'my_feature_flag' );
    return $vars;
} );
```

In your React panel:

```js
const flag = window.loggedin?.my_feature_flag ?? false;
```

### `loggedin_register_addon`

The mechanism every official add-on uses to register itself with the
parent plugin's Freemius pipeline.

```php
apply_filters( 'loggedin_register_addon', array $addons );
```

The array is keyed by **Freemius product id**; each value is the SDK
config payload:

```php
add_filter( 'loggedin_register_addon', function ( $addons ) {
    $addons[ 1234 ] = array(
        'slug'       => 'my-loggedin-addon',
        'is_premium' => true,
        'main_file'  => __FILE__,
        'public_key' => 'pk_abcdef1234567890',
    );

    return $addons;
} );
```

::: warning Official add-ons only
This filter wires an add-on into the Loggedin Freemius project.
Self-hosted or third-party plugins should not hook here — they need their
own Freemius project (or no licensing at all). The filter is documented
because every official add-on uses it and our own examples reference it.
:::

### `loggedin_addons_catalog`

Filters the decorated addon catalogue right before it's returned by
[`GET /loggedin/v1/addons`](#get-loggedin-v1-addons). Use this to splice
in custom rows for a self-hosted / white-label build of the Add-ons page.

```php
apply_filters( 'loggedin_addons_catalog', array $items, array $raw );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$items` | array | Shaped rows the React UI consumes. |
| `$raw` | array | Raw catalogue rows from the Freemius SDK. |

Each shaped row carries: `id`, `title`, `icon`, `link`, `description`,
`homepage`, `is_premium`, `is_active`, `is_license_active`, `license_key`,
`banner`, `banner_large`.

### `loggedin_reached_limit`

The core override hook for the concurrent-session check. Runs every time
a user authenticates, after the global verdict has been computed but
before any sessions are destroyed.

```php
apply_filters( 'loggedin_reached_limit', bool $reached, int $user_id, int $count );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$reached` | bool | Whether the upstream check says the limit is reached. |
| `$user_id` | int | User id being checked. |
| `$count` | int | Current count of active session tokens. |

```php
// Allow user 123 up to 10 sessions regardless of the global cap.
add_filter( 'loggedin_reached_limit', function ( $reached, $user_id, $count ) {
    if ( 123 === (int) $user_id ) {
        return $count >= 10;
    }

    return $reached;
}, 10, 3 );
```

This is the same filter the
[Limit Per Role](/loggedin/addons/limit-per-role) (priority `10`) and
[Limit Per User](/loggedin/addons/limit-per-user) (priority `11`) add-ons
use. If you write your own hook and want to override either, register at
a higher priority.

::: tip Bypassed users skip this filter
If [`loggedin_bypass`](#loggedin-bypass) returns true for the user, the
limit check short-circuits and `loggedin_reached_limit` is never reached.
:::

### `loggedin_bypass`

Filter to exempt a user from the concurrent-session check entirely.
Returning `true` means the limit doesn't apply, regardless of the
configured logic mode or per-role / per-user override.

```php
apply_filters( 'loggedin_bypass', bool $bypass, int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$bypass` | bool | Whether the user skips the limit. Since 3.4.0 this is `true` for users with `manage_options` while [Don't limit administrators](/loggedin/lockout-recovery#administrators) is on, else `false`. |
| `$user_id` | int | User id being checked. |

Keep `$bypass` in your return value unless you mean to override the
administrator setting:

```php
// Let editors sign in on any number of devices too.
add_filter( 'loggedin_bypass', function ( $bypass, $user_id ) {
    return $bypass || user_can( $user_id, 'edit_others_posts' );
}, 10, 2 );
```

```php
// Allow a specific list of user ids unlimited sessions.
add_filter( 'loggedin_bypass', function ( $bypass, $user_id ) {
    return $bypass || in_array( (int) $user_id, array( 1, 2, 5 ), true );
}, 10, 2 );
```

The filter runs on every check, including logins that skip the login
form.

### `loggedin_error_message`

Filters the error message rendered on wp-login when a user is blocked by
**Block New** mode.

```php
apply_filters( 'loggedin_error_message', string $message );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$message` | string | The [Message](/loggedin/lockout-recovery#message) set on Lockout & recovery, or the built-in message when that's empty. |

```php
add_filter( 'loggedin_error_message', function ( $message ) {
    return __( 'Your account is already signed in elsewhere. Sign out from another device to continue.', 'my-plugin' );
} );
```

The filter runs after the setting, so it wins. When self-unlock is on,
the **Email me a link to sign out my other devices.** link is added
after the filtered message; the filter doesn't see it.

### `loggedin_displaced_message`

Filters the message shown on the login screen to a device that was
[signed out by a newer login](/loggedin/lockout-recovery#signed-out-by-a-newer-login)
under Logout Oldest or Logout All.

```php
apply_filters( 'loggedin_displaced_message', string $text );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$text` | string | Message text. Default: "You were signed out because your account signed in on another device." |

The text is escaped before output, so return plain text, not HTML.

```php
add_filter( 'loggedin_displaced_message', function ( $text ) {
    return __( 'Your membership allows one device at a time, so this one was signed out.', 'my-plugin' );
} );
```

Since 3.4.0.

### `loggedin_unlock_email`

Filters the self-unlock email before it is sent. See
[self-unlock](/loggedin/lockout-recovery#let-blocked-users-sign-out-their-other-devices).

```php
apply_filters( 'loggedin_unlock_email', array $email, WP_User $user );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$email` | array | `to`, `subject` and `message`, passed to `wp_mail()`. The message is plain text and already contains the unlock link. |
| `$user` | `WP_User` | User being emailed. |

```php
add_filter( 'loggedin_unlock_email', function ( $email, $user ) {
    $email['subject'] = __( 'Sign out of your other devices', 'my-plugin' );

    return $email;
}, 10, 2 );
```

If you rewrite `message`, keep the link from the original text: it is
the only way to finish the unlock.

Since 3.4.0.

### `loggedin_auto_logout_timeout`

Filters the idle timeout for a user, **in minutes**, after
[timeouts per role](/loggedin/auto-logout#timeouts-per-role) have been
applied. Return `0` to exempt the user from idle logout.

```php
apply_filters( 'loggedin_auto_logout_timeout', int $minutes, ?WP_User $user );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$minutes` | int | Resolved timeout in minutes. `0` means idle logout is off. |
| `$user` | `WP_User\|null` | The user being resolved. |

```php
// Never sign out the kiosk display account.
add_filter( 'loggedin_auto_logout_timeout', function ( $minutes, $user ) {
    return $user && user_can( $user, 'kiosk_display' ) ? 0 : $minutes;
}, 10, 2 );
```

With a timeout of `0`, the idle script isn't loaded for that user either.

Since 3.4.0 in core. The retired Auto Logout add-on 1.0.0 added it, with
the same name and arguments.

### `loggedin_settings_schema`

Declares pages, cards and fields for the settings screen from PHP. Core
draws them with its own controls and saves them with the page header's
**Save**.

```php
apply_filters( 'loggedin_settings_schema', array $schema );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$schema` | array | `pages`, `cards` and `fields` lists. Each starts empty. |

The full shape, with an example, is under
[Declaring settings in PHP](#declaring-settings-in-php).

Since 3.4.0.

### `loggedin_addon_minimum_versions`

Filters the first version of each add-on built for the 3.4.0 settings
screen. An add-on installed at an older version is listed in a notice on
the Plugins screen and the Loggedin screen, shown to users who can
update plugins. See
[Add-ons older than the screen](#add-ons-older-than-the-screen).

```php
apply_filters( 'loggedin_addon_minimum_versions', array $minimum );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$minimum` | array | Versions keyed by add-on slug. |

Default:

```php
array(
    'loggedin-active-sessions' => '1.2.0',
    'loggedin-limit-per-role'  => '2.2.0',
    'loggedin-realtime-logout' => '2.2.0',
)
```

The slug is the one the add-on registers through
[`loggedin_register_addon`](#loggedin-register-addon); the installed
version is read from the `Version` header of its `main_file`.

```php
// Ask for the new screen version of my own add-on too.
add_filter( 'loggedin_addon_minimum_versions', function ( $minimum ) {
    $minimum['my-loggedin-addon'] = '2.0.0';

    return $minimum;
} );
```

Since 3.4.0.

## Add-on screen API

Loggedin 3.4.0 rebuilt the settings screen on the Foxe Plugin Admin Kit:
a sidebar of pages in three groups (**Settings**, **Manage**, **More**),
cards on each page, and **Save** in the page header. Add-ons put their
settings on it in one of three ways, newest first:

| Way | Use it for | Ships JS? |
| --- | --- | --- |
| [`loggedin_settings_schema`](#declaring-settings-in-php) (PHP filter) | Settings: numbers, toggles, selects, text and per-role tables, on a core page or a page of your own. | No |
| [`loggedin.admin.tabs`](#loggedin-admin-tabs) (JS filter) + [`window.loggedin.ui`](#window-loggedin-ui) | A screen of your own, such as a list. | Yes |
| [`loggedin.settings.panels`](#loggedin-settings-panels) (JS filter) | A React panel on a page. Kept for add-ons built before 3.4.0. | Yes |

Add-ons add pages to the group their topic belongs to. They don't add a
group, a top-level tab or a banner.

### Declaring settings in PHP

Hook [`loggedin_settings_schema`](#loggedin-settings-schema) and append to
its three lists. Core draws each field with the kit's controls, keeps the
values in the screen's edit buffer, validates numbers, flags the page
**Needs fixing** in the sidebar when a value is out of range, and saves
everything with the page header's **Save**.

Each field's `option` must be a site option registered with
`show_in_rest`, because the screen saves through `/wp/v2/settings`.

This is how [Limit Per Role](/loggedin/addons/limit-per-role) 2.2.0 puts
its card on **Login limits**:

```php
add_filter( 'loggedin_settings_schema', function ( array $schema ) {
    $schema['cards'][] = array(
        'id'          => 'loggedin-limit-per-role',
        'page'        => 'login-limits',
        'title'       => __( 'Limits per role', 'my-addon' ),
        'description' => __( 'Roles not listed here use the maximum above.', 'my-addon' ),
    );

    $schema['fields'][] = array(
        'card'         => 'loggedin-limit-per-role',
        'option'       => 'loggedin_limit_per_role_limits',
        'type'         => 'role-table',
        'label'        => __( 'Maximum active sessions', 'my-addon' ),
        'unit'         => __( 'sessions', 'my-addon' ),
        'min'          => 1,
        'default_from' => 'loggedin_settings.maximum',
        'add_label'    => __( 'Add a role', 'my-addon' ),
    );

    return $schema;
} );
```

And a page of your own, with a keyed number field and a toggle:

```php
add_filter( 'loggedin_settings_schema', function ( array $schema ) {
    $schema['pages'][] = array(
        'id'    => 'my-alerts',
        'title' => __( 'Notifications', 'my-addon' ),
        'group' => 'settings',
        'icon'  => 'notifications',
        'after' => 'auto-logout',
    );

    $schema['cards'][] = array(
        'id'          => 'my-alerts-email',
        'page'        => 'my-alerts',
        'title'       => __( 'Email alerts', 'my-addon' ),
        'description' => __( 'Tell users when their account signs in somewhere new.', 'my-addon' ),
    );

    $schema['fields'][] = array(
        'card'    => 'my-alerts-email',
        'option'  => 'my_alerts',
        'key'     => 'enabled',
        'type'    => 'toggle',
        'label'   => __( 'Send an email on each new login', 'my-addon' ),
        'default' => 0,
    );

    $schema['fields'][] = array(
        'card'     => 'my-alerts-email',
        'option'   => 'my_alerts',
        'key'      => 'quiet',
        'type'     => 'number',
        'label'    => __( 'At most one email every', 'my-addon' ),
        'unit'     => __( 'minutes', 'my-addon' ),
        'unit_one' => __( 'minute', 'my-addon' ),
        'min'      => 1,
        'max'      => 1440,
        'default'  => 60,
        'show_if'  => array( 'key' => 'enabled', 'equals' => 1 ),
    );

    return $schema;
} );

// The option the fields edit, available over REST.
add_action( 'init', function () {
    register_setting( 'loggedin', 'my_alerts', array(
        'type'         => 'object',
        'default'      => array( 'enabled' => 0, 'quiet' => 60 ),
        'show_in_rest' => array(
            'schema' => array(
                'type'       => 'object',
                'properties' => array(
                    'enabled' => array( 'type' => 'integer' ),
                    'quiet'   => array( 'type' => 'integer', 'minimum' => 1, 'maximum' => 1440 ),
                ),
            ),
        ),
    ) );
} );
```

#### Pages

| Key | Required | Description |
| --- | --- | --- |
| `id` | Yes | Page id, used in the address as `&tab=<id>`. An id already taken by a core page is ignored. |
| `title` | Yes | Sidebar and page header text. |
| `group` | No | `settings` (default), `manage` or `more`. |
| `icon` | No | Icon name from the kit: `limits`, `lockout`, `clock`, `notifications`, `sessions`, `history`, `list`, `users`, `user` and others. Defaults to `dot`. |
| `before` / `after` | No | Id of the page to sit before or after. Otherwise the page goes at the end. |

A page you declare shows **Save** in its header. A page with no cards is
left out of the sidebar.

#### Cards

| Key | Required | Description |
| --- | --- | --- |
| `id` | Yes | Card id; fields point at it with `card`. |
| `page` | No | Page to show on: a core page (`login-limits`, `lockout`, `auto-logout`, `sessions`) or one you declared. Defaults to `login-limits`. |
| `title` | Yes | Card title. |
| `description` | No | One sentence under the title. |

Cards from add-ons appear after the page's own cards.

#### Fields

| Key | Applies to | Description |
| --- | --- | --- |
| `card` | All | Id of the card to show in. |
| `option` | All | Site option the value lives in. Defaults to `loggedin_settings`, but its REST schema drops unknown keys, so use your own option. |
| `key` | All but `role-table` | Key inside an object option. Leave it out to edit the **whole option**, for an option that holds a single value. |
| `type` | All | `number`, `toggle`, `select`, `text` or `role-table`. Anything else is drawn as `text`. |
| `label` | All | Field label. For `role-table`, the label of each row's number. |
| `help` | All | One line under the field. |
| `default` | All | Value shown while the option has none. |
| `show_if` | All | `array( 'key' => …, 'equals' => … )`: show the field only while that key of the same option has that value. |
| `unit` | `number`, `role-table` | Unit shown inside the field, e.g. `minutes`. |
| `unit_one` | `number` | Singular unit, used when the value is `1`. |
| `min`, `max` | `number`, `role-table` | Allowed range. Values outside it block **Save**. A `role-table` defaults `min` to `1`. |
| `options` | `select` | List of `value`, `label` and optional `help` (shown under the select when that option is chosen). |
| `cast` | `select` | `int` stores the chosen value as a number. |
| `default_from` | `role-table` | An `option.key`, such as `loggedin_settings.maximum`, whose value a new row starts with. Falls back to `default`, then `min`. |
| `add_label` | `role-table` | Text of the add button. Default: **Add a role**. |

A `toggle` stores `1` or `0`. A `role-table` always edits a whole option
holding a `{ role_slug: number }` map, one row per role. A role already
in the table isn't offered again.

Still validate and sanitise in PHP, in the option's `sanitize_callback`:
the screen's checks are for the person typing, not a security boundary.

### `window.loggedin.ui`

An add-on with a screen of its own (a list, say) draws it with the same
components core uses, so it matches the rest of the screen. The admin
script puts them on `window.loggedin.ui`:

| Group | Components |
| --- | --- |
| Layout | `Card`, `TableCard`, `Notice`, `ExternalLink`, `PageHeader`, `PageFooter`, `Sidebar`, `SectionSelect` |
| Fields | `Toggle`, `NumberField`, `TextField`, `TextareaField`, `SelectField`, `CheckboxList`, `ChoiceTiles` |
| Feedback | `StatusList`, `StatTiles`, `Snackbars` |
| Add-ons | `AddonCard`, `AddonHint`, `SectionHead`, `StoreButton` |
| Other | `Icon`, and `Button`, `Modal`, `Spinner` from `@wordpress/components` |

Read it while rendering, not when your script loads. Your script may run
before the admin script has set it.

```js
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

function MyListPage() {
    const { TableCard, Notice } = window.loggedin.ui;

    return (
        <TableCard
            title={ __( 'Login history', 'my-addon' ) }
            description={ __( 'Every login in the last 30 days.', 'my-addon' ) }
        >
            <MyTable />
        </TableCard>
    );
}

addFilter( 'loggedin.admin.tabs', 'my-addon/history', ( tabs ) => [
    ...tabs,
    {
        key: 'login-history',
        label: __( 'Login history', 'my-addon' ),
        component: MyListPage,
        group: 'manage',
        icon: 'history',
        wide: true,
        after: 'sessions',
    },
] );
```

The main props:

| Component | Props |
| --- | --- |
| `Card` | `title`, `description`, `icon`, `action` (one button in the title row), `footer`, `children` |
| `TableCard` | `title`, `description`, `action`, `children` (a DataViews list or a `<table>`, drawn edge to edge) |
| `Notice` | `tone` (`success`, `error`, `warning`, `info`), `title`, `children`, `actions`, `onDismiss` |
| `Toggle` | `label`, `help`, `checked`, `onChange` |
| `NumberField` | `label`, `unit`, `help`, `min`, `max`, `value`, `error`, `onChange` |
| `TextField` | `label`, `help`, `value`, `onChange`, `type`, `placeholder`, `error` |

If your add-on must also run on Loggedin before 3.4.0, check that
`window.loggedin.ui` exists and fall back to `@wordpress/components`.
[Active Sessions](/loggedin/addons/active-sessions) 1.2.0 does this.

### Add-ons older than the screen

Add-ons built before 3.4.0 keep working. Their
`loggedin.settings.panels` panels are drawn as cards on Login limits, and
their `loggedin.admin.tabs` tabs join the Manage group. They can look out
of place, though, so Loggedin lists them in a notice on the Plugins
screen and on its own screen, for users who can update plugins:

> A Loggedin add-on needs an update. It was made for the old settings
> screen. It still works, but its settings may look out of place until it
> is updated.

The first versions built for the new screen are Active Sessions 1.2.0,
Limit Per Role 2.2.0 and Real-time Logout 2.2.0. Third-party add-ons can
join the list with
[`loggedin_addon_minimum_versions`](#loggedin-addon-minimum-versions).

## JavaScript hooks

Loggedin's admin UI exposes three extension points via
`@wordpress/hooks`: one for adding a page, one for adding a panel to a
page, and one for replacing the Active Sessions hint on the Sessions
page. For settings, prefer
[`loggedin_settings_schema`](#declaring-settings-in-php), which needs no
JavaScript.

The screen resolves pages and panels once, when it mounts on DOM ready,
after every add-on script has run. Register your filters when your script
loads.

### `loggedin.admin.tabs`

Filters the list of extra pages in the **Users → Loggedin** sidebar. Add
a page of your own, or replace the content of a core page.

```js
import { addFilter } from '@wordpress/hooks';

addFilter(
    'loggedin.admin.tabs',
    'my-addon/my-page',
    ( tabs ) => [
        ...tabs,
        {
            key: 'my-page',
            label: __( 'My page', 'my-addon' ),
            component: MyPage,
            group: 'manage',
            after: 'sessions',
        },
    ]
);
```

Each entry must have `key`, `label` and `component`:

| Field | Type | Description |
| --- | --- | --- |
| `key` | string | Page id, used in the address as `&tab=<key>`. A `key` that matches a core page (`login-limits`, `lockout`, `auto-logout`, `sessions`, `addons`, `help`) **replaces that page's content** and keeps its place. |
| `label` | string | Sidebar and page header text. |
| `component` | React component | The page body. It receives `boot` (`window.loggedin`), `errors`, `navigate( id )` and `hrefFor( id )`. |
| `group` | string | Optional. `settings`, `manage` or `more`. Defaults to `manage`. Since 3.4.0. |
| `icon` | string | Optional. Kit icon name. Defaults to `list`. Since 3.4.0. |
| `saves` | boolean | Optional. `true` shows **Save** in the page header, for a page that edits site options through core-data. Since 3.4.0. |
| `wide` | boolean | Optional. `true` uses the full-width layout, for tables. |
| `before` | string | Optional. Insert before the page with this id. |
| `after` | string | Optional. Insert after the page with this id. Ignored when `before` is set. |
| _neither_ | — | The page goes at the end of the sidebar. |

The [Active Sessions](/loggedin/addons/active-sessions) add-on uses this
filter to add **Manage › Active sessions** after **Sessions**. Its 1.x
versions, which don't set `group`, are moved there automatically and
relabelled **Active sessions**.

Links from before 3.4.0 used `#hash` addresses (`#settings`, `#addons`,
`#support`). They still open the right page.

### `loggedin.settings.panels`

Filters the list of extra React panels drawn on a page. Kept for add-ons
built before 3.4.0; new add-ons should use
[`loggedin_settings_schema`](#declaring-settings-in-php).

```js
import { addFilter } from '@wordpress/hooks';

addFilter(
    'loggedin.settings.panels',
    'my-addon/my-panel',
    ( panels ) => [
        ...panels,
        {
            id: 'my-addon-panel',
            Component: MyAddonPanel,
            page: 'auto-logout',
        },
    ]
);
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Required. A later entry with the same `id` replaces an earlier one. |
| `Component` | React component | Required. The panel. |
| `page` | string | Optional. The page to draw on. Defaults to `login-limits`. Since 3.4.0. |

Panels appear after the page's own cards, in the order of the list. A
WordPress `PanelBody` is drawn as a card. Values edited through
`useEntityProp( 'root', 'site', … )` are saved by the page header's
**Save**.

See [Adding a custom Settings panel](#adding-a-custom-settings-panel)
below for the full recipe.

### `loggedin.settings.force_logout.cross_sell`

Filters the one-line hint under **Sign out a user** on the
[Sessions page](/loggedin/force-logout), which points to the
[Active Sessions](/loggedin/addons/active-sessions) add-on. The hint is
already hidden while Active Sessions is installed.

```js
import { addFilter } from '@wordpress/hooks';

addFilter(
    'loggedin.settings.force_logout.cross_sell',
    'my-addon/suppress-cross-sell',
    () => null
);
```

Return:

| Value | Effect |
| --- | --- |
| `null` | Hide the hint. |
| A React node | Show your node instead. `window.loggedin.ui.AddonHint` matches the default. |

## REST API

Every Loggedin route lives under the `loggedin/v1` namespace. All routes
require the `manage_options` capability — they're admin tools, not public
endpoints. The standard `X-WP-Nonce` header is required for browser-side
calls.

### Settings endpoints

#### `GET /loggedin/v1/settings`

Returns the full settings array, merged with defaults.

```bash
curl -X GET https://example.com/wp-json/loggedin/v1/settings \
  -u admin:application-password
```

Response:

```json
{
  "maximum": 5,
  "logic": "logout_oldest",
  "unlock": true,
  "exempt_admins": true,
  "password_signout": true,
  "message": "",
  "displaced_redirect": ""
}
```

#### `POST /loggedin/v1/settings`

Updates the settings. Partial payloads are supported — any omitted key
keeps its current value.

```bash
curl -X POST https://example.com/wp-json/loggedin/v1/settings \
  -u admin:application-password \
  -H 'Content-Type: application/json' \
  -d '{"maximum": 3, "logic": "block"}'
```

Response: the full settings array after the update.

| Body field | Type | Validation |
| --- | --- | --- |
| `maximum` | integer | Minimum `1`. Clamped at the schema boundary. |
| `logic` | string | Enum: `allow`, `logout_oldest`, `block`. |

This endpoint only changes `maximum` and `logic`. The settings added in
3.4.0 (`unlock`, `exempt_admins`, `password_signout`, `message`,
`displaced_redirect`) keep their values. Change them through
`/wp/v2/settings` or [`wp loggedin settings set`](/loggedin/wp-cli#wp-loggedin-settings-set).

::: tip Two ways to read / write settings
The React UI uses `/wp/v2/settings` (core-data) because the option is
registered with `show_in_rest`. The `/loggedin/v1/settings` endpoint
exists as a stable, plugin-scoped surface for CLI recipes, automation, or
third-party integrations that prefer the namespaced URL.
:::

### Sessions endpoints

#### `POST /loggedin/v1/sessions/destroy`

Force-logout every session for a user. Powers **Sign out a user** on the [Sessions page](/loggedin/force-logout).

```bash
curl -X POST https://example.com/wp-json/loggedin/v1/sessions/destroy \
  -u admin:application-password \
  -H 'Content-Type: application/json' \
  -d '{"user": "jdoe"}'
```

| Body field | Type | Description |
| --- | --- | --- |
| `user` | string | Required. User id, email, or login. See [Force Logout](/loggedin/force-logout#user). |

Success response (200):

```json
{
  "success": true,
  "user": { "id": 7, "login": "jdoe", "display_name": "Jane Doe" }
}
```

Errors:

| Status | Code | Cause |
| --- | --- | --- |
| `400` | `missing_identifier` | Empty `user` field. |
| `404` | `user_not_found` | No user matched the identifier. |

This endpoint also fires
[`loggedin_destroy_all_sessions`](#loggedin-destroy-all-sessions) on
success.

#### `POST /loggedin/v1/sessions/destroy-all`

Signs out every user on the site via the logout epoch. Powers the
[Sign out all users](/loggedin/force-logout#logout-all-users) button. No
body fields.

```bash
curl -X POST https://example.com/wp-json/loggedin/v1/sessions/destroy-all \
  -u admin:application-password
```

Success response (200):

```json
{ "success": true, "epoch": 1789718400 }
```

`epoch` is the stored timestamp — every session created before it is
invalidated on its next request. When the call is authenticated by a
session cookie (the admin app), that session is re-stamped and
survives; when authenticated by an application password (as above),
there is no session to keep, and nobody is exempted.

Fires [`loggedin_logout_all_users`](#loggedin-logout-all-users), not
`loggedin_destroy_all_sessions`.

### Add-ons endpoints

#### `GET /loggedin/v1/addons`

Returns the decorated addon catalogue. Cached server-side for up to a
day; pass through `POST /addons/refresh` to bust the cache.

```bash
curl -X GET https://example.com/wp-json/loggedin/v1/addons \
  -u admin:application-password
```

Response shape:

```json
{
  "items": [
    {
      "id": 19616,
      "title": "Real-time Logout",
      "is_premium": true,
      "is_active": true,
      "is_license_active": false,
      "license_key": "",
      "...": "additional fields"
    }
  ]
}
```

#### `POST /loggedin/v1/addons/refresh`

Force-refreshes the catalogue from the Freemius backend, bypassing the
SDK's cache.

#### `POST /loggedin/v1/addons/{id}/license`

Activates a license key against the add-on with the given Freemius id.

```bash
curl -X POST https://example.com/wp-json/loggedin/v1/addons/19616/license \
  -u admin:application-password \
  -H 'Content-Type: application/json' \
  -d '{"key": "sk_abc123…"}'
```

| Body field | Type | Description |
| --- | --- | --- |
| `key` | string | Required. The license key to activate. |

#### `DELETE /loggedin/v1/addons/{id}/license`

Deactivates the active license for the add-on.

```bash
curl -X DELETE https://example.com/wp-json/loggedin/v1/addons/19616/license \
  -u admin:application-password
```

Both license endpoints return the freshly-decorated catalogue row on
success and `WP_Error` with `400` on failure.

## Recipes

### Adding a custom Settings panel

For plain settings, you don't need a panel: declare them with
[`loggedin_settings_schema`](#declaring-settings-in-php) and ship no
JavaScript. That's what Limit Per Role 2.2.0 and Real-time Logout 2.2.0
do. Build a React panel only for controls the schema can't describe.

The flow is:

1. Register a new site option with `show_in_rest`.
2. Enqueue a small React bundle on the Loggedin admin screen
   (`users_page_loggedin`).
3. Use `addFilter( 'loggedin.settings.panels', ... )` to add the panel,
   with `page` naming the page it belongs on.
4. Read / write the option through
   `useEntityProp( 'root', 'site', 'your_option_key' )`, and draw it with
   [`window.loggedin.ui`](#window-loggedin-ui) so it matches the screen.

The page header's **Save** flushes every edited site-entity property in
one request, so your panel joins the save flow with no extra wiring.

Minimal React panel:

```js
import { addFilter } from '@wordpress/hooks';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const MyPanel = () => {
    const [ value, setValue ] = useEntityProp(
        'root',
        'site',
        'my_addon_option'
    );
    const { Card, Toggle } = window.loggedin.ui;

    return (
        <Card title={ __( 'My Add-on', 'my-addon' ) }>
            <Toggle
                label={ __( 'Enable thing', 'my-addon' ) }
                checked={ !! value }
                onChange={ setValue }
            />
        </Card>
    );
};

addFilter(
    'loggedin.settings.panels',
    'my-addon/my-panel',
    ( panels ) => [
        ...panels,
        { id: 'my-addon', Component: MyPanel, page: 'login-limits' },
    ]
);
```

Matching PHP — register the option so `useEntityProp` can find it:

```php
add_action( 'init', function () {
    register_setting( 'loggedin', 'my_addon_option', array(
        'type'         => 'boolean',
        'default'      => false,
        'show_in_rest' => array(
            'schema' => array( 'type' => 'boolean' ),
        ),
    ) );
} );
```

Look at the [`loggedin-realtime-logout`](https://github.com/Joel-James/loggedin-realtime-logout)
and [`loggedin-limit-per-role`](https://github.com/Joel-James/loggedin-limit-per-role)
source for full working examples.

### Bypassing the limit for a service account

```php
add_filter( 'loggedin_bypass', function ( $bypass, $user_id ) {
    $user = get_user_by( 'id', $user_id );
    return $user && 'service-account' === $user->user_login;
}, 10, 2 );
```

### Overriding the limit per capability

```php
add_filter( 'loggedin_reached_limit', function ( $reached, $user_id, $count ) {
    if ( user_can( $user_id, 'manage_woocommerce' ) ) {
        // Shop managers get 10 concurrent sessions.
        return $count >= 10;
    }

    return $reached;
}, 10, 3 );
```

### Reacting to admin force-logouts

```php
add_action( 'loggedin_destroy_all_sessions', function ( $user_id ) {
    do_action(
        'my_app/user_logged_out',
        $user_id,
        array( 'source' => 'loggedin' )
    );
} );
```

## Session duration

By default, session length is controlled by WordPress:

- **"Remember Me" checked:** session lasts 14 days.
- **Not checked:** session lasts 2 days.

To customise the duration use WordPress's standard `auth_cookie_expiration`
filter:

```php
add_filter( 'auth_cookie_expiration', function () {
    return MONTH_IN_SECONDS; // 30 days for everyone.
} );
```

This affects WordPress globally. The session limit reads
`WP_Session_Tokens` for the count and doesn't care how long each session
is configured to last.

::: tip Prefer a setting to a snippet
Since 3.4.0, Loggedin's [Auto logout](/loggedin/auto-logout#session-length)
page sets both lengths, and adds an idle timeout on top. It hooks
`auth_cookie_expiration` at priority `20`, so if you keep a snippet like
the one above at the default priority, the setting wins whenever it isn't
`0`. Pick one or the other rather than running both.
:::

::: info Need help?
If you think a hook is missing or you need help extending Loggedin,
[reach out via the contact form](https://foxelabs.com/contact/) — we use
these conversations to decide what new extension points to add.
:::
