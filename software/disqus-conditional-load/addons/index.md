---
title: Addons
description: Premium addons for Better Disqus Comments — WooCommerce, EDD, widgets, button styles and scroll loading — and how to install and license them.
---

# Addons

Better Disqus Comments keeps the free plugin focused on showing Disqus fast.
Everything else comes as **addons**: small plugins that each do one thing and
plug into the free plugin's settings page.

[[toc]]

## Available addons

| Addon | What it does | Where its settings are |
| --- | --- | --- |
| **[Advanced Buttons](/disqus-conditional-load/addons/advanced-buttons)** | Six ready-made styles for the **Load Comments** button, and the Disqus comment count on it. | Comment loading panel |
| **[Scroll Load](/disqus-conditional-load/addons/scroll-load)** | Start loading Disqus on the visitor's first scroll, so comments are ready when they get there. | Comment loading panel |
| **[Comments for WooCommerce](/disqus-conditional-load/addons/woocommerce-comments)** | Disqus on product pages — in a new tab, below the description or instead of reviews. | WooCommerce panel |
| **[Comments for EDD](/disqus-conditional-load/addons/edd-comments)** | Disqus on Easy Digital Downloads product pages. | No settings |
| **[Comments Widget](/disqus-conditional-load/addons/comments-widget)** | The Disqus thread in a sidebar or footer widget. | Widgets screen |
| **[Latest Comments Widget](/disqus-conditional-load/addons/latest-comments)** | Your latest Disqus comments in a widget, with avatars and excerpts. | Widgets screen |

Each addon is sold on its own:

| Sites | Yearly | Lifetime |
| --- | --- | --- |
| 1 | $14.99 | $59.99 |
| 3 | $29.99 | $89.99 |
| 15 | $89.99 | $269.99 |

The **[Pro Bundle](/disqus-conditional-load/addons/pro-bundle)** includes all
of them — and every future addon — from **$34.99 a year**. See
[dclwp.com/pricing](https://dclwp.com/pricing/) for current prices.

Addons need Better Disqus Comments **13.0** or later. Each one declares the
free plugin as a required plugin, so WordPress won't activate an addon until
Better Disqus Comments is active.

## The Addons tab

**Disqus → Addons** lists every addon, with the
[Pro Bundle](/disqus-conditional-load/addons/pro-bundle) at the top. Click
**Refresh Addons** to reload the list — it's cached for about a day, so do
this right after a purchase or when a new addon comes out.

Each card shows the addon's state:

| Badge | Meaning |
| --- | --- |
| **Licensed via Pro Bundle** | Installed and licensed through your Pro Bundle. |
| **Active and licensed** | Installed, with its own license active. |
| **Pro Bundle activation pending** | Installed, and your Pro Bundle will license it on the next admin page load. |
| **Installed, license not active** | Installed, but no license is active on this site. |
| **Included in your Pro Bundle** | Not installed yet, but your Pro Bundle covers it — just download it. |
| **Premium addon** | Not installed; available to buy. |

And one button:

| Button | Does |
| --- | --- |
| **Activate license** / **Manage license** | Opens the license window for an installed addon. |
| **Download** | Opens your Freemius account to download an addon your Pro Bundle covers. |
| **Buy addon** | Opens the addon's checkout. |
| *Included in Pro Bundle* | Nothing to do — the bundle handles the license. |

**Details** opens the addon's product page.

## Installing an addon

Addons are sold through [Freemius](https://freemius.com/), our reseller. Your
purchase, downloads and license keys are in your Freemius account, not on
dclwp.com.

After buying, Freemius emails your license key and a link to your account.
To download the addon:

1. Log in to your [Freemius account](https://users.freemius.com/) with the
   email you used at checkout.
2. Download the addon's ZIP file.

Then install it like any plugin:

1. Go to **Plugins → Add New → Upload Plugin**.
2. Choose the ZIP file and click **Install Now**.
3. Click **Activate Plugin**.

The addon works as soon as it's active. Activate its license to get
automatic updates.

## Activating a license

1. Open **Disqus → Addons**.
2. On the addon's card, click **Activate license**.
3. Paste your key into **License Key** and click **Activate**.

The badge changes to **Active and licensed**. If the key is rejected — a
typo, an expired license, or no sites left on it — the window stays open with
the reason. Fix it and try again.

Bought the **Pro Bundle**? Activate it once from the bundle banner instead —
see [Pro Bundle](/disqus-conditional-load/addons/pro-bundle#activating-the-bundle).

## Deactivating a license

To move a license to another site:

1. Click **Manage license** on the addon's card.
2. Click **Deactivate**.

The addon keeps working on this site; it just stops getting updates, and the
license is free to use elsewhere. The key field is locked while a license is
active — deactivate first to change it.

::: info What a license covers
A license gives you automatic updates and support for the addon while it's
valid — a year, or for life on a lifetime plan — on as many sites as your
plan allows. Deactivate it on a site you no longer use to free up the slot.
:::

## Updates

Licensed addons update like any other plugin, under **Dashboard → Updates**.

## Uninstalling

Deactivating an addon removes its feature; the free plugin keeps working.
Addon settings are kept, so reactivating it brings everything back, as it was.

## Troubleshooting

- **The addon won't activate.** Install and activate Better Disqus Comments
  first.
- **The addon is active but does nothing.** Update Better Disqus Comments to
  13.0 or later — addons stay idle on older versions.
- **The upload fails.** Your server's upload limit may be too low. Raise
  `upload_max_filesize` and `post_max_size`, or upload the addon folder over
  FTP to `wp-content/plugins/`.
- **The license won't activate.** Check the key in your
  [Freemius account](https://users.freemius.com/) and that it has a site
  left. Then click **Refresh Addons** and try again.

Still stuck? [Contact us](https://dclwp.com/contact/) with the addon name and
any error message — paid customers get priority support.
