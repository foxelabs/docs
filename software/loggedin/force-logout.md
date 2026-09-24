---
description: "Sign out every active session of a WordPress user, or every user on the site, from the Loggedin Force Logout panel."
title: Force Logout
---

# Force Logout

The **Force Logout** panel sits at the bottom of the
[Settings tab](/loggedin/general-settings) — **Users → Loggedin → Settings**.
It lets an administrator immediately terminate every active WordPress
session belonging to a specific user. Use it when someone is locked out by
the concurrent-session limit and can't reach their other devices to log
them out, or when you want to revoke access to an account that's been left
signed in somewhere you can't reach.

[[toc]]

## How it works

When you submit the form, Loggedin:

1. Resolves the identifier you typed to a real `WP_User` (see [accepted
   identifiers](#user) below).
2. Calls `WP_Session_Tokens::get_instance( $user_id )->destroy_all()`, which
   removes every active session token for that user.
3. Fires the [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin-destroy-all-sessions)
   action so add-ons or custom code can react.

The next time any of that user's devices makes an authenticated request,
WordPress will see no matching session token and bounce them back to
wp-login. There's no delay or cache — Force Logout takes effect
immediately.

## User

**Input:** Text field

A single identifier. The same field accepts three forms; the resolver
inspects the value and looks it up appropriately:

| Input looks like | Looked up as |
| --- | --- |
| Digits only (e.g. `42`) | User ID |
| Contains an `@` (e.g. `user@example.com`) | Email address |
| Anything else (e.g. `jdoe`) | `user_login` |

If no user matches the identifier, the form shows a not-found notice and
no sessions are destroyed.

## Force Logout button

Submitting the form fires the action immediately — there is no confirmation
dialog, so double-check the identifier before clicking. Unlike the General
Settings controls, this button is **not** gated by the Save Changes button:
it has its own REST endpoint
([`POST /loggedin/v1/sessions/destroy`](/loggedin/developer-docs#post-loggedin-v1-sessions-destroy))
and fires the moment you click.

While the request is in flight the button shows a busy state and is
disabled. A success snackbar appears in the lower-left corner once the
sessions are cleared, naming the user that was logged out.

::: tip Same thing from the command line
`wp loggedin sessions destroy <user>` does exactly this, and
`--token=<hash>` narrows it to a single device rather than all of them.
See the [WP-CLI reference](/loggedin/wp-cli#wp-loggedin-sessions-destroy).
:::

::: info Effect on the user
The user being force-logged-out isn't notified. The next page they try to
load (or the next REST / AJAX request from an already-open tab) will
redirect them to wp-login as an unauthenticated visitor. The
[Real-time Logout](/loggedin/addons/realtime-logout) add-on makes that
redirect feel instant by polling the server every few seconds; without it,
the redirect happens whenever the browser next makes a request.
:::

::: warning Permissions
Force Logout requires the `manage_options` capability — the same capability
needed to view the Loggedin settings screen in the first place. There is no
per-role override.
:::

## Logout All Users

Below the per-user form sits **Logout All Users** — a single button that
signs out every account on the site. Reach for it after a password-reset
campaign, a suspected credential leak, a change to your session policy,
or any other moment where you want a clean slate.

Clicking the button opens a confirmation dialog; nothing happens until
you confirm. On confirmation the button calls
[`POST /loggedin/v1/sessions/destroy-all`](/loggedin/developer-docs#post-loggedin-v1-sessions-destroy-all)
and a snackbar confirms the logout once the request completes.

### How it works

Unlike the per-user Force Logout, this doesn't loop through users
destroying sessions one account at a time — an approach that times out
on large sites. Instead, Loggedin stores a single site-wide timestamp,
the **logout epoch**. From then on, any session created *before* that
moment is rejected the next time its owner makes a request: the session
token is destroyed, the auth cookies are cleared, and the visitor is
treated as logged out on that very request — there's no "one last page
view".

Consequences of that design:

* **Instant at any scale.** Triggering the logout is one database
  write, whether the site has ten users or a million.
* **Your session survives.** The admin who clicks the button is
  exempted — your own session is re-stamped as the epoch is set, so
  you stay in wp-admin. Every other session, including other
  administrators', is logged out.
* **Any storage backend.** Everything goes through the standard
  `WP_Session_Tokens` API, so Redis / Memcached session storage works
  the same as stock WordPress.
* **Different hooks fire.** Because there's no per-user loop,
  `loggedin_destroy_all_sessions` does not fire. Add-ons get
  [`loggedin_logout_all_users`](/loggedin/developer-docs#loggedin-logout-all-users)
  once at trigger time, and
  [`loggedin_session_invalidated`](/loggedin/developer-docs#loggedin-session-invalidated)
  for each stale session as it's rejected.

::: tip Same thing from the command line
`wp loggedin sessions destroy-all --yes` — with one difference: the CLI
has no session of its own, so nobody is exempted. See the
[WP-CLI reference](/loggedin/wp-cli#wp-loggedin-sessions-destroy-all).
:::
