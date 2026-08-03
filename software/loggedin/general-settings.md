---
title: General Settings
---

# General Settings

The **Settings** tab — **Users → Loggedin → Settings** — is the main control
surface for the plugin. It houses two related controls: the concurrent
session limit, and the rule Loggedin follows when that limit is reached.

Edits made on this tab are queued in core-data's edit buffer and **don't**
persist until you click **Save Changes** at the bottom of the page.
Switching away from the tab without saving discards any pending changes.

[[toc]]

## Active Logins Limit

**Setting key:** `maximum` &middot; **Default:** `1`

The maximum number of simultaneous WordPress sessions a single user account
is allowed to hold.

A "session" here is the WordPress session token created at login — one per
browser, per device. Two browsers on the same laptop count as two sessions;
a phone and a desktop count as two. Closing a tab or a browser window does
**not** end a session — the token persists server-side until the user
explicitly logs out, the session expires, or another login displaces it
under the rule below.

The field is a number input with a minimum of `1`; lower values are clamped
at save.

::: info Session storage matters
Loggedin reads session counts from the standard WordPress session tokens API
(`WP_Session_Tokens`). On a stock install those tokens live in the
`usermeta` table and everything Just Works. If your site routes session
storage elsewhere — typically a Redis or Memcached-backed object-cache
plugin — the count still works, but the **Logout Oldest** mode does not
(it needs direct `usermeta` access). See the note under that mode for
details.
:::

## Login Logic

**Setting key:** `logic` &middot; **Default:** `Logout All` (`allow`)

The rule Loggedin applies when a new login would exceed the limit. A radio
group — exactly one mode is active at any time. The help text under the
radios updates as you switch between options so you can see what each one
does before you save.

The three modes are stored as enum values (`allow`, `logout_oldest`,
`block`) — labels on the UI map to those values as listed below.

### Logout Oldest

**Stored value:** `logout_oldest`

When a new login would exceed the limit, Loggedin destroys the **single
oldest** active session for that user, leaving the rest intact. The new
login is then allowed through.

This is the closest match to how most "remember me" workflows behave on
consumer apps — a user logging in on a fourth device automatically signs
out of their oldest one, but their other current devices are untouched.

::: warning Requires user-meta session storage
This mode reads the raw `session_tokens` user-meta row directly because the
WordPress `WP_Session_Tokens` API doesn't expose a "drop the oldest"
primitive. Sites that override session storage (e.g. Redis-backed object
caches that move sessions out of `usermeta`) should use **Logout All**
instead — that mode goes through `WP_Session_Tokens::destroy_all()` and
works with any backend.
:::

### Logout All

**Stored value:** `allow`

When a new login would exceed the limit, Loggedin destroys **every** other
active session for that user before letting the new login through. The new
device becomes the user's only active session.

Pick this when you want users effectively confined to one device at a time
and want any new login to be the canonical one.

::: tip Works with any session storage
Unlike Logout Oldest, this mode goes through the standard
`WP_Session_Tokens::destroy_all()` API, so it works correctly even when
session storage has been moved out of the `usermeta` table.
:::

### Block New

**Stored value:** `block`

When a new login would exceed the limit, Loggedin **rejects** the new login
with an error on the wp-login screen — existing sessions stay; the new one
is denied.

Pick this when you'd rather have users sign out of an existing device
themselves than have Loggedin pre-empt that choice for them. The error
message can be customised via the
[`loggedin_error_message`](/loggedin/developer-docs#loggedin_error_message)
filter.

::: tip Extending the logic list
Developers can add their own logic modes via the
[`loggedin_logics`](/loggedin/developer-docs#loggedin_logics) PHP filter.
New modes appear automatically in the radio group, but adding a mode also
requires extending the sanitiser — see the developer docs for the full
pattern.
:::

## Save Changes

The sticky button at the bottom of the page commits every pending edit on
the Settings tab in a single REST round-trip — both the controls above and
anything an add-on has added through the
[`loggedin.settings.panels`](/loggedin/developer-docs#loggedin-settings-panels)
JS slot.

The button is disabled until you actually change something and shows a busy
state while the save is in flight. The Force Logout panel has its own
button and does **not** participate in this save flow — see
[Force Logout](/loggedin/force-logout).
