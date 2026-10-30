---
description: "See session counts and last login times on the WordPress Users screen, sign users out everywhere, let users sign out their own devices from their profile, and end other sessions on a password change."
title: User Sessions
---

# User Sessions

Loggedin 3.4.0 adds sessions to the screens WordPress already has:

- The **Users** screen shows how many sessions each user has and when
  they last logged in, and can sign users out everywhere.
- The **profile** screen lists your own devices, and lets you sign out
  any of them.
- A **password change** signs the user out of their other devices.

None of these need the Loggedin settings screen, and the first two are
always on.

[[toc]]

## The Users screen

**Users → All Users** gets two columns and one action.

### Sessions column

How many sessions the user has right now: one per browser per device.
`0` means they aren't signed in anywhere.

### Last login column

When the user last logged in, as "3 hours ago". Hover it to see the
exact date and time. A dash means no login has been recorded.

Click the column heading to sort by it. The first click puts the most
recent logins first. Users with no recorded login stay in the list.

::: info Recorded from 3.4.0 onwards
The time is stored in the `loggedin_last_login` user meta each time a
user logs in, starting with Loggedin 3.4.0. Logins from before you
updated aren't known, so every user shows a dash until their next login.
It's recorded on WordPress's `wp_login` action, so a plugin that signs
users in without firing that action won't update it. See
[Compatibility](/loggedin/compatibility).
:::

Both columns read data WordPress already loads for the list, so they add
no database query per row.

### Sign out everywhere

**Sign out everywhere** ends every session a user has. It's in two
places:

- **Row action** — hover a user's row and click **Sign out everywhere**.
- **Bulk action** — tick several users, choose **Sign out everywhere**
  from **Bulk actions**, and click **Apply**.

There's no confirmation step. A notice confirms how many users were
signed out, such as "3 users were signed out of every device."

Details:

- You can only sign out users you're allowed to edit (the `edit_user`
  capability). Others are skipped.
- If you include yourself, your other devices are signed out but the
  session you're using stays, so you aren't logged out of wp-admin.
- Each user signed out fires
  [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions),
  then
  [`loggedin_users_list_sign_out`](/loggedin/developer-docs#loggedin-users-list-sign-out).

This is the same as **Sign out a user** on the
[Sessions page](/loggedin/force-logout), done from the list you already
use.

## Your sessions on the profile screen

### Your own profile

**Users → Profile** has a **Your sessions** section: every device you're
signed in on, newest first.

| Column | What it shows |
| --- | --- |
| **Device** | A short name such as "Chrome on macOS" or "Safari on iPhone", worked out from the browser's user agent. "Unknown device" when it can't tell. |
| **Address** | The IP address the session signed in from, with the last part hidden (for example `203.0.113.0`). |
| **Signed in** | When the session started, as "5 minutes ago". Hover it for the exact date and time. |

The device you're using is marked **This device**. Every other row has a
**Sign out** button that ends that session alone. For screen readers,
each button names its row, such as "Sign out Chrome on macOS, signed in
5 minutes ago". A notice then says
"That device was signed out." If the session had already ended, it says
"That device was already signed out."

To sign out of everything but this device at once, use WordPress's own
**Log Out Everywhere Else** button on the same screen.

Signing out a device fires
[`loggedin_destroy_session`](/loggedin/developer-docs#loggedin-destroy-session),
the same action as `wp loggedin sessions destroy --token=`.

::: info Needs the default session storage
The list reads the `session_tokens` user meta. On a site that stores
sessions somewhere else (Redis and the like), **Your sessions** shows
only how many devices you're signed in on, without the list.
:::

### Someone else's profile

When an administrator edits another user, a **Sessions** section shows
only how many devices that user is signed in on, such as
"Signed in on 3 devices." WordPress's own **Log Out Everywhere** button
signs them out.

To see another user's devices one by one and end them separately, use
the [Active Sessions](/loggedin/addons/active-sessions) add-on.

## Sign out on password change

**Setting key:** `password_signout` &middot; **Default:** on

Set on **Settings › Auto logout**, in the **Password changes** card:
**Sign out the other devices**.

When a user's password changes or is reset, Loggedin ends their other
sessions.

WordPress already refuses the old logins once a password changes. But
the sessions behind them stay on record until they expire, and Loggedin
counts them. Under Block New, someone who just reset a forgotten
password could be refused by sessions that can no longer be used. This
setting clears them.

It covers:

- A password changed on the profile or user-edit screen, or through
  `wp_update_user()`.
- A password reset through **Lost your password?**
- Any direct call to `wp_set_password()`.

A user who changes their own password stays signed in on the device they
did it from. Every other session ends. When an administrator changes
someone else's password, all of that user's sessions end.

After the sessions end,
[`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions)
fires, then
[`loggedin_password_signout`](/loggedin/developer-docs#loggedin-password-signout).

## Related

- [Force Logout](/loggedin/force-logout) — sign out a user, or every
  user, from the Sessions page.
- [Lockout & recovery](/loggedin/lockout-recovery) — let blocked users
  sign out their own devices by email.
- [Active Sessions](/loggedin/addons/active-sessions) — every signed-in
  user and every device, in one list.
