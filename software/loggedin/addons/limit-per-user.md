---
description: "Override the global Loggedin session limit for individual WordPress user accounts."
title: Limit Per User
---

# Limit Per User

The **Limit Per User** add-on lets you set a concurrent-session cap that
applies to a single user account, overriding the global limit set on
the [Login limits](/loggedin/general-settings) page. Use this when a specific account
legitimately needs more (or fewer) parallel sessions than your default — a
shared editorial login, a service account, an executive who roams between
four devices, etc.

This add-on adds no settings to the **Users → Loggedin** screen; once it's
active, the "Need a different limit for one account?" line under
**Maximum active sessions** on **Login limits** goes away. Its only UI
is a field on the WordPress **profile** screen. Only people who can edit
other users (administrators; super admins on multisite) see it, on their
own profile and when they edit someone else. Other users never see their
own limit and can't change it.

[[toc]]

## Where to find the field

Open the user edit screen — either **Users → Profile** (your own) or
**Users → All Users → Edit** for someone else — and scroll down. The field
is under a **Login limit** heading, near the bottom of the page.

Since Loggedin 3.4.0 the same screen also has a **Your sessions** list on
your own profile, or a **Sessions** count on someone else's. Those come
from the core plugin; see [User Sessions](/loggedin/user-sessions).

## Maximum active sessions

**Setting key:** `loggedin_per_user_limit` (user meta) &middot;
**Default:** *empty (use the global limit)*

A single number input, with "sessions" after it, that overrides the
global concurrent-session limit for this user only. Minimum is `0`. The
help text reads: "How many devices this user can be signed in on at the
same time. Leave empty to use the role or site limit."

The override applies only to the user being edited. Other users continue
to use whatever limit applies to them (global, or a per-role limit if you
also run [Limit Per Role](/loggedin/addons/limit-per-role)).

### How values are interpreted

| Stored value | Behaviour |
| --- | --- |
| Empty / blank | No override — the user falls back to the global / role limit. |
| `0` or any negative | Same as blank — treated as "no override" and the meta row is removed. |
| `1` or greater | The user is capped at this many concurrent sessions. |

Storing `0` would look identical to "no override" anyway, so the add-on
actively deletes the meta row in that case to keep `usermeta` clean.

## Saving

The field is saved by the standard WordPress profile-update flow — click
**Update Profile** at the bottom of the page. There is no separate save
button for the Loggedin field, and the value takes effect immediately on
the next login attempt.

Saving needs a valid nonce, the `edit_users` capability and permission to
edit that user. Every user may edit their own profile, so since 2.2.0 the
field also needs `edit_users`: before, any user could raise their own limit
from their profile.

## How the cap is enforced

The add-on hooks the parent plugin's
[`loggedin_reached_limit`](/loggedin/developer-docs#loggedin-reached-limit)
filter at priority `11`. On each login attempt the parent first builds the
global verdict; this add-on then reads the target user's meta key and, if
a positive value is stored, recomputes the verdict using that limit
instead.

The selected [login logic](/loggedin/general-settings#login-logic) (Logout
Oldest / Logout All / Block New) still applies — the only thing the
override changes is the numeric cap.

## Priority over other add-ons

When multiple Loggedin limit add-ons are active, this one **wins**:

| Source | Priority on `loggedin_reached_limit` |
| --- | --- |
| Limit Per Role | `10` |
| Limit Per User | `11` |

Per-user > per-role > global. A user with a per-user override always uses
that value regardless of any role-level limit configured for them.

## Related

- [Login Limits](/loggedin/general-settings) — where the global limit
  is configured.
- [Limit Per Role](/loggedin/addons/limit-per-role) — bulk-configure
  limits per WordPress role.
- [`loggedin_reached_limit`](/loggedin/developer-docs#loggedin-reached-limit)
  — the underlying filter.
