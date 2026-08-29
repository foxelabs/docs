---
title: Auto Logout
---

# Auto Logout

The **Auto Logout** add-on answers the two questions WordPress gives you no
setting for: how long an unattended session should stay open, and how long
any session should last at all.

It covers both:

- **Idle logout** — end a session that stops being used, after a timeout you
  choose, with an optional warning countdown first and different timeouts per
  role.
- **Session length** — replace WordPress's fixed 2-day and 14-day login
  durations with your own.

When active, this add-on adds an **Auto Logout** panel to the
[Settings tab](/loggedin/general-settings).

[[toc]]

::: info Idle timeout vs session length
These are different controls and most compliance rules ask for both.

The **idle timeout** ends a session that has gone *unused* — someone walked
away from a shared workstation. The **session length** ends a session no
matter how busy it was — a login shouldn't be valid for a fortnight just
because someone keeps clicking.

A session ends when *either* limit is reached, whichever comes first.
:::

## Log out idle users

**Setting key:** `loggedin_auto_logout_settings.idle_timeout` &middot;
**Default:** `0` (off)

Idle logout ships switched off. Signing people out is disruptive enough that
it should be a deliberate choice, not something that starts happening the
moment you activate the add-on.

Turning the toggle on seeds the timeout at **15 minutes** and reveals the
rest of the idle controls. Turning it off stores `0`, which disables idle
logout for everyone — the timeout and warning values you had configured are
kept, so switching it back on restores them.

## Idle timeout (minutes)

**Setting key:** `loggedin_auto_logout_settings.idle_timeout` &middot;
**Default:** `15` when first enabled &middot; **Maximum:** `43200` (30 days)

How long a session may sit unused before it is ended. This is the whole
window, not the time before the warning appears — a 15-minute timeout with a
60-second warning shows the dialog at 14 minutes.

## Warn before signing out (seconds)

**Setting key:** `loggedin_auto_logout_settings.warning` &middot;
**Default:** `60` &middot; **Maximum:** `3600`

Shows a countdown dialog before the session ends, so someone who stepped away
mid-form can choose to stay. Set it to `0` to sign people out with no warning
at all.

The warning can never consume more than **half** the idle timeout. If you set
a 60-second warning against a 1-minute timeout, the dialog would open the
instant the page loaded, so the value is capped at 30 seconds for that
request. The stored setting is left alone — raise the timeout and your full
warning applies again.

## Per-role idle timeouts

**Setting key:** `loggedin_auto_logout_role_timeouts[<role_slug>]` &middot;
**Default:** empty

Roles listed here override the global idle timeout. Anything not listed uses
the global value. Each row is a role picker plus a timeout in minutes; roles
already used on another row disappear from the picker, so the same role can't
be configured twice.

This is the usual shape for a compliance-driven site: five minutes for
administrators and shop managers, an hour for subscribers who are only
reading.

Removing a row reverts that role to the global timeout. Custom roles
registered by another plugin or your theme appear automatically, and if a
role is deleted after you configure it, the next save drops the orphaned
entry.

### Multi-role users — "shortest wins"

When a user holds several roles that each have a rule, the **shortest**
timeout applies.

An editor who is also a subscriber, with 30 minutes set for editors and 5 for
subscribers, gets **5 minutes**.

::: warning This is the opposite of Limit Per Role
[Limit Per Role](/loggedin/addons/limit-per-role) resolves multi-role users
with **highest wins** — the most permissive cap. Auto Logout deliberately
does the reverse.

The reason is that the two settings fail in opposite directions. A session
*limit* denies access, so when rules conflict the loose value is the safe
one — you don't want a second role locking someone out of their account. An
idle *timeout* only ends a session that nobody is using, so the tight value
is the safe one, and it's what a site configuring this feature is asking for
in the first place.

If you have both add-ons active, keep this in mind: a user's extra role can
*raise* their session limit and *lower* their idle timeout.
:::

## Session length (hours)

**Setting key:** `loggedin_auto_logout_settings.session_lifetime` &middot;
**Default:** `0` (leave WordPress alone) &middot; **Maximum:** `8760` (1 year)

How long a login lasts when **Remember Me** was *not* ticked, even while in
active use. WordPress's built-in value is 2 days.

Leave it at `0` to keep the WordPress default.

## "Remember me" length (days)

**Setting key:** `loggedin_auto_logout_settings.remember_lifetime` &middot;
**Default:** `0` (leave WordPress alone) &middot; **Maximum:** `365`

The same control for logins where the visitor ticked **Remember Me**.
WordPress's built-in value is 14 days.

The two lengths are independent. Setting one to `0` keeps WordPress's default
for that case only, so you can shorten remembered logins without touching
normal ones.

::: info Replaces the `auth_cookie_expiration` snippet
Both settings are applied through WordPress's `auth_cookie_expiration`
filter, which is otherwise the only way to change these durations — see
[Session duration](/loggedin/developer-docs#session-duration) in the
developer docs. If you already have a snippet doing this, remove it: the
add-on hooks the filter at priority `20` and will override a snippet running
at the default priority.

Changing these values does **not** shorten sessions that already exist. The
duration is written into the auth cookie at login, so the new length applies
from each user's next sign-in.
:::

## How enforcement works

Enforcement is **server-side**. The browser script makes the logout happen at
the moment it's due and offers the warning, but it isn't what enforces the
rule — closing the tab, disabling JavaScript, or killing the script does not
buy anyone a longer session. The check runs early on every authenticated
request, so a session that went idle is ended on that device's next request
whatever it is.

There is **no cron job and no polling**. The add-on tracks a "last active"
timestamp per device and compares it against the timeout:

- **Page views** renew the timestamp, throttled to at most one write per
  quarter of the timeout, and never more than one a minute. On a 20-minute
  timeout that's one small database write per user per five minutes of
  browsing, not one per page view.
- **Background requests do not.** The WordPress heartbeat fires every 15–60
  seconds from any open admin tab; if that counted as activity, an unattended
  dashboard would keep a session alive forever. AJAX and REST requests are
  therefore checked but never treated as activity.
- **Genuine single-page activity** — the block editor, a WooCommerce screen
  where you can work for a long time without a page load — is covered by the
  browser script, which sends one lightweight ping while you're actually
  interacting and only when the stored timestamp is about to go stale. It
  sends nothing at all once you stop.
- **WP-CLI and cron** are exempt entirely. They aren't a person at a browser,
  and signing them out mid-run would be worse than useless.

## What the user sees

With a warning configured, a dialog appears when the countdown reaches the
warning threshold, showing the time remaining:

- **Stay signed in** clears the dialog, renews the session immediately, and
  restarts the timer.
- **Sign out now** ends the session straight away.
- Ignoring it signs the user out when the countdown hits zero.

Activity in one tab keeps every other tab alive, with no extra server
requests — tabs share activity through browser storage, so typing in one is
enough. A tab that was suspended (laptop closed, browser throttling a
background tab) re-checks the clock when it comes back rather than acting on
a stale timer.

After an idle logout the user lands on the login screen with **"You were
signed out because your session was inactive."** Only the idle device is
signed out — other devices keep their own sessions and their own countdowns.

## Where activity is stored

Timestamps live in their own user meta row, `loggedin_auto_logout_activity`,
as one entry per device. Entries older than the timeout are pruned
automatically on the next write, so the row doesn't grow.

They are deliberately **not** stored inside WordPress's `session_tokens`
data. That holds every session for a user in a single value that WordPress
and the [Active Sessions](/loggedin/addons/active-sessions) add-on both
rewrite wholesale. Putting frequent activity writes in there would create a
race where an admin signing one session out could have it reappear a moment
later, undone by that user's next activity write. Keeping a separate row
means the two never collide.

## Saving

The panel lives on the parent plugin's **Settings** tab. Edits don't persist
until you click **Save Changes** at the bottom of the page, which flushes
every pending change on the tab in a single REST call.

## Working with other add-ons

**[Real-time Logout](/loggedin/addons/realtime-logout)** pairs particularly
well with this add-on. Its poll runs the idle check server-side even in a tab
the browser has throttled, so an idle logout propagates to every open tab
within the polling interval. Its polling does not keep sessions alive — those
requests are checked but never count as activity.

**[Active Sessions](/loggedin/addons/active-sessions)** lists a session as
active until it is actually collected. Because an idle session is ended on
the device's *next* request, a session that has passed its idle timeout can
still appear in that list for a while. Signing it out manually from there is
always safe.

## Developer hooks

### `loggedin_auto_logout_timeout`

Filters the resolved idle timeout for a user, **in minutes**, after role
rules have been applied. Return `0` to exempt the user from idle logout
entirely.

```php
// Never sign out the kiosk display account.
add_filter( 'loggedin_auto_logout_timeout', function ( $minutes, $user ) {
    return $user && user_can( $user, 'kiosk_display' ) ? 0 : $minutes;
}, 10, 2 );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$minutes` | `int` | Resolved timeout in minutes. `0` means idle logout is off. |
| `$user` | `WP_User\|null` | The user being resolved. |

### `loggedin_auto_logout_expired`

Fires immediately before an idle session is terminated, while the user is
still resolvable. Useful for audit logging.

```php
add_action( 'loggedin_auto_logout_expired', function ( $user_id, $timeout ) {
    error_log( sprintf(
        'User %d signed out after %d seconds idle.',
        $user_id,
        $timeout
    ) );
}, 10, 2 );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$user_id` | `int` | User whose session is ending. |
| `$timeout` | `int` | Resolved timeout in **seconds**. |

## Uninstalling

Deactivating the add-on stops idle logout immediately and restores
WordPress's own cookie durations for subsequent logins. Existing sessions are
untouched and keep whatever duration they were issued with.

Deleting the add-on removes both settings options and clears the stored
activity timestamps for every user, leaving nothing behind.

## Related

- [General Settings](/loggedin/general-settings) — the core session limit.
- [Limit Per Role](/loggedin/addons/limit-per-role) — per-role session caps,
  which resolve multi-role users in the opposite direction.
- [Real-time Logout](/loggedin/addons/realtime-logout) — makes an idle
  logout visible in every open tab.
- [Session duration](/loggedin/developer-docs#session-duration) — the
  underlying WordPress behaviour these settings override.
