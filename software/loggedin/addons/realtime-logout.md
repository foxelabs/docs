---
description: "Reload open browser tabs the moment a WordPress session ends, so logged-out users are sent straight to the login page."
title: Real-time Logout
---

# Real-time Logout

The **Real-time Logout** add-on detects when a session has ended on the
server — because the user logged out elsewhere, was force-logged-out by an
admin, or hit the concurrent-session limit — and immediately reloads any
open tab so the user is bounced back to wp-login.

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
you to update it. This page describes 2.2.0.
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
active. Stored as an integer in its own site option; the smallest value
is `1`. On the screen, a lower value blocks **Save**; one written another
way is reset to the default of `60`.

Every authenticated page (front-end and admin) ships the polling script.
The script runs `setInterval(check, intervalMs)` and posts to
`admin-ajax.php?action=loggedin_refresh_check`. The endpoint replies
`{ active: true }` for logged-in users and `{ active: false }` for everyone
else; on `false`, the script triggers `window.location.reload(true)` to
force a hard refresh past the browser cache, which causes WordPress to
redirect the now-unauthenticated visitor to wp-login.

::: warning Pick the interval carefully
Each open tab makes one HTTP request per interval. A site with hundreds of
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

## Saving

Edits don't persist until you click **Save** in the page header, which
saves every pending change on the screen in one request. See
[Saving](/loggedin/general-settings#saving).

## Related

- [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions)
  — the parent's action that fires when admins use Force Logout. Real-time
  Logout is what makes that logout visible to the user without them having
  to refresh.
- [Force Logout](/loggedin/force-logout) — sign users out from the
  **Sessions** page.
- [Auto logout](/loggedin/auto-logout#working-with-add-ons) — this
  add-on's checks carry an idle logout to every open tab.
