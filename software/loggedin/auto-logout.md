---
description: "Log WordPress users out after a period of inactivity, set timeouts per role, and cap how long any login lasts, with Loggedin's free auto logout."
title: Auto Logout
---

# Auto Logout

Auto logout answers two questions WordPress gives you no setting for:
how long an unattended session should stay open, and how long any login
should last at all.

- **Idle logout** — end a session that stops being used, after a
  timeout you choose, with an optional warning countdown first and
  different timeouts per role.
- **Session length** — replace WordPress's fixed 2-day and 14-day login
  lengths with your own.

The settings are on the **Auto logout** page — **Users → Loggedin →
Settings › Auto logout** (`&tab=auto-logout`). The same page holds
[Password changes](/loggedin/user-sessions#sign-out-on-password-change),
which signs out a user's other devices when their password changes.

Auto logout is part of the free plugin since Loggedin 3.4.0.

[[toc]]

::: info Idle timeout vs session length
These are different controls, and most compliance rules ask for both.

The **idle timeout** ends a session that has gone *unused*: someone
walked away from a shared workstation. The **session length** ends a
session however busy it is: a login shouldn't be valid for a fortnight
just because someone keeps clicking.

A session ends when *either* limit is reached, whichever comes first.
:::

## Idle logout

### Sign out idle sessions

**Setting key:** `loggedin_auto_logout_settings.idle_timeout` &middot;
**Default:** `0` (off)

Idle logout is off by default, on new and updated sites alike. Signing
people out is disruptive enough that it should be a deliberate choice.
While it's off, Loggedin loads no script and writes nothing.

Turning the toggle on sets the timeout to **15 minutes** and shows the
rest of the idle controls. Turning it off stores `0`, which turns idle
logout off for everyone.

Only the device that went idle is signed out. The user's other devices
keep their own sessions and their own timers.

### Sign out after

**Setting key:** `loggedin_auto_logout_settings.idle_timeout` &middot;
**Default:** `15` minutes when first turned on &middot; **Range:** `1` to
`43200` (30 days)

How long a session can go unused. This is the whole window, not the
time before the warning: a 15-minute timeout with a 60-second warning
shows the countdown at 14 minutes.

### Warn first

**Setting key:** `loggedin_auto_logout_settings.warning` &middot;
**Default:** `60` seconds &middot; **Range:** `0` to `3600`

Shows a countdown before the session ends, so someone in the middle of a
form can choose to stay signed in. Set it to `0` to sign people out with
no warning.

The warning is never more than **half** the timeout. A 60-second warning
against a 1-minute timeout would open the moment the page loaded, so it
is cut to 30 seconds for that user. The stored value is left alone:
raise the timeout and the full warning applies again.

## Timeouts per role

**Setting key:** `loggedin_auto_logout_role_timeouts[<role_slug>]`
&middot; **Default:** empty

This card appears once idle logout is on. Roles listed here use their own
timeout; every other role uses **Sign out after** above.

Click **Add a role** to add a row, then pick the role and set its
timeout in minutes. A role already in the list isn't offered again.
Remove a row to send that role back to the main timeout.

A common setup for a compliance-driven site: five minutes for
administrators and shop managers, an hour for subscribers who are only
reading.

Custom roles from other plugins or your theme appear automatically. If a
role is deleted after you set a timeout for it, the next save drops it.

### Users with several roles: the shortest wins

When a user holds several roles that each have a timeout, the
**shortest** one applies.

An editor who is also a subscriber, with 30 minutes set for editors and
5 for subscribers, gets **5 minutes**.

::: warning This is the opposite of Limit Per Role
[Limit Per Role](/loggedin/addons/limit-per-role) gives a user with
several roles the **highest** session limit. Auto logout deliberately
does the reverse.

The two settings fail in opposite directions. A session *limit* denies
access, so when rules conflict the looser value is the safe one: you
don't want a second role locking someone out. An idle *timeout* only
ends a session nobody is using, so the tighter value is the safe one,
and it's what a site turning this on is asking for.

If you use both, keep it in mind: an extra role can *raise* a user's
session limit and *lower* their idle timeout.
:::

## Session length

Both lengths apply from each user's next login. Sessions that already
exist keep the length they were given.

### Login lasts

**Setting key:** `loggedin_auto_logout_settings.session_lifetime`
&middot; **Default:** `0` (WordPress default) &middot; **Range:** `0` to
`8760` hours (1 year)

How long a login lasts when **Remember Me** was *not* ticked, even while
in active use. `0` keeps the WordPress default of 48 hours.

### With "Remember Me"

**Setting key:** `loggedin_auto_logout_settings.remember_lifetime`
&middot; **Default:** `0` (WordPress default) &middot; **Range:** `0` to
`365` days

The same control for logins where **Remember Me** was ticked. `0` keeps
the WordPress default of 14 days.

The two lengths are independent. Leave one at `0` to keep WordPress's
default for that case only, so you can shorten remembered logins without
touching normal ones.

::: info Replaces the `auth_cookie_expiration` snippet
Both lengths are applied through WordPress's `auth_cookie_expiration`
filter, which is otherwise the only way to change them. See
[Session duration](/loggedin/developer-docs#session-duration) in the
developer docs. If you already have a snippet doing this, remove it:
Loggedin hooks the filter at priority `20`, so it overrides a snippet at
the default priority whenever a length is set here.
:::

## How enforcement works

Enforcement happens on the **server**. The browser script makes the
logout happen on time and shows the warning, but it isn't what enforces
the rule. Closing the tab, turning off JavaScript or stopping the script
doesn't buy anyone a longer session. The check runs early on every
signed-in request, so a session that went idle ends on that device's
next request, whatever it is.

There is **no cron job and no polling**. Loggedin keeps a "last active"
time per device and compares it with the timeout:

- **Page views** renew the time, at most once per quarter of the
  timeout and never more than once a minute. On a 20-minute timeout
  that's one small database write per user per five minutes of
  browsing, not one per page view.
- **Background requests don't.** The WordPress heartbeat fires every
  15–60 seconds from any open admin tab. If that counted as activity, an
  unattended dashboard would stay signed in forever. AJAX and REST
  requests are checked, but never count as activity.
- **Work inside one page** — the block editor, a WooCommerce screen you
  can use for a long time without a page load — is covered by the browser
  script. It sends one small request while you're actually typing or
  clicking, and only when the stored time is about to go stale. Once you
  stop, it sends nothing.
- **WP-CLI and cron** are never signed out. They aren't a person at a
  browser.
- **A session from before idle logout was turned on** counts from its
  login time, so it can't escape the timeout.

## What the user sees

With a warning set, a **Still there?** dialog appears when the countdown
reaches the warning, showing the time left:

- **Stay signed in** closes the dialog, renews the session at once and
  restarts the timer.
- **Sign out now** ends the session straight away.
- Doing nothing signs the user out when the countdown reaches zero.

Activity in one tab keeps every other tab alive, with no extra server
requests: tabs share activity through browser storage. A tab that was
asleep (laptop closed, or the browser throttling a background tab)
checks the clock when it wakes, rather than acting on an old timer.

After an idle logout the user lands on the login screen with **"You were
signed out because your session was inactive."**

## Where activity is stored

Times live in their own user meta row, `loggedin_auto_logout_activity`,
with one entry per device, keyed by the session's SHA-256 verifier.
Entries older than the timeout are removed on the next write, so the row
doesn't grow.

They are deliberately **not** stored in WordPress's `session_tokens`
data. That holds every session for a user in one value, which WordPress,
Loggedin and the [Active Sessions](/loggedin/addons/active-sessions)
add-on all rewrite whole. Frequent activity writes in there would let an
administrator's sign-out be undone a moment later by that user's next
activity write. A separate row means the two never collide.

## Working with add-ons

**[Real-time Logout](/loggedin/addons/realtime-logout)** pairs well with
idle logout. Its check runs the idle check on the server even in a tab
the browser has throttled, so an idle logout reaches every open tab
within its interval. Its checks don't keep sessions alive: they are
checked but never count as activity.

**[Active Sessions](/loggedin/addons/active-sessions)** lists a session
until it actually ends. An idle session ends on the device's *next*
request, so a session past its idle timeout can still appear in that
list for a while. Signing it out from there is always safe.

## Developer hooks

- [`loggedin_auto_logout_timeout`](/loggedin/developer-docs#loggedin-auto-logout-timeout)
  — change the idle timeout for a user, or return `0` to exempt them.
- [`loggedin_auto_logout_expired`](/loggedin/developer-docs#loggedin-auto-logout-expired)
  — runs just before an idle session ends. Useful for audit logs.

## Turning it off and uninstalling

Turning **Sign out idle sessions** off stops idle logout at once. Setting
both lengths back to `0` restores WordPress's own login lengths for
later logins. Existing sessions keep the length they were given.

Deleting Loggedin removes both auto logout options and the stored
activity times for every user.

## Related

- [Login Limits](/loggedin/general-settings) — the session limit.
- [User Sessions](/loggedin/user-sessions) — sign out other devices on a
  password change.
- [Limit Per Role](/loggedin/addons/limit-per-role) — limits per role,
  which treat users with several roles the opposite way.
- [Session duration](/loggedin/developer-docs#session-duration) — the
  WordPress behaviour these settings override.
