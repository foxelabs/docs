---
description: "Find your way around the Loggedin settings screen, set the maximum number of concurrent sessions per WordPress user, and choose what happens when the limit is reached."
title: Login Limits
---

# Login Limits

Loggedin's settings live under **Users → Loggedin**. This page covers how
that screen is laid out, and the **Login limits** page on it: how many
sessions one account may hold, and what happens when a new login would
go over that number.

[[toc]]

## The settings screen

Loggedin 3.4.0 rebuilt the screen around a sidebar. Pages are grouped by
task:

| Group | Page | What it holds |
| --- | --- | --- |
| **Settings** | **Login limits** | The session limit and what happens when it's reached. Covered below. |
| | **[Lockout & recovery](/loggedin/lockout-recovery)** | Administrators, the blocked-login message, self-unlock by email, and what a signed-out device is told. |
| | **[Auto logout](/loggedin/auto-logout)** | Idle logout, session length, and signing out other devices on a password change. |
| **Manage** | **[Sessions](/loggedin/force-logout)** | Sign one user, or every user, out of every device. |
| **More** | **[Add-ons](/loggedin/addons/)** | The add-on catalog and license management. |
| | **Help** | Links to these docs and support, and the versions running on your site. |

Add-ons add their own pages and cards to these groups. For example,
[Active Sessions](/loggedin/addons/active-sessions) adds
**Manage › Active sessions**, and
[Limit Per Role](/loggedin/addons/limit-per-role) adds a card to
**Login limits**.

Below 782px wide, the sidebar is replaced by a section menu at the top of
the page.

The screen needs the `manage_options` capability.

### Linking to a page

Each page has its own address, set by the `tab` query argument:

```
/wp-admin/users.php?page=loggedin&tab=lockout
```

The page IDs are `login-limits`, `lockout`, `auto-logout`, `sessions`,
`addons` and `help`. Reloading keeps you on the same page, and the
browser's back button moves between pages. Links from before 3.4.0, such
as `#addons`, still open the right page.

### Saving

**Save** sits in the page header, at the top of every settings page. It
stays disabled until you change something. Next to it:

- A status line counts your unsaved changes.
- **Discard** throws away every unsaved change.

Changes on different pages save together. You can change the limit on
**Login limits**, switch to **Auto logout**, change a timeout there, and
one click on **Save** stores both.

A value that isn't allowed, such as a limit of `0`, shows an error under
the field and marks its page **Needs fixing** in the sidebar. **Save**
stays disabled until it's fixed. If you try to leave the screen with
unsaved changes, your browser asks you to confirm.

The **Sessions** page acts the moment you click, so it has no **Save**.

## Login limit

**Setting key:** `maximum` &middot; **Default:** `1`

**Maximum active sessions** is the number of devices one account can be
signed in on at the same time. It applies to every user.

A session is the WordPress session token created at login, one per
browser per device. Two browsers on the same laptop count as two
sessions; a phone and a desktop count as two. Closing a tab or a browser
window does **not** end a session. The token stays until the user logs
out, the session expires, or a new login ends it under the rule below.

The smallest value is `1`.

::: tip Different limits for some users
[Limit Per Role](/loggedin/addons/limit-per-role) sets a limit per role,
and [Limit Per User](/loggedin/addons/limit-per-user) sets one for a
single account. Administrators can also be left out of the limit
entirely: see
[Don't limit administrators](/loggedin/lockout-recovery#administrators).
:::

::: info Session storage matters
Loggedin counts sessions through the standard WordPress session tokens
API (`WP_Session_Tokens`). On a stock install those tokens live in the
`usermeta` table and everything works. If your site moves session
storage elsewhere, usually a Redis or Memcached object-cache plugin, the
count still works but **Logout Oldest** does not: it needs direct
`usermeta` access. See the note under that mode.
:::

## When the limit is reached {#login-logic}

**Setting key:** `logic` &middot; **Default:** `Logout All` (`allow`)

The rule Loggedin follows when a new login would go over the limit. The
**New login** choice shows one tile per mode, each with a sentence on
what it does. Exactly one mode is active at a time.

The modes are stored as `allow`, `logout_oldest` and `block`. The labels
on screen map to those values as listed below.

### Logout Oldest

**Stored value:** `logout_oldest`

The new login ends the **oldest** session for that user. The other
sessions stay. The new login goes through.

If you lowered the limit after users signed in, a user can hold more
sessions than it now allows. Their next login ends the oldest sessions,
one at a time, until the new one fits.

This is how most consumer apps behave. A user who signs in on a fourth
device is signed out of their oldest one, and their other current
devices are untouched.

::: warning Requires user-meta session storage
This mode reads and writes the `session_tokens` user meta directly,
because the `WP_Session_Tokens` API has no way to drop just the oldest
session. On a site that keeps sessions somewhere else (a Redis-backed
object cache, for example), Logout Oldest can't find the oldest session
and ends nothing. Use **Logout All** there: it goes through
`WP_Session_Tokens::destroy_all()` and works with any storage.
:::

### Logout All

**Stored value:** `allow`

The new login ends **every** other session for that user. The new device
becomes the only one signed in.

Pick this when you want users on one device at a time, with the newest
login always winning.

::: tip Works with any session storage
Unlike Logout Oldest, this mode goes through the standard
`WP_Session_Tokens::destroy_all()` API, so it works even when sessions
are stored outside the `usermeta` table.
:::

### Block New

**Stored value:** `block`

The new login is **refused** with an error on the login screen. Existing
sessions stay; the new one is denied until an older session ends or
expires.

The error only appears after the right password. A wrong password gets
WordPress's usual "incorrect password" error, so nobody learns that the
account is at its limit without knowing the password.

Pick this when you'd rather have users sign out of a device themselves
than have Loggedin do it for them. The message, and a way for users to
get themselves back in, are set on
[Lockout & recovery](/loggedin/lockout-recovery#blocked-logins).

::: warning Logins that skip the login form
Social login, magic-link and popup-login plugins often sign users in
without the login form. Logout Oldest and Logout All still apply to
those logins; Block New can't refuse them. See
[Compatibility](/loggedin/compatibility).
:::

::: tip Signed out without warning?
Under Logout Oldest and Logout All, the device that was signed out is
told why on its login screen, or sent to a page you choose. See
[Signed out by a newer login](/loggedin/lockout-recovery#signed-out-by-a-newer-login).
:::

::: tip Extending the logic list
Developers can add their own modes through the
[`loggedin_logics`](/loggedin/developer-docs#loggedin-logics) PHP filter.
A new mode appears as a tile automatically, but it also needs the
sanitizer extended. See the developer docs for the pattern.
:::

## Related

- [Lockout & recovery](/loggedin/lockout-recovery) — administrators, the
  blocked-login message and self-unlock.
- [Force Logout](/loggedin/force-logout) — sign users out from the
  **Sessions** page.
- [WP-CLI](/loggedin/wp-cli#wp-loggedin-settings-set) — change these
  settings from the command line.
