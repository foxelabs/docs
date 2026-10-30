---
description: "How Loggedin limits logins that skip the WordPress login form, such as social login, magic links and popup logins, and what each mode can and can't enforce."
title: Compatibility
---

# Compatibility

Most logins go through the WordPress login form, or through a form that
works the same way. Some don't: social login, magic links and popup
logins often sign the user in directly. This page explains what Loggedin
enforces for those logins, and lists plugins worth knowing about.

[[toc]]

## Logins that skip the login form

WordPress signs a user in by creating a session and setting the auth
cookie. A normal login does that through `wp_signon()`, which first
checks the username and password. Before 3.4.0, that check is where
Loggedin did all its work: **Block New** refused the login on
`wp_authenticate_user`, and **Logout Oldest** and **Logout All** made
room on `check_password`.

A plugin that signs users in another way, by calling
`wp_set_auth_cookie()` itself once a social provider, an emailed link or
its own form has confirmed who they are, skips both checks. Before
3.4.0, those logins weren't limited at all.

Since 3.4.0:

- **Block New** still refuses the login on `wp_authenticate_user`, so it
  needs the login form.
- **Logout Oldest** and **Logout All** make room as each new session is
  created (the `attach_session_information` filter), and no longer on
  `check_password`. Every login that creates a WordPress session passes
  through it, however it started.

## What each mode enforces

| | Through the login form | Skipping the login form |
| --- | --- | --- |
| **Logout Oldest** | ✅ Limited | ✅ Limited |
| **Logout All** | ✅ Limited | ✅ Limited |
| **Block New** | ✅ Limited | ❌ Not limited |

**Logout Oldest and Logout All** work the same either way. When the new
session would go over the limit, Loggedin ends the oldest session, or
every other session, before the new one is stored. The device signed out
is [told why](/loggedin/lockout-recovery#signed-out-by-a-newer-login),
just as it would be after a normal login.

**Block New can't refuse these logins.** By the time the session is
being created, the plugin has already decided the user is signed in, and
there is no login form to show an error on. The session is created and
the user goes over the limit. If your site relies on a social or
magic-link login, use Logout Oldest or Logout All.

Other features and how they behave:

| Feature | Logins that skip the login form |
| --- | --- |
| [Don't limit administrators](/loggedin/lockout-recovery#administrators) and the `loggedin_bypass` filter | ✅ Apply |
| Limit Per Role and Limit Per User | ✅ Apply (they change the limit, not the check) |
| [Signed out by a newer login](/loggedin/lockout-recovery#signed-out-by-a-newer-login) | ✅ Applies |
| [Self-unlock by email](/loggedin/lockout-recovery#let-blocked-users-sign-out-their-other-devices) | ➖ Not offered: it's part of the Block New error on the login form |
| [Idle logout](/loggedin/auto-logout#idle-logout) | ✅ Applies to every session, however it was created |
| [Session length](/loggedin/auto-logout#session-length) | ✅ Applies when the plugin sets the cookie with `wp_set_auth_cookie()` and doesn't set its own length |
| [Last login column](/loggedin/user-sessions#last-login-column) | ⚠️ Recorded only if the plugin fires WordPress's `wp_login` action |

::: info Requests that never create a session
Application passwords and other cookie-less API requests don't create a
WordPress session, so they never count towards the limit. Since 3.4.0
they don't end other sessions either, and nor does any other password
check that isn't a login, such as a "current password" field.
:::

## Plugins to note

These plugins come up in support requests. None of them has been tested
with Loggedin 3.4.0 yet. The table says what to expect from how they
sign users in; if you run one, try the check below before relying on it.

| Plugin | How it signs users in | Logout Oldest / Logout All | Block New |
| --- | --- | --- | --- |
| **Nextend Social Login** | After the social provider confirms the user, without the login form. | Expected to work; not yet tested. | Not enforced. |
| **Magic-link plugins** (passwordless login by email) | From a link in an email, without the login form. | Expected to work; not yet tested. | Not enforced. |
| **WooCommerce** (My Account login) | Its own login form on the My Account page. | Expected to work; not yet tested. | Expected to work if the form signs in through `wp_signon()`; not yet tested. |
| **Ultimate Member** | Its own login form and pages. | Expected to work; not yet tested. | Expected to work if the form signs in through `wp_signon()`; not yet tested. |
| **MemberPress** | Its own login form and pages. | Expected to work; not yet tested. | Expected to work if the form signs in through `wp_signon()`; not yet tested. |

Popup or modal login plugins fall into one group or the other: those that
post to `wp_signon()` behave like the login form, and those that set the
cookie themselves behave like social login.

::: tip Tested a plugin?
If you've checked one of these, or another login plugin, with Loggedin,
[let us know](https://foxelabs.com/contact/) what you found and we'll
update this page.
:::

## Check a login plugin yourself

It takes two browsers and a couple of minutes:

1. On **Login limits**, set **Maximum active sessions** to `1` and choose
   **Logout All**. Save.
2. Use a test account that isn't an administrator, or turn off
   **Don't limit administrators** on **Lockout & recovery** for the
   test.
3. In browser A, sign in through the plugin.
4. In browser B, sign in the same way.
5. Reload a page in browser A. It should be signed out, and the login
   screen should say the account signed in on another device.

To check Block New, choose it in step 1 and repeat. If browser B is
still let in, that plugin skips the login form, and Block New can't
limit it.

On **Users → All Users**, the
[Sessions column](/loggedin/user-sessions#sessions-column) shows how many
sessions the test account holds at each step.

## Related

- [Login Limits](/loggedin/general-settings#login-logic) — the three
  modes.
- [Lockout & recovery](/loggedin/lockout-recovery) — what a blocked or
  signed-out user sees.
- [`loggedin_bypass`](/loggedin/developer-docs#loggedin-bypass) — leave
  specific users out of the limit.
