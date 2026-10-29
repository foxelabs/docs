---
description: "Optional Loggedin add-ons for active session management, real-time logout and per-user or per-role session limits."
title: Add-ons
---

# Add-ons

Loggedin keeps the core plugin lean and ships extra capabilities as separate,
opt-in add-ons. Each one is a small standalone plugin that depends on the
free core. When active, an add-on's settings appear on the Loggedin
screen itself, as a card on a core page or as a page in the sidebar (or,
for Limit Per User, on the profile screen), never in a separate admin
menu.

[[toc]]

## The Add-ons page

**Users → Loggedin → More › Add-ons** (`&tab=addons`) lists the
first-party add-ons. Each card shows what the add-on does, its state, and
a button to get it (anything not installed) or manage its license
(installed premium add-ons). Add-ons need the core Loggedin plugin to be
active: each add-on declares `Requires Plugins: loggedin`, and WordPress
refuses to activate them otherwise.

The list is fetched from the licensing backend and cached for roughly a
day. **Refresh list**, at the top of the page, fetches it again at once.
That's useful right after a purchase or when a new add-on has just been
released.

## Available add-ons

| Add-on | What it does | Where it lives |
| --- | --- | --- |
| **[Active Sessions](/loggedin/addons/active-sessions)** | List every user with a live session, drill into per-device detail, and sign out single sessions or every session for a user. | **Manage › Active sessions** page |
| **[Real-time Logout](/loggedin/addons/realtime-logout)** | Polls the server every few seconds so a session that ends on one device immediately reloads any open tabs to wp-login. | **Real-time logout** card on **Login limits** |
| **[Limit Per User](/loggedin/addons/limit-per-user)** | Override the global session cap for a single user account from the user's profile page. | Profile screen |
| **[Limit Per Role](/loggedin/addons/limit-per-role)** | Override the global session cap per WordPress role (admin/editor/subscriber/custom). | **Limits per role** card on **Login limits** |

::: tip Looking for Auto Logout?
Auto logout is free and built into Loggedin since 3.4.0. The paid add-on
is retired, and your settings carry over. See
[Auto Logout](/loggedin/auto-logout#moving-from-the-auto-logout-add-on).
:::

::: info Update your add-ons for Loggedin 3.4.0
Loggedin 3.4.0 rebuilt its settings screen. Add-ons made for the old
screen still work, but their settings can look out of place. If you run
Active Sessions older than 1.2.0, or Limit Per Role or Real-time Logout
older than 2.2.0, a notice on the Plugins screen and the Loggedin screen
lists them, with a link to **Dashboard → Updates**.
:::

## Installing an add-on

Premium add-ons require a license. Our add-ons are sold through
[Freemius](https://freemius.com/), our reseller, so your purchase, download
and license key all live in the Freemius customer portal rather than on
foxelabs.com.

After purchase you'll receive an email from Freemius with your license key
and a link to the
[customer portal](https://customers.freemius.com/store/21/). To download
the add-on:

1. Open the [customer portal](https://customers.freemius.com/store/21/) and
   log in with the email address you used at checkout. On your first login,
   use the credentials from the purchase email — you'll be asked to replace
   the auto-generated password. If you don't have a password, request a
   login link by email instead.
2. Open the **Downloads** section and download the add-on's ZIP file.
3. Your license key is shown in the **Licenses** section if you need it
   again later.

Then install it like any other WordPress plugin:

1. Go to **Plugins → Add New** in your WordPress dashboard.
2. Click **Upload Plugin**, choose the add-on `.zip`, and click
   **Install Now**.
3. Click **Activate Plugin**.

The add-on is now running. Premium add-ons will work but won't receive
automatic updates until a license is activated — see below.

::: tip Updates
Once licensed, add-ons follow the standard WordPress update flow — new
versions appear under **Dashboard → Updates**. Deactivating the license
stops the site from seeing future updates but does not disable the plugin
itself.
:::

## Activating a license

Open **Users → Loggedin → More › Add-ons**. Each card shows the add-on's
state at the bottom, with a button next to it:

| State | Button | Meaning |
| --- | --- | --- |
| **Active** | — | A free add-on, installed and active on this site. |
| **Active · licensed** | **Manage license** | A premium add-on, active, with a license activated. |
| **Installed · no license** | **Activate license** | A premium add-on, active, but no license key has been activated. |
| **Premium · not installed** / **Free · not installed** | **Get add-on** | The add-on isn't installed. The button opens its page. |

For a card showing **Installed · no license**:

1. Click **Activate license**. A dialog opens.
2. Paste your license key into the **License key** field.
3. Click **Activate license**.

The button shows a busy state while the request runs. On success the
dialog closes and the card changes to **Active · licensed**. If the key
is rejected (mistyped, already at its activation cap, expired, and so
on), the dialog stays open with **The license was not changed** and the
reason. Fix the key and click **Activate license** again.

::: tip Valid key rejected as invalid?
Loggedin 3.0.0 to 3.3.0 could shorten some valid keys before
sending them, so they were rejected as **Invalid license key**. Update
Loggedin to 3.3.1 or later, then activate the key again.
:::

## Deactivating a license

If you need to move the license to another site, sell or hand off the
site, or just clear an old key:

1. Click **Manage license** on the licensed add-on's card.
2. Click **Deactivate license**.

The button shows a busy state while the request runs. While a license is
active, the dialog doesn't show the key: deactivate first if you want to
use a different one.

Once deactivated, the add-on keeps working on this site (deactivation only
stops automatic updates) and the license key is freed up to be activated
elsewhere.

::: info Activation limits
Each license carries a configured site activation cap (typically 1, 3, or
unlimited depending on the bundle you purchased). Deactivating frees up a
slot immediately.
:::

## Priority order for limit overrides

When more than one Loggedin limit add-on is active they hook the same
filter
([`loggedin_reached_limit`](/loggedin/developer-docs#loggedin-reached-limit))
at different priorities:

| Source | Priority |
| --- | --- |
| Limit Per Role | `10` |
| Limit Per User | `11` |

Per-user > per-role > global. A user with a per-user override always uses
that cap regardless of any role-level limit configured for them.

## Uninstalling

Deactivating an add-on stops its behaviour and removes its card or page
from the Loggedin screen; the core plugin keeps working. Each add-on registers its own
uninstall hook, so deleting an add-on cleans up its stored option (or user
meta) and leaves nothing behind.

## Troubleshooting

If a ZIP upload fails or activation throws an error, the most common
causes are:

- **Loggedin isn't active.** Activate the core plugin first, then re-attempt
  the add-on activation.
- **Server upload limit too low.** WordPress shows a generic "Link expired"
  or 413 error when the upload exceeds `upload_max_filesize` or
  `post_max_size`. Increase those limits in your `php.ini` (or via your
  host's control panel) and retry.
- **Plugin conflict.** A small number of host-installed must-use plugins
  replace **Plugins → Add New** with a custom flow. If yours does, use that
  flow to install the ZIP.

Still stuck? [Contact support](https://foxelabs.com/contact/) with the
add-on name, the WordPress version, and any error message you saw —
include your license key in the message so the request is prioritised.
