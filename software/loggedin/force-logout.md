---
description: "Sign every session of a WordPress user, or of every user on the site, out from the Loggedin Sessions page."
title: Force Logout
---

# Force Logout

The **Sessions** page — **Users → Loggedin → Manage › Sessions**
(`&tab=sessions`) — signs users out. It has two cards:

- **Sign out a user** ends every session one user has.
- **Sign out all users** ends every session on the site.

Use the first when someone is locked out by the session limit and can't
reach their other devices, or when an account was left signed in
somewhere you can't reach. Use the second after a suspected leak or a
change to your session policy.

Both act the moment you confirm. Neither goes through the page header's
**Save**.

[[toc]]

::: tip Other places to sign users out
The **Users** screen has a **Sign out everywhere** row action and bulk
action, and each user can sign out their own devices from their profile.
See [User Sessions](/loggedin/user-sessions). Blocked users can also
[sign out their other devices by email](/loggedin/lockout-recovery#let-blocked-users-sign-out-their-other-devices).
:::

## Sign out a user

### How it works

When you click **Sign out everywhere**, Loggedin:

1. Finds the user you named (see [the User field](#user) below).
2. Calls `WP_Session_Tokens::get_instance( $user_id )->destroy_all()`,
   which removes every session token the user has.
3. Fires the [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions)
   action so add-ons or custom code can react.

The next time any of that user's devices makes a signed-in request,
WordPress finds no matching session token and sends it to the login
screen. There's no delay or cache: it takes effect at once.

### User

**Input:** Text field

One identifier: a user ID, an email address or a username. Loggedin works
out which one you typed:

| Input looks like | Looked up as |
| --- | --- |
| Digits only (e.g. `42`) | User ID |
| Contains an `@` (e.g. `user@example.com`) | Email address |
| Anything else (e.g. `jdoe`) | `user_login` |

If no user matches, an error snackbar says so and no sessions end.

### The Sign out everywhere button

The button sits at the bottom of the card. There is no confirmation
dialog, so check the identifier before you click. It calls its own REST
endpoint,
[`POST /loggedin/v1/sessions/destroy`](/loggedin/developer-docs#post-loggedin-v1-sessions-destroy).

While the request runs, the button shows a busy state. When it's done, a
snackbar names the user who was signed out, and the field is cleared.

::: tip Same thing from the command line
`wp loggedin sessions destroy <user>` does exactly this, and
`--token=<hash>` narrows it to a single device. See the
[WP-CLI reference](/loggedin/wp-cli#wp-loggedin-sessions-destroy).
:::

::: info Effect on the user
The user isn't notified. The next page they load, or the next REST or
AJAX request from a tab that's already open, sends them to the login
screen as a signed-out visitor. The
[Real-time Logout](/loggedin/addons/realtime-logout) add-on makes that
feel instant by checking with the server every few seconds; without it,
the redirect happens whenever the browser next makes a request.
:::

::: warning Permissions
The Sessions page needs the `manage_options` capability, the same as the
rest of the Loggedin screen. There is no per-role override.
:::

## Sign out all users {#logout-all-users}

The **Sign out all users** button signs out every account on the site.
Reach for it after a password-reset campaign, a suspected credential
leak, a change to your session policy, or any other moment you want a
clean slate.

Clicking the button opens a **Sign out all users?** dialog. Nothing
happens until you confirm. On confirmation it calls
[`POST /loggedin/v1/sessions/destroy-all`](/loggedin/developer-docs#post-loggedin-v1-sessions-destroy-all),
and a snackbar confirms: "Every user was signed out. You are still signed
in."

### How it works

This doesn't loop through users ending sessions one account at a time,
which times out on large sites. Instead, Loggedin stores a single
site-wide timestamp, the **logout epoch**. From then on, any session
created *before* that moment is rejected the next time its owner makes a
request: the session token is destroyed, the auth cookies are cleared,
and the visitor is treated as signed out on that very request. There's no
"one last page view".

What that means:

* **Instant at any scale.** Triggering the logout is one database write,
  whether the site has ten users or a million.
* **Your session survives.** Your own session is re-stamped as the epoch
  is set, so you stay in wp-admin. Every other session, including other
  administrators', is signed out.
* **Any storage backend.** Everything goes through the standard
  `WP_Session_Tokens` API, so Redis or Memcached session storage works
  the same as stock WordPress.
* **Different hooks fire.** Because there's no per-user loop,
  `loggedin_destroy_all_sessions` does not fire. Add-ons get
  [`loggedin_logout_all_users`](/loggedin/developer-docs#loggedin-logout-all-users)
  once at trigger time, and
  [`loggedin_session_invalidated`](/loggedin/developer-docs#loggedin-session-invalidated)
  for each stale session as it's rejected.

::: tip Same thing from the command line
`wp loggedin sessions destroy-all --yes`, with one difference: the CLI
has no session of its own, so nobody is exempted. See the
[WP-CLI reference](/loggedin/wp-cli#wp-loggedin-sessions-destroy-all).
:::

## Seeing who is signed in

The Sessions page signs users out but doesn't list sessions. For a count
per user, use the **Sessions** column on the
[Users screen](/loggedin/user-sessions#the-users-screen). To see each
device of every signed-in user and end them one at a time, use the
[Active Sessions](/loggedin/addons/active-sessions) add-on. Until it's
installed, a line on the **Sign out a user** card points to it.
