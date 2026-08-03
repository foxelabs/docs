---
title: Developer Docs
---

# Developer Docs

404 to 301 ships with a stable extension surface so you can customise
behaviour without touching plugin files. Everything documented on this
page is part of the public API and will keep working across minor
releases.

All examples can be dropped into your theme's `functions.php` or a small
companion plugin.

[[toc]]

## Architecture overview

```
DuckDev\FourNotFour\
├── Plugin                       Identity helpers (name, version, slug, URL)
├── Core                         Boot orchestrator + service locator
├── Settings                     Settings CRUD + REST registration
├── Slug_Monitor                 Auto-redirect on post slug change
├── Setup\{Activator, Deactivator, Upgrader}
├── Admin\{Menu, Assets, Page, Links}
├── Front\{Controller, Request,
│         Actions\{Log, Email, Redirect}}
├── Api\{Endpoint, Redirects, Logs, Settings, Migration, Addons}
├── Models\{Logs, Redirects}
├── Migration\{Migrator, Scheduler}
├── CLI\{CLI, Logs, Redirects, Settings, Migrate}
├── Database\Database            BerlinDB table installer
├── Utils\{Singleton, Permission, Sanitizer, Helpers, Assets}
└── Contracts\{Actionable, Runnable, Routable}
```

The recommended way to extend the plugin is:

1. Hook into `404_to_301_init` so your code runs only after every
   subsystem is up.
2. Reach long-lived services through the service locator on
   `\DuckDev\FourNotFour\Core::instance()`.
3. Use the documented filters and actions for everything you can — they
   are guaranteed stable.

## Actions

### `404_to_301_init`

Fires once the plugin has finished booting every subsystem.

```php
add_action( '404_to_301_init', function ( $core ) {
    // $core is the DuckDev\FourNotFour\Core instance.
} );
```

### `404_to_301_activated`

Fires from the activation handler after the database tables are installed
and defaults are seeded.

### `404_to_301_deactivated`

Fires from the deactivation handler. Use it to cancel your own scheduled
jobs or clean up transients.

### `404_to_301_upgraded`

Fires after the upgrader detects a version bump and runs its routines.

```php
add_action( '404_to_301_upgraded', function ( $previous, $current ) {
    // $previous and $current are version strings.
}, 10, 2 );
```

### `404_to_301_request`

Fires after every action in the chain has run on a request — including
non-404 requests where the chain still ran (for the `Excluded` short-
circuit, etc.).

```php
add_action( '404_to_301_request', function ( $request ) {
    // $request is a DuckDev\FourNotFour\Front\Request.
} );
```

### `404_to_301_caught_404`

Same timing as `404_to_301_request` but only fires when the request was
an actual 404. Use this for analytics integrations that should only
count true 404s.

### `404_to_301_pre_redirect`

Fires immediately before the Redirect action issues the redirect (via
`wp_redirect()`). The Telegram Alerts add-on listens here, for example.

```php
add_action( '404_to_301_pre_redirect', function ( $url, $status, $request ) {
    error_log( "404 → $url ($status) for {$request->url()}" );
}, 10, 3 );
```

### `404_to_301_pre_terminal_status`

The audit-trail twin of `404_to_301_pre_redirect` for the **terminal
status** dispositions (`410 Gone` / `451 Unavailable For Legal Reasons`).
Fires immediately before the status header is sent and the request is
terminated.

```php
add_action( '404_to_301_pre_terminal_status', function ( $status, $request ) {
    // $status — 410 or 451
    error_log( "Terminal $status for {$request->url()}" );
}, 10, 2 );
```

### `404_to_301_pre_serve_404` / `404_to_301_serve_404`

Fire when the global 404 fallback is configured to **serve a response in
place** rather than redirect (any target mode that isn't `link`, `page`,
or `none` — see the `404_to_301_redirect_targets` filter).
Unlike the redirect and terminal paths, these do **not** `exit` —
control returns to WordPress so normal template loading proceeds.

`404_to_301_pre_serve_404` is the audit twin (log/notify); a handler
hooks `404_to_301_serve_404` to actually render the response. A handler
should swap `template_include` to load its content and re-assert
`status_header( 404 )` — rendering a published page would otherwise reset
the status to `200`. When nothing handles the action the request falls
through to the theme's own 404 template, so the disposition degrades
safely if the handler add-on is deactivated.

```php
// Render a chosen page's content while keeping the 404 status.
add_action( '404_to_301_serve_404', function ( $request, $type ) {
    add_filter( 'template_include', function () {
        status_header( 404 );
        return locate_template( 'my-404.php' );
    } );
}, 10, 2 );
```

### `404_to_301_post_log_insert`

Fires after a 404 row has been written. The new row ID is passed first.

```php
add_action( '404_to_301_post_log_insert', function ( $id, $data, $request ) {
    // …
}, 10, 3 );
```

### `404_to_301_email_sent`

Fires after the notification email has been queued through `wp_mail()`.

### `404_to_301_migration_complete`

Fires once the legacy table has been fully migrated and dropped.

### `404_to_301_redirect_audit`

Fires after a redirect row is created, updated, or deleted. Use it to
stream changes to an activity log, SIEM, or compliance audit trail.

```php
add_action( '404_to_301_redirect_audit', function ( $action, $id, $user_id, $data ) {
    // $action  — 'created' | 'updated' | 'deleted'
    // $id      — redirect row id
    // $user_id — WP user that made the change; 0 for CLI / cron writes
    // $data    — sanitised payload that was written (empty array on delete)
    My\Audit_Stream::record( "redirect.$action", $id, $user_id, $data );
}, 10, 4 );
```

The `modified_by` column on the redirects table is the persisted form
of the same signal — it stores the most recent author so the "Last
edited by" column in the Redirects table can render without a join.
Surfaced via the REST API on every shaped row as `modified_by` (int|null)
and `modified_by_name` (string).

### `404_to_301_settings_updated`

Fires after the settings option is written — for every write path
(`Settings::update()`, the REST settings endpoint, direct
`update_option()`). The payload is already sanitised and the previous
snapshot is passed in, so addons don't have to diff against
`get_option()` themselves.

```php
add_action( '404_to_301_settings_updated', function ( $new, $previous ) {
    if ( ( $new['logs_enabled'] ?? false ) && ! ( $previous['logs_enabled'] ?? false ) ) {
        // Logging was just turned on — (re)schedule the cleanup cron.
    }
}, 10, 2 );
```

::: tip Prefer this over `updated_option`
Listening on `updated_option_404_to_301_settings` works, but you get the
raw option value and have to know it's an array. This action gives you
two normalised arrays and is the documented contract.
:::

### `404_to_301_setting_updated_{$key}`

Dynamic, per-key signal for addons that only care about a single
setting. Fires once per key whose value actually changed — no noise for
unchanged keys. The hook name suffix is the setting key.

```php
add_action( '404_to_301_setting_updated_email_enabled', function ( $new, $old ) {
    if ( $new ) {
        // Email notifications were turned on.
    }
}, 10, 2 );
```

Both new and old values are passed through. Old is `null` if the key
did not exist in the previous snapshot — useful when an addon registers
its own key via [`404_to_301_settings_defaults`](#404-to-301-settings-defaults)
and wants to react the first time a value is written.

## Filters

### `404_to_301_should_process`

The big short-circuit. Return `false` to skip every action on a given
request.

```php
add_filter( '404_to_301_should_process', function ( $proceed, $request ) {
    // Skip JSON API 404s regardless of other settings.
    if ( str_starts_with( $request->url(), '/wp-json/' ) ) {
        return false;
    }
    return $proceed;
}, 10, 2 );
```

### `404_to_301_actions`

Rewrite the action chain for a request. Each element must implement
`DuckDev\FourNotFour\Contracts\Actionable`.

```php
add_filter( '404_to_301_actions', function ( $actions, $request ) {
    $actions[] = new My\Webhook_Notifier();
    return $actions;
}, 10, 2 );
```

### `404_to_301_settings_defaults`

Add your own keys to the settings store so they're picked up by the
defaults() pass.

```php
add_filter( '404_to_301_settings_defaults', function ( $defaults ) {
    $defaults['my_addon_enabled'] = false;
    return $defaults;
} );
```

Pair it with `404_to_301_settings_rest_schema` so the REST API accepts
your keys.

### `404_to_301_settings_rest_schema`

Describe added settings so the REST endpoint validates them instead of
dropping them on save.

```php
add_filter( '404_to_301_settings_rest_schema', function ( $properties ) {
    $properties['my_addon_enabled'] = array( 'type' => 'boolean' );
    return $properties;
} );
```

### `404_to_301_settings_pre_update`

Last-chance hook before the option is written. Useful for cross-field
validation.

```php
add_filter( '404_to_301_settings_pre_update', function ( $clean, $raw, $previous ) {
    // Force notifications off if the recipient was cleared.
    if ( empty( $clean['email_recipient'] ) ) {
        $clean['email_enabled'] = false;
    }
    return $clean;
}, 10, 3 );
```

### `404_to_301_capability`

The capability required to access the admin UI and REST endpoints.
Defaults to `manage_options`.

```php
add_filter( '404_to_301_capability', function () {
    return 'd404_manage_redirects';
} );
```

### `404_to_301_has_access` / `404_to_301_rest_has_access`

The access decision itself, after the capability check has run. Use these
when access depends on more than a capability — a per-user flag, IP
allow-list, or business-hours gate. `404_to_301_has_access` guards the
admin UI; `404_to_301_rest_has_access` guards every REST endpoint and
additionally receives the `WP_REST_Request`.

```php
// Admin UI: also require the user to be on the editorial team.
add_filter( '404_to_301_has_access', function ( $allowed ) {
    return $allowed && current_user_can( 'edit_others_posts' );
} );

// REST: allow read-only collection requests for any logged-in user.
add_filter( '404_to_301_rest_has_access', function ( $allowed, $request ) {
    if ( 'GET' === $request->get_method() && is_user_logged_in() ) {
        return true;
    }
    return $allowed;
}, 10, 2 );
```

### `404_to_301_doctor_checks`

Filter the grouped check list that `wp 404-to-301 doctor` renders. The
filter runs after the built-in groups (`cron`, `settings`, `database`)
have been populated, so addons can append their own group rather than
mutating existing ones.

Each group is `[ 'label' => string, 'checks' => array<int, [ 'status' => 'pass'|'warn'|'fail', 'message' => string ]> ]`.
A FAIL on any check trips the doctor's non-zero exit code; WARN
surfaces in the summary line but doesn't change the exit status.

```php
add_filter( '404_to_301_doctor_checks', function ( $groups ) {
    $groups['my_addon'] = array(
        'label'  => 'My Addon',
        'checks' => array(
            array(
                'status'  => My\Addon::ready() ? 'pass' : 'fail',
                'message' => 'API key is configured.',
            ),
        ),
    );
    return $groups;
} );
```

Paired filter: `404_to_301_doctor_cron_prefixes` — an array of hook-name
prefixes that the cron group uses to decide which scheduled events
belong to the plugin/addons. Default is `[ '404_to_301_' ]`.

### `404_to_301_redirect_target`

Override the resolved redirect target before the redirect is issued.

```php
add_filter( '404_to_301_redirect_target', function ( $payload, $request ) {
    if ( str_starts_with( $request->url(), '/legacy/' ) ) {
        $payload['url']    = home_url( '/archive' );
        $payload['status'] = 302;
    }
    return $payload;
}, 10, 2 );
```

`$payload` is `[ 'url' => string, 'status' => int ]`.

::: tip Singular vs. plural
`404_to_301_redirect_target` (singular) overrides the **resolved target
of one request**. `404_to_301_redirect_targets` (plural, below) registers
the **catalogue of global-fallback target modes** offered in settings.
:::

### `404_to_301_redirect_targets`

Register the catalogue of global 404-fallback **target modes** shown in
the settings UI. The defaults are `link` (a custom URL), `page` (an
existing page), and `none` (no redirect). Any additional mode you
register is treated as a "serve in place" disposition — when it's the
active fallback, the plugin fires the `404_to_301_serve_404` action
instead of redirecting, so an add-on can render its own 404 content while
keeping the 404 status.

```php
add_filter( '404_to_301_redirect_targets', function ( $targets ) {
    $targets['page_404'] = __( 'A custom 404 page', 'my-addon' );
    return $targets;
} );
```

`$targets` is a `stored value => translated label` map.

### `404_to_301_redirect_statuses`

Customise the list of HTTP status codes allowed on a per-redirect basis.
Defaults to `[ 301, 302, 307 ]`.

### `404_to_301_use_safe_redirect`

Whether to restrict redirects to the site's own host. Defaults to `false`
so admin-configured **external** targets work (the plugin uses
`wp_redirect()`). Return `true` to fall back to `wp_safe_redirect()`
semantics — useful if you want host-restriction enforced.

```php
add_filter( '404_to_301_use_safe_redirect', function ( $safe, $url, $request ) {
    // Only allow same-host redirects for URLs under /members/.
    if ( str_starts_with( $request->url(), '/members/' ) ) {
        return true;
    }
    return $safe;
}, 10, 3 );
```

### `404_to_301_monitor_slug_create`

Gate the **Monitor slug changes** feature per post. Fires when a published
post's permalink changes and the plugin is about to auto-create a redirect.
Return `false` to skip a specific post.

```php
add_filter( '404_to_301_monitor_slug_create', function ( $create, $post_after, $post_before ) {
    // Don't auto-redirect renamed products — they're handled elsewhere.
    if ( 'product' === $post_after->post_type ) {
        return false;
    }
    return $create;
}, 10, 3 );
```

### `404_to_301_register_addon`

The registration seam for first-party add-ons. An add-on hooks this filter
to register itself with the parent's add-on / licensing layer, keyed by its
project id. This is the entry point every add-on uses on `plugins_loaded`.

```php
add_filter( '404_to_301_register_addon', function ( $addons ) {
    $addons[ MY_ADDON_ID ] = array(
        'slug'       => 'my-addon',
        'main_file'  => plugin_basename( MY_ADDON_FILE ),
        'public_key' => MY_ADDON_PUBLIC_KEY,
        'is_premium' => true,
        'has_addons' => false,
    );
    return $addons;
} );
```

Add-ons then boot their own subsystems on
[`404_to_301_init`](#404_to_301_init) and extend the settings store via
[`404_to_301_settings_defaults`](#404-to-301-settings-defaults) /
[`404_to_301_settings_rest_schema`](#404-to-301-settings-rest-schema).

### `404_to_301_normalize_url`

Override the canonical form of a URL used for hashing and matching. The
default policy: reduce a full URL to its path, strip the query string,
percent-decode the path, strip any trailing slash, lowercase the result,
make it relative to the site's home path (so subdirectory installs match),
and guarantee a leading slash. Hook this filter to plug in stricter or
looser rules without forking the helper.

```php
// Case-sensitive matching: keep the original casing, but keep every
// other normalisation step (trailing slash strip, percent-decode, query
// strip — those are still useful even on case-sensitive sites).
add_filter( '404_to_301_normalize_url', function ( $normalised, $raw ) {
    $path = strtok( trim( $raw ), '?' );
    $path = rawurldecode( (string) $path );
    if ( strlen( $path ) > 1 && substr( $path, -1 ) === '/' ) {
        $path = rtrim( $path, '/' );
    }
    return $path; // no strtolower()
}, 10, 2 );
```

```php
// Strip a `/en/` or `/fr/` language prefix so a single redirect row
// covers every locale.
add_filter( '404_to_301_normalize_url', function ( $normalised ) {
    return preg_replace( '#^/(en|fr|de)(/|$)#', '/', $normalised );
} );
```

::: warning Rehash existing rows when you change the policy
The output of this filter is what gets SHA1-hashed into `source_hash` on
write *and* used to look up matches on every 404. If you change the
policy on a live site, existing rows hashed under the old policy stop
matching until they're re-saved. Either flip the filter before adding
rows, or run a one-shot script that re-saves every redirect to refresh
the hash.
:::

### `404_to_301_is_human`

Override the bot detection used by the Log action's "skip bots" toggle.

```php
add_filter( '404_to_301_is_human', function ( $is_human, $user_agent ) {
    // Treat our load balancer's health check as a bot.
    if ( str_contains( $user_agent, 'GoogleHC' ) ) {
        return false;
    }
    return $is_human;
}, 10, 2 );
```

### `404_to_301_pre_log_insert`

Modify the row before it lands in the database.

```php
add_filter( '404_to_301_pre_log_insert', function ( $data, $request ) {
    $data['user_agent'] = substr( $data['user_agent'], 0, 200 );
    return $data;
}, 10, 2 );
```

### `404_to_301_email_payload`

Rewrite the outgoing notification. Useful for switching recipients per
URL or replacing the body with HTML.

```php
add_filter( '404_to_301_email_payload', function ( $email, $request ) {
    $email['subject'] = '[404] ' . $email['subject'];
    return $email;
}, 10, 2 );
```

`$email` is `[ 'recipient' => string[], 'subject' => string, 'body' => string ]`.
`recipient` is an array of validated email addresses; `wp_mail()`
accepts the array shape directly.

### Request filters

The `Request` object exposes each accessor through its own filter, so
addons can rewrite individual fields without subclassing.

- `404_to_301_request_method` — HTTP method.
- `404_to_301_request_referer` — Referer header.
- `404_to_301_request_user_agent` — User-Agent header.
- `404_to_301_request_ip` — Resolved client IP (already empty when
  `mask_ip` is on).
- `404_to_301_request_url` — Request URI (path + query).
- `404_to_301_request_host` — Host header.
- `404_to_301_request_is_404` — The `is_404()` check itself, in case you
  want to force-treat a non-404 response as a 404 (e.g. an empty search
  results page).

Each filter receives the resolved value and the `Request` instance:

```php
add_filter( '404_to_301_request_ip', function ( $ip, $request ) {
    // Anonymise IPv4 to the /24.
    return preg_replace( '/\.\d+$/', '.0', $ip );
}, 10, 2 );
```

## JavaScript hooks

The admin React UI exposes extension points through `@wordpress/hooks`.
All JS-side hook names follow:

```
d404.<surface>.<area>.<slot>
```

`d404` — dot-separated — lower-case — no underscores. Stable across minor
releases.

::: info Hook names start with a letter
`@wordpress/hooks` rejects hook names that begin with a digit, which is
why JS-side filters use the `d404` prefix instead of `404_to_301`.
:::

### Settings page — extension slots

Every tab in the Settings page exposes two `applyFilters` slots:

| Tab            | Fields slot                              | Cross-sell slot                              |
| -------------- | ---------------------------------------- | -------------------------------------------- |
| General        | `d404.settings.general.fields`           | `d404.settings.general.cross_sell`           |
| Redirects      | `d404.settings.redirects.fields`         | `d404.settings.redirects.cross_sell`         |
| Logs           | `d404.settings.logs.fields`              | `d404.settings.logs.cross_sell`              |
| Notifications  | `d404.settings.notifications.fields`     | `d404.settings.notifications.cross_sell`     |
| Tools          | `d404.settings.tools.fields`             | `d404.settings.tools.cross_sell`             |

#### `…fields` — inject controls

Signature:

```js
applyFilters(
    'd404.settings.<tab>.fields',
    null,                // default: render nothing
    { getSetting, setSetting },
)
```

- Return a single React node, an array of nodes, or `null`.
- `getSetting(key, fallback)` and `setSetting(key, value)` are the same
  accessors the built-in fields use — controls injected here participate
  in the same dirty-state, save, and reset flow as the parent's own
  fields. Pair the keys you read/write with
  [`404_to_301_settings_defaults`](#404-to-301-settings-defaults) and
  [`404_to_301_settings_rest_schema`](#404-to-301-settings-rest-schema)
  so they round-trip through REST.
- Rendered at the end of the tab's last `PanelBody` (or after the last
  `PanelBody`, on the General and Tools tabs).

#### `…cross_sell` — replace or hide the default promo

Signature:

```js
applyFilters('d404.settings.<tab>.cross_sell', defaultNode)
```

- `defaultNode` may be `null` (no built-in promo) or a React node — eg.
  the Logs tab's "Drowning in 404 logs?" Notice.
- Addons that supersede the promoted feature should return `null` to
  hide it.
- Return your own node to replace the promo entirely.
- Kept separate from `…fields` so an addon that wants to inject fields
  *without* hiding the promo can do so.

### Example

A minimal addon that adds a toggle to the General tab and hides the
default promo:

```js
import { addFilter } from '@wordpress/hooks'
import { PanelRow, ToggleControl } from '@wordpress/components'

addFilter(
    'd404.settings.general.fields',
    'my-addon/general-extra',
    (_node, { getSetting, setSetting }) => (
        <PanelRow>
            <ToggleControl
                __nextHasNoMarginBottom
                label="My addon toggle"
                checked={!!getSetting('my_addon_toggle', false)}
                onChange={(v) => setSetting('my_addon_toggle', v)}
            />
        </PanelRow>
    ),
)

addFilter(
    'd404.settings.general.cross_sell',
    'my-addon/general-cross-sell',
    () => null,
)
```

### Loading addon JS on the Settings page

The parent enqueues `404-to-301-settings` on the Settings page. Addons
that want to inject UI here should enqueue their own script with that
handle as a dependency so the filter is in scope by the time the addon
registers its callback:

```php
wp_enqueue_script(
    'my-addon-settings',
    plugins_url( 'build/settings.js', __FILE__ ),
    array( '404-to-301-settings', 'wp-hooks', 'wp-element', 'wp-components', 'wp-i18n' ),
    MY_ADDON_VERSION,
    true
);
```

## REST API

All endpoints live under `/wp-json/d404/v1/`:

- `GET/POST/DELETE /redirects` — list / create / bulk-delete redirects.
- `POST /redirects/bulk-update` — apply a column change to many rows at once.
- `GET/PATCH/DELETE /redirects/<id>` — single redirect.
- `GET/DELETE /logs` — list / bulk-delete logs.
- `POST /logs/bulk-update` — flip the status on many rows at once.
- `GET/PATCH/DELETE /logs/<id>` — single log.
- `GET/PATCH /settings` — read or update settings (also bridged through
  `/wp/v2/settings` for use with the WP core React hooks).
- `GET /settings/export` — JSON envelope of every user-facing setting.
- `POST /settings/import` — apply a previously-exported envelope.
- `GET/POST /migration` — drive the v3 → v4 migration.
- `GET /addons` — the add-on catalog.

The endpoints require the capability returned by `404_to_301_capability`
(defaults to `manage_options`).

### Bulk endpoints

Both `bulk-update` endpoints follow the same shape: a required `ids`
array plus a curated subset of writable fields. Any field not in the
payload is left untouched on the matched rows. Passing no mutating
fields is a no-op that returns `{ updated: 0 }`.

```http
POST /wp-json/d404/v1/redirects/bulk-update
Content-Type: application/json

{ "ids": [12, 13, 14], "is_active": false }
```

```http
POST /wp-json/d404/v1/logs/bulk-update
Content-Type: application/json

{ "ids": [101, 102], "status": 2 }
```

`/redirects/bulk-update` accepts `is_active` and `redirect_type` — bulk
rewriting `source` or `target_url` is not supported because every row
would end up identical. For richer bulk imports / exports use WP-CLI.

### Settings import / export

`GET /settings/export` returns the current settings as a JSON envelope:

```json
{
    "plugin": "404-to-301",
    "schema_version": 1,
    "plugin_version": "4.0.0",
    "exported_at": "2026-06-05T10:00:00+00:00",
    "site_url": "https://example.com",
    "settings": {
        "disable_guessing": "light",
        "redirect_enabled": true,
        "redirect_type": "301"
    }
}
```

`POST /settings/import` accepts either the full envelope or just the
`settings` object (the importer detects which). The payload goes
through `Settings::update()` so every key is sanitised by the existing
pipeline; unknown keys are dropped silently — an envelope from a newer
plugin version downgrades gracefully on an older site.

```http
POST /wp-json/d404/v1/settings/import
Content-Type: application/json

{ "settings": { "disable_guessing": "strict" } }
```

Install-specific keys (`plugin_version`, `db_version`, `logs_migrated`,
`phase1_done`, `legacy_table_dropped`) are stripped from both
directions — they're install state, not portable settings.

Two filters bracket the round-trip:

- `404_to_301_settings_export( $envelope )` — last chance to add or
  redact keys before the JSON goes out. Addons whose state lives
  outside the plugin's option can append to the envelope here.
- `404_to_301_settings_import( $incoming, $raw_body )` — last chance
  to transform an incoming payload before it's merged with the
  current settings.

## Service locator

Inside an `404_to_301_init` action, you can reach core services through:

```php
$core     = \DuckDev\FourNotFour\Core::instance();
$settings = $core->settings();             // DuckDev\FourNotFour\Settings|null
```

For the request-scoped `Request` object during the action chain, use the
`$request` argument that every action / request filter receives.
