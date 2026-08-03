---
title: Add-ons
---

# Add-ons

Loggedin keeps the core plugin lean and ships extra capabilities as separate,
opt-in add-ons. Each one is a small standalone plugin that depends on the
free core — when active, an add-on's options appear right alongside the
core's on the Loggedin settings tab (or, in the Limit Per User case, on the
profile screen) instead of in a separate admin page.

[[toc]]

## The Add-ons tab

In **wp-admin → Users → Loggedin → Add-ons** you'll find the catalog of
first-party add-ons. Each card shows what the add-on does and a button to
either buy it (if you haven't yet), manage its license (premium add-ons),
or open its marketing page (anything not currently installed). Add-ons
require the core Loggedin plugin to be active — each add-on declares
`Requires Plugins: loggedin` and WordPress will refuse to activate them
otherwise.

The catalog itself is fetched from the licensing backend and cached for
roughly a day. The **Refresh Addons** button in the top-right of the tab
re-pulls the catalog immediately — useful right after a purchase or when a
new add-on has just been released.

## Available add-ons

| Add-on | What it does | Where it lives |
| --- | --- | --- |
| **[Active Sessions](/loggedin/addons/active-sessions)** | List every user with a live session, drill into per-device detail, and sign out single sessions or every session for a user. | Sessions tab |
| **[Real-time Logout](/loggedin/addons/realtime-logout)** | Polls the server every few seconds so a session that ends on one device immediately reloads any open tabs to wp-login. | Settings tab |
| **[Limit Per User](/loggedin/addons/limit-per-user)** | Override the global session cap for a single user account from the user's profile page. | Profile screen |
| **[Limit Per Role](/loggedin/addons/limit-per-role)** | Override the global session cap per WordPress role (admin/editor/subscriber/custom). | Settings tab |

## Installing an add-on

Premium add-ons require a license. After purchase you'll receive an email
with login credentials for `foxelabs.com` and your unique license key. Sign
in at foxelabs.com, open the **My Downloads** section of your account, and
download the add-on's ZIP file.

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

Open **Users → Loggedin → Add-ons**. Each installed add-on appears as a
card with its current state in the header:

| Badge / button | Meaning |
| --- | --- |
| **Active** pill | The add-on plugin is installed and active on this site. |
| **Free** / **Premium** | The add-on's pricing tier. |
| **Licensed** | A license key is currently activated for this add-on. |
| **Unlicensed** | The add-on is installed but no license key has been activated. |
| **Manage license** | Opens the license modal for an installed add-on. |
| **Activate license** | Same modal, shown when no key has been activated yet. |
| **Get it** / **Buy Now** | The add-on isn't installed locally — the button links out to the purchase page. |

For an unlicensed premium card:

1. Click **Activate license**. A modal opens.
2. Paste your license key into the **License Key** field.
3. Click **Activate**.

The button shows **Activating…** while the request is in flight. On success
the modal closes, the card's badge flips to **Licensed**, and a
confirmation snackbar appears in the lower-left corner. If the key is
rejected (mistyped, already at its activation cap, expired, etc.), the
modal stays open with an inline error message — fix the key and click
**Activate** again.

## Deactivating a license

If you need to move the license to another site, sell or hand off the
site, or just clear an old key:

1. Click **Manage license** on the licensed add-on's card.
2. Click **Deactivate**.

The button shows **Deactivating…** while the request is in flight. The
license key field is read-only while a license is active — deactivate
first if you want to change the key.

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
([`loggedin_reached_limit`](/loggedin/developer-docs#loggedin_reached_limit))
at different priorities:

| Source | Priority |
| --- | --- |
| Limit Per Role | `10` |
| Limit Per User | `11` |

Per-user > per-role > global. A user with a per-user override always uses
that cap regardless of any role-level limit configured for them.

## Uninstalling

Deactivating an add-on stops its behaviour and removes its panel from the
settings UI; the core plugin keeps working. Each add-on registers its own
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
