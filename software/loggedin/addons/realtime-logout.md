---
description: "Reload open browser tabs the moment a WordPress session ends, so logged-out users are sent straight to the login page."
title: Real-time Logout
---

# Real-time Logout

The **Real-time Logout** add-on detects when a session has ended on the
server — because the user logged out elsewhere, was force-logged-out by an
admin, or hit the concurrent-session limit — and reloads any open tab at
its next check so the user is bounced back to wp-login.

Without this add-on, an "already logged-out" browser tab keeps rendering as
if it were still authenticated until the user clicks something that
triggers a new request. With this add-on, that window typically shrinks to
whatever polling interval you've configured (60 seconds by default).

When active, this add-on adds a **Real-time logout** card to the
[Login limits](/loggedin/general-settings) page: **Users → Loggedin →
Settings › Login limits**, below the core cards.

::: info Version 2.2.0 and later
Real-time Logout 2.2.0 is the first version built for the settings screen
in Loggedin 3.4.0. Older versions still work: their panel is shown as a
card on **Login limits**, and Loggedin lists the add-on in a notice asking
you to update it. With Loggedin older than 3.4.0, 2.2.0 keeps its old
**Real-time Logout** panel on the **Settings** tab, so you can update the
add-on and Loggedin in either order. This page describes 2.2.0.
:::

[[toc]]

::: info Not literally "real-time"
Despite the name, this is not a WebSocket or push-based system. The add-on
ships a small front-end script that polls a single AJAX endpoint at a
fixed interval. We chose polling because it works on every WordPress host
— no Node sidecar, no third-party realtime service, no firewall changes —
and at the recommended 60 s interval the load is negligible.
:::

## Check every (seconds)

**Setting key:** `loggedin_realtime_logout_refresh_interval` &middot;
**Default:** `60`

How often each open tab asks the server whether the session is still
active. The field's help text reads: "Each open tab asks your server this
often. Every check is a request, so 60 seconds or more suits most sites."
Stored as an integer in its own site option; the smallest value is `1`.
On the screen, a lower value blocks **Save**; one written another way is
reset to the default of `60`.

Every authenticated page (front-end and admin) ships the polling script,
unless the
[`loggedin_realtime_logout_enabled`](#loggedin-realtime-logout-enabled)
filter turns it off. At each interval the script posts to
`admin-ajax.php?action=loggedin_refresh_check`. The endpoint replies
`{ "success": true, "data": { "active": true } }` for logged-in users and
`"active": false` for everyone else; on `false`, the script reloads the
page with `window.location.reload()`, which causes WordPress to redirect
the now-unauthenticated visitor to wp-login.

Since 2.2.0, a tab that is hidden (in the background, or in a minimised
window) skips its checks, and checks once as soon as it is shown again.
Only the tabs someone is looking at send requests.

::: warning Pick the interval carefully
Each visible tab makes one HTTP request per interval. A site with hundreds of
concurrent users and a 5-second interval is firing tens of thousands of
requests per minute at `admin-ajax.php`. Keep the interval at **60 seconds
or higher** unless you're operating on a single-user / small-team install
where the load is irrelevant. Use a CDN or page-cache exclusion for
`admin-ajax.php` (most caches already exempt it).
:::

## Where the polling script runs

The polling script is enqueued on:

- The front-end (`wp_enqueue_scripts`)
- The WordPress admin (`admin_enqueue_scripts`)

…but only when there is a logged-in user. Anonymous visitors get nothing —
there's nothing to poll for, and we don't ship a no-op bundle to anonymous
traffic.

To leave the script off for some users or pages, use the
[`loggedin_realtime_logout_enabled`](#loggedin-realtime-logout-enabled)
filter. To poll some users more or less often than the setting, use
[`loggedin_realtime_logout_interval`](#loggedin-realtime-logout-interval).

## Saving

Edits don't persist until you click **Save** in the page header, which
saves every pending change on the screen in one request. See
[Saving](/loggedin/general-settings#saving).

## Hooks

### `loggedin_realtime_logout_enabled`

Filters whether the current page loads the polling script for the
signed-in user. Return `false` to leave it off, for example for a role
that doesn't need it or on a page that must not reload.

```php
apply_filters( 'loggedin_realtime_logout_enabled', bool $enabled, WP_User $user );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$enabled` | bool | Whether to poll. Default `true`. |
| `$user` | `WP_User` | The signed-in user. |

```php
// No polling for subscribers.
add_filter( 'loggedin_realtime_logout_enabled', function ( $enabled, $user ) {
    return in_array( 'subscriber', (array) $user->roles, true ) ? false : $enabled;
}, 10, 2 );
```

Since 2.2.0.

### `loggedin_realtime_logout_interval`

Filters how often the current page checks the user's session, in
seconds. Every check is a request to the server.

```php
apply_filters( 'loggedin_realtime_logout_interval', int $seconds, WP_User $user );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$seconds` | int | Interval from the [Check every](#check-every-seconds) setting. |
| `$user` | `WP_User` | The signed-in user. |

```php
// Administrators are checked every 30 seconds.
add_filter( 'loggedin_realtime_logout_interval', function ( $seconds, $user ) {
    return user_can( $user, 'manage_options' ) ? 30 : $seconds;
}, 10, 2 );
```

The result is sanitised like the setting: it's cast to a whole number,
and a value below `1` falls back to the default of `60`.

Since 2.2.0.

## Related

- [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions)
  — the parent's action that fires when admins use Force Logout. Real-time
  Logout is what makes that logout visible to the user without them having
  to refresh.
- [Force Logout](/loggedin/force-logout) — sign users out from the
  **Sessions** page.
- [Auto logout](/loggedin/auto-logout#working-with-add-ons) — this
  add-on's checks carry an idle logout to every open tab.
