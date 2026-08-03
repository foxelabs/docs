---
title: Limit Per User
---

# Limit Per User

The **Limit Per User** add-on lets you set a concurrent-session cap that
applies to a single user account, overriding the global limit configured
on the main Loggedin settings page. Use this when a specific account
legitimately needs more (or fewer) parallel sessions than your default — a
shared editorial login, a service account, an executive who roams between
four devices, etc.

This add-on has no panel on the main Loggedin settings page. Its only UI
is a field added to the WordPress **profile** screen — both for your own
profile and for the "edit user" screen administrators see when they edit
other users.

[[toc]]

## Where to find the field

Open the user edit screen — either **Users → Profile** (your own) or
**Users → All Users → Edit** for someone else — and scroll down. The field
is rendered under a **Loggedin** heading with a lock icon, near the bottom
of the page.

## Concurrent Sessions Limit

**Setting key:** `loggedin_per_user_limit` (user meta) &middot;
**Default:** *empty (use the global limit)*

A single number input that overrides the global concurrent-session limit
for this user only. Minimum is `0`; placeholder text reads "Use the global
limit".

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

A nonce check and the `edit_user` capability are enforced on save, so a
non-admin can't elevate their own limit through a crafted request.

## How the cap is enforced

The add-on hooks the parent plugin's
[`loggedin_reached_limit`](/loggedin/developer-docs#loggedin_reached_limit)
filter at priority `11`. On each login attempt the parent first builds the
global verdict; this add-on then reads the target user's meta key and, if
a positive value is stored, recomputes the verdict using that limit
instead.

The selected [Login Logic](/loggedin/general-settings#login-logic) (Logout
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

- [General Settings](/loggedin/general-settings) — where the global limit
  is configured.
- [Limit Per Role](/loggedin/addons/limit-per-role) — bulk-configure
  limits per WordPress role.
- [`loggedin_reached_limit`](/loggedin/developer-docs#loggedin_reached_limit)
  — the underlying filter.
