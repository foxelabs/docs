---
title: Developer Docs
---

# Developer Docs

Loggedin ships with a stable extension surface so you can customise
behaviour without touching plugin files. Everything documented on this
page is part of the public API and will keep working across minor
releases — PHP actions and filters, the React `loggedin.settings.panels`
slot, the `/loggedin/v1` REST endpoints, and the option schema.

All PHP examples can be dropped into your theme's `functions.php` or a
small companion plugin.

[[toc]]

## Architecture overview

```
DuckDev\Loggedin\
├── Plugin                       Constants (version, slug, option key, REST namespace)
├── Core                         Boot orchestrator — wires every module and fires loggedin_init
├── Setup\{Settings, Upgrader}   Options store + version bump handler
├── Front\Session_Guard          Hooks the WordPress auth pipeline; enforces the cap
├── Admin\{Admin, Assets}        Menu + page + React bundle enqueue (admin only)
├── Addons\{Addons, Catalog}     Freemius wiring + shaped catalogue for the React UI
├── Api\{Endpoint, Settings,
│         Sessions, Addons}      REST controllers under /loggedin/v1
├── Contracts\Singleton          Shared trait used by every module
└── Utils\…                      Shared helpers
```

The recommended way to extend the plugin is:

1. Hook into [`loggedin_init`](#loggedin_init) so your code runs only after
   every subsystem is up.
2. Use the documented filters and actions for everything you can — they
   are guaranteed stable.
3. For UI extensions, contribute a React `PanelBody` via the
   [`loggedin.settings.panels`](#loggedin-settings-panels) JS filter and
   read/write your own `show_in_rest` site option through `useEntityProp`.

## Plugin constants

Useful when writing extensions or talking to the plugin from a sibling
add-on. All live on `DuckDev\Loggedin\Plugin`:

| Constant | Value | Purpose |
| --- | --- | --- |
| `VERSION` | `3.0.1` | Current plugin version. |
| `SLUG` | `loggedin` | Plugin slug; matches the Freemius and i18n slugs. |
| `TEXT_DOMAIN` | `loggedin` | Translation text domain. |
| `OPTION_KEY` | `loggedin_settings` | WP option name where every plugin setting is stored. |
| `REST_NAMESPACE` | `loggedin/v1` | Namespace for every REST route the plugin registers. |
| `FREEMIUS_ID` | `19328` | The parent plugin's Freemius id. |

## Settings storage

Loggedin stores its settings in a single WP option: **`loggedin_settings`**.
The shape is:

```php
array(
    'maximum' => 1,        // int, ≥1. Concurrent-session cap.
    'logic'   => 'allow',  // enum: 'allow' | 'logout_oldest' | 'block'.
)
```

The option is registered with `show_in_rest`, so:

- The React Settings tab reads/writes through `/wp/v2/settings` via
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
- `allow` is the value the radio labels as **Logout All**.
- `logout_oldest` is **Logout Oldest**.
- `block` is **Block New**.

These names are stored exactly as shown; rename them carefully — existing
installs depend on the value, not the label.
:::

## Actions

### `loggedin_init`

Fires once every plugin module has been wired up.

```php
do_action( 'loggedin_init', \DuckDev\Loggedin\Core $core );
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
    array( \DuckDev\Loggedin\RealtimeLogout\Plugin::class, 'boot' )
);
```

### `loggedin_login_blocked`

Fires when a login is rejected because the user has reached the limit in
**Block New** mode.

```php
do_action( 'loggedin_login_blocked', int $user_id );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | int | User id whose login was blocked. |

Use it to add audit logging, send a notification, or trigger anti-abuse
heuristics. The login has already been rejected by the time this fires —
you can't override the decision from here (use
[`loggedin_reached_limit`](#loggedin_reached_limit) or
[`loggedin_bypass`](#loggedin_bypass) for that).

```php
add_action( 'loggedin_login_blocked', function ( $user_id ) {
    error_log( sprintf( 'Loggedin: blocked login for user #%d', $user_id ) );
} );
```

### `loggedin_destroy_all_sessions`

Fires every time the plugin destroys all of a user's sessions. Two paths
trigger it:

1. The **Logout All** (`allow`) login logic, when a new login displaces
   every existing session.
2. The admin-facing [Force Logout](/loggedin/force-logout) panel.

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
All) mode you get [`loggedin_destroy_all_sessions`](#loggedin_destroy_all_sessions)
instead.

### `loggedin_destroy_session`

Fires when a single named session is destroyed, rather than all of a
user's sessions. Currently triggered by
[`wp loggedin sessions destroy --token=`](/loggedin/wp-cli#wp-loggedin-sessions-destroy).

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
mode appears in the radio group but gets **silently reverted** to `allow`
on save. To make it stick you also need to:

1. Hook `pre_update_option_loggedin_settings` (or a wrapper option's
   `sanitize_callback`) to whitelist your mode before WordPress hands the
   value to Loggedin's sanitiser, **or**
2. Translate your mode into one of the built-in modes via your own hook
   on [`loggedin_reached_limit`](#loggedin_reached_limit) or a custom
   action handler.

For most extensions the cleaner path is to keep the visible logic on a
built-in mode and add the extra behaviour as a side effect of
[`loggedin_destroy_all_sessions`](#loggedin_destroy_all_sessions) or
[`loggedin_login_blocked`](#loggedin_login_blocked).
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
`adminUrl`, `logics`.

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
in custom rows for a self-hosted / white-label build of the Add-ons tab.

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
If [`loggedin_bypass`](#loggedin_bypass) returns true for the user, the
limit check short-circuits and `loggedin_reached_limit` is never reached.
:::

### `loggedin_bypass`

Filter to exempt a user from the concurrent-session check entirely.
Returning `true` means the limit doesn't apply, regardless of the
configured logic mode or per-role / per-user override.

```php
apply_filters( 'loggedin_bypass', bool $bypass, int $user_id );
```

```php
// Allow administrators unlimited sessions.
add_filter( 'loggedin_bypass', function ( $bypass, $user_id ) {
    $user = get_user_by( 'id', $user_id );
    return $user && in_array( 'administrator', (array) $user->roles, true );
}, 10, 2 );
```

```php
// Allow a specific list of user ids unlimited sessions.
add_filter( 'loggedin_bypass', function ( $bypass, $user_id ) {
    return in_array( (int) $user_id, array( 1, 2, 5 ), true );
}, 10, 2 );
```

### `loggedin_error_message`

Filters the error message rendered on wp-login when a user is blocked by
**Block New** mode.

```php
apply_filters( 'loggedin_error_message', string $message );
```

```php
add_filter( 'loggedin_error_message', function ( $message ) {
    return __( 'Your account is already signed in elsewhere. Sign out from another device to continue.', 'my-plugin' );
} );
```

## JavaScript hooks

Loggedin's admin UI exposes three extension points via
`@wordpress/hooks` — one for adding a whole new tab to the admin nav,
one for adding a `PanelBody` to the Settings tab, and one for replacing
the Force Logout cross-sell banner.

### `loggedin.admin.tabs`

Filters the array of tabs rendered along the top of the
**Users → Loggedin** admin. Add-ons inject their own React component as
a tab through this filter — same deferred-apply pattern as
[`loggedin.settings.panels`](#loggedin-settings-panels), so it's safe
to call from a separately-bundled add-on script.

```js
import { addFilter } from '@wordpress/hooks';

addFilter(
    'loggedin.admin.tabs',
    'my-addon/my-tab',
    ( tabs ) => [
        ...tabs,
        {
            key: 'my-tab',
            label: __( 'My Tab', 'my-addon' ),
            component: MyTabPage,
            after: 'settings', // optional positioning
        },
    ]
);
```

Each entry must be `{ key, label, component }` with two optional
position hints:

| Field | Type | Description |
| --- | --- | --- |
| `key` | string | Stable tab id. An add-on that uses the same `key` as a built-in tab (`settings`, `addons`, `support`) **replaces** that tab — useful for white-label builds. |
| `label` | string | Translatable text rendered in the nav. |
| `component` | React component | The body of the tab. |
| `wide` | boolean | Optional. `true` opts the tab into the full-width layout (used by the Add-ons grid). |
| `before` | string | Optional. Insert this tab immediately before the tab with this key. |
| `after` | string | Optional. Insert immediately after the tab with this key. Ignored when `before` is set. |
| _neither_ | — | The tab is appended to the end. |

The filter runs inside a `useMemo` on every render of the admin shell,
so registering the filter from an add-on bundle that loads after the
core bundle still works.

The [Active Sessions](/loggedin/addons/active-sessions) add-on uses this
filter to inject its own tab between **Settings** and **Addons**.

### `loggedin.settings.panels`

Filters the array of extra `PanelBody` components rendered on the
**Settings** tab, after the General Settings panel and before the Force
Logout panel.

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
        },
    ]
);
```

Each entry must be `{ id: string, Component: ReactComponent }`. Entries
without a stable `id` are dropped so a later add-on can replace a panel
with the same id. The order in the returned array is the render order.

See [Adding a custom Settings panel](#adding-a-custom-settings-panel)
below for the full recipe.

### `loggedin.settings.force_logout.cross_sell`

Filters the cross-sell banner rendered at the bottom of the **Force
Logout** panel. The parent plugin ships a default banner promoting the
[Active Sessions](/loggedin/addons/active-sessions) add-on; that add-on
hooks this filter to return `null` and hide the banner once it's
installed.

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
| `null` | Hide the default banner entirely. |
| A React node | Replace the default banner with your own. |
| _anything else_ | Falls through to the default. |

This is the same hook contract the 404 to 301 plugin's add-ons use to
suppress their own promo banners — keep the wrapper as a `PanelRow` with
`className="loggedin-cross-sell"` and an inner `Notice` so your
replacement inherits the shared spacing rules.

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
{ "maximum": 5, "logic": "logout_oldest" }
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

::: tip Two ways to read / write settings
The React UI uses `/wp/v2/settings` (core-data) because the option is
registered with `show_in_rest`. The `/loggedin/v1/settings` endpoint
exists as a stable, plugin-scoped surface for CLI recipes, automation, or
third-party integrations that prefer the namespaced URL.
:::

### Sessions endpoints

#### `POST /loggedin/v1/sessions/destroy`

Force-logout every session for a user. Powers the **Force Logout** panel.

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
[`loggedin_destroy_all_sessions`](#loggedin_destroy_all_sessions) on
success.

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

This is what every official add-on does. The flow is:

1. Register a new site option with `show_in_rest`.
2. Enqueue a small React bundle on the Loggedin admin screen
   (`users_page_loggedin`).
3. Use `addFilter( 'loggedin.settings.panels', ... )` to inject a
   `PanelBody`.
4. Read / write the option through
   `useEntityProp( 'root', 'site', 'your_option_key' )`.

The parent's **Save Changes** button automatically flushes every edited
site-entity property in one POST, so your panel participates in the save
flow with no extra wiring.

Minimal React panel:

```js
import { addFilter } from '@wordpress/hooks';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const MyPanel = () => {
    const [ value, setValue ] = useEntityProp(
        'root',
        'site',
        'my_addon_option'
    );

    return (
        <PanelBody title={ __( 'My Add-on', 'my-addon' ) } initialOpen>
            <PanelRow>
                <ToggleControl
                    label={ __( 'Enable thing', 'my-addon' ) }
                    checked={ !! value }
                    onChange={ setValue }
                />
            </PanelRow>
        </PanelBody>
    );
};

addFilter(
    'loggedin.settings.panels',
    'my-addon/my-panel',
    ( panels ) => [ ...panels, { id: 'my-addon', Component: MyPanel } ]
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

Session length is controlled by WordPress, not by Loggedin:

- **"Remember Me" checked:** session lasts 14 days.
- **Not checked:** session lasts 2 days.

To customise the duration use WordPress's standard `auth_cookie_expiration`
filter:

```php
add_filter( 'auth_cookie_expiration', function () {
    return MONTH_IN_SECONDS; // 30 days for everyone.
} );
```

This affects WordPress globally — Loggedin reads `WP_Session_Tokens` for
the count and doesn't care how long each individual session is configured
to last.

::: info Need help?
If you think a hook is missing or you need help extending Loggedin,
[reach out via the contact form](https://foxelabs.com/contact/) — we use
these conversations to decide what new extension points to add.
:::
