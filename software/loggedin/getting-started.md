---
description: "Install Loggedin and limit how many simultaneous login sessions each WordPress user can have."
title: Getting Started
---

# Getting Started

**Loggedin** is a session manager for WordPress. It gives you control over the
login sessions your users hold — how many they can have, how long they last,
and how to end them.

Its core job is capping the number of simultaneous WordPress sessions a single
user account is allowed to hold. When a new login would exceed the cap,
Loggedin either reshuffles the existing sessions to make room or rejects the
login outright — your choice. It's the tool of choice when an account is being
shared more than it should be, or when compliance requires that a user only
be signed in on one device at a time.

Beyond the limit, the plugin can sign out idle sessions and cap how long
a login lasts ([Auto Logout](/loggedin/auto-logout)), force-logout any
user's sessions from the admin, show session counts on the Users screen
and each user's own devices on their profile
([User Sessions](/loggedin/user-sessions)), and inspect or end
individual sessions from [WP-CLI](/loggedin/wp-cli). The
[Active Sessions](/loggedin/addons/active-sessions) add-on extends that
into a live view of everyone signed in across the site.

Once the core plugin is active you'll find its settings under
**Users → Loggedin**, a screen with a sidebar of pages:

| Group | Page | What it does |
| --- | --- | --- |
| **Settings** | **Login limits** | The concurrent-session limit and the rule applied when it's reached. |
| | **Lockout & recovery** | Leave administrators out of the limit, set the blocked-login message, let blocked users sign out their other devices, and tell signed-out devices why. |
| | **Auto logout** | Idle logout, session length, and sign-out on password change. |
| **Manage** | **Sessions** | Sign one user, or every user, out of every device. |
| **More** | **Add-ons** | The catalog of first-party add-ons: get them, activate licenses, and refresh the list. |
| | **Help** | Documentation and support links, and the versions running on your site. |

See [Login Limits](/loggedin/general-settings#the-settings-screen) for how
the screen works.

Loggedin 3.4.0 needs WordPress 6.5 or later and PHP 7.4 or later.

A WordPress REST namespace (`/loggedin/v1/…`) mirrors the UI so the same
settings, force-logout, and addon-licensing operations are available from a
terminal, a deployment script, or a third-party integration.

## How the limit is enforced

Every WordPress login passes through two filters Loggedin attaches to the
standard auth pipeline:

1. **`wp_authenticate_user`** — runs early. In **Block New** mode, this is
   where the login is rejected with an error on the wp-login screen if the
   user is already at the cap and typed the right password.
2. **`check_password`** — runs after WordPress has identified the user and
   verified the password. In **Logout All** or **Logout Oldest** mode, this
   is where Loggedin destroys existing sessions to make room for the new one.

A third point, **`attach_session_information`**, runs as any new session
is created. It covers logins that skip the login form, such as social
login and magic links, under Logout All and Logout Oldest. See
[Compatibility](/loggedin/compatibility).

The verdict on whether the user is "at the cap" passes through the
[`loggedin_reached_limit`](/loggedin/developer-docs#loggedin-reached-limit)
filter, which is what the [Limit Per User](/loggedin/addons/limit-per-user)
and [Limit Per Role](/loggedin/addons/limit-per-role) add-ons hook into to
override the global cap on a per-user or per-role basis.

A separate filter, [`loggedin_bypass`](/loggedin/developer-docs#loggedin-bypass),
lets you exempt specific users or roles from the check entirely.
Administrators are exempt by default on new installs: see
[Don't limit administrators](/loggedin/lockout-recovery#administrators).

## What's next

- [Login Limits](/loggedin/general-settings) — the settings screen, the
  concurrent-session limit and the three login-logic modes
  (**Logout Oldest**, **Logout All**, **Block New**).
- [Lockout & Recovery](/loggedin/lockout-recovery) — administrators, the
  blocked-login message, self-unlock by email, and the notice for
  devices signed out by a newer login.
- [Auto Logout](/loggedin/auto-logout) — idle logout and session length.
- [Force Logout](/loggedin/force-logout) — the **Sessions** page, for
  clearing every active session for a user, or for every user on the
  site at once.
- [User Sessions](/loggedin/user-sessions) — the Users screen columns,
  "Your sessions" on the profile, and sign-out on password change.
- [Compatibility](/loggedin/compatibility) — social login, magic links
  and other logins that skip the login form.
- [WP-CLI](/loggedin/wp-cli) — manage sessions and settings from the
  command line.
- [Add-ons](/loggedin/addons/) — first-party extensions (Active Sessions,
  Real-time Logout, Limit Per User, Limit Per Role) and how to install /
  license them.
- [Developer Docs](/loggedin/developer-docs) — every PHP hook, JS slot, and
  REST endpoint Loggedin exposes.
