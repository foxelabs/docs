---
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

Beyond the limit, the plugin can force-logout any user's sessions from the
admin, and inspect or end individual sessions from
[WP-CLI](/loggedin/wp-cli). The [Active Sessions](/loggedin/addons/active-sessions)
add-on extends that into a live view of everyone signed in across the site.

Once the core plugin is active you'll find a single page in wp-admin under
**Users → Loggedin** with two tabs:

| Tab | What it does |
| --- | --- |
| **Settings** | The concurrent-session limit, the rule applied when the limit is reached, and the Force Logout panel. |
| **Add-ons** | The catalog of first-party add-ons — install, activate licenses, and refresh the catalog. |

A WordPress REST namespace (`/loggedin/v1/…`) mirrors the UI so the same
settings, force-logout, and addon-licensing operations are available from a
terminal, a deployment script, or a third-party integration.

## How the limit is enforced

Every WordPress login passes through two filters Loggedin attaches to the
standard auth pipeline:

1. **`wp_authenticate_user`** — runs early. In **Block New** mode, this is
   where the login is rejected with an error on the wp-login screen if the
   user is already at the cap.
2. **`check_password`** — runs after WordPress has identified the user and
   verified the password. In **Logout All** or **Logout Oldest** mode, this
   is where Loggedin destroys existing sessions to make room for the new one.

The verdict on whether the user is "at the cap" passes through the
[`loggedin_reached_limit`](/loggedin/developer-docs#loggedin_reached_limit)
filter, which is what the [Limit Per User](/loggedin/addons/limit-per-user)
and [Limit Per Role](/loggedin/addons/limit-per-role) add-ons hook into to
override the global cap on a per-user or per-role basis.

A separate filter, [`loggedin_bypass`](/loggedin/developer-docs#loggedin_bypass),
lets you exempt specific users or roles from the check entirely.

## What's next

- [General Settings](/loggedin/general-settings) — the concurrent-session
  limit and the three login-logic modes (**Logout Oldest**, **Logout All**,
  **Block New**).
- [Force Logout](/loggedin/force-logout) — the admin-facing panel for
  clearing every active session for a user.
- [WP-CLI](/loggedin/wp-cli) — manage sessions and settings from the
  command line.
- [Add-ons](/loggedin/addons/) — first-party extensions (Active Sessions,
  Real-time Logout, Limit Per User, Limit Per Role) and how to install /
  license them.
- [Developer Docs](/loggedin/developer-docs) — every PHP hook, JS slot, and
  REST endpoint Loggedin exposes.
