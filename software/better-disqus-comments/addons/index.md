---
title: Add-ons
description: Premium add-ons for Better Disqus Comments — WooCommerce, EDD, widgets, button styles and scroll loading — and how to install and license them.
---

# Add-ons

Better Disqus Comments keeps the free plugin focused on showing Disqus fast.
Everything else comes as **add-ons**: small plugins that each do one thing and
plug into the free plugin's settings page.

[[toc]]

## Available add-ons

| Add-on | What it does | Where its settings are |
| --- | --- | --- |
| **[Advanced Buttons](/better-disqus-comments/addons/advanced-buttons)** | Six ready-made styles for the **Load Comments** button, and the Disqus comment count on it. | **General** page, **Load comments button** card |
| **[Scroll Load](/better-disqus-comments/addons/scroll-load)** | Start loading Disqus on the visitor's first scroll, so comments are ready when they get there. | **General** page, **Comment loading** card |
| **[Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments)** | Disqus on product pages — in a new tab, below the description or instead of reviews. | **Display** page, **WooCommerce** card |
| **[Comments for EDD](/better-disqus-comments/addons/edd-comments)** | Disqus on Easy Digital Downloads product pages. | No settings |
| **[Comments Widget](/better-disqus-comments/addons/comments-widget)** | The Disqus thread in a sidebar or footer widget. | Widgets screen |
| **[Latest Comments Widget](/better-disqus-comments/addons/latest-comments)** | Your latest Disqus comments in a widget, with avatars and excerpts. | Widgets screen |

Each add-on is sold on its own at [dclwp.com](https://dclwp.com/). The
**[Pro Bundle](/better-disqus-comments/addons/premium-bundle)** includes all of
them — and every future add-on — under one license.

Add-ons need Better Disqus Comments **13.0** or later. Each one declares the
free plugin as a required plugin, so WordPress won't activate an add-on until
Better Disqus Comments is active.

## The Add-ons page

**Disqus → Add-ons**, under **More** in the sidebar, lists every add-on, with
the [Pro Bundle](/better-disqus-comments/addons/premium-bundle) at the top.
Click **Refresh list** to reload the list — it's cached for about a day, so
do this right after a purchase or when a new add-on comes out. Each add-on's
name links to its page on the website.

The plugin's row under **Plugins** has an **Add-ons** link to this page too.

Each card shows the add-on's status:

| Status | Meaning |
| --- | --- |
| **Active · Pro Bundle** | Installed and licensed through your Pro Bundle. |
| **Active · licensed** | Installed, with its own license active. |
| **Installed · activating license** | Installed, and your Pro Bundle will license it on an upcoming admin page load. |
| **Installed · no license** | Installed, but no license is active on this site. |
| **In your Pro Bundle** | Not installed yet, but your Pro Bundle covers it — just download it. |
| **Premium · not installed** | Not installed; available to buy. |

And at most one button:

| Button | Does |
| --- | --- |
| **Activate license** / **Manage license** | Opens the license window for an installed add-on. |
| **Download** | Opens your Freemius account to download an add-on your Pro Bundle covers. |
| **Get add-on** | Opens the add-on's checkout. |
| No button | Nothing to do — the add-on is licensed through your Pro Bundle, which handles the license. |

## Installing an add-on {#installing-an-addon}

Add-ons are sold through [Freemius](https://freemius.com/), our reseller. Your
purchase, downloads and license keys are in your Freemius account, not on
dclwp.com.

After buying, Freemius emails your license key and a link to your account.
To download the add-on:

1. Log in to the
   [Freemius customer portal](https://customers.freemius.com/store/20281/downloads)
   with the email you used at checkout.
2. Download the add-on's ZIP file.

Then install it like any plugin:

1. Go to **Plugins → Add New Plugin → Upload Plugin**.
2. Choose the ZIP file and click **Install Now**.
3. Click **Activate Plugin**.

The add-on works as soon as it's active. Activate its license to get
automatic updates.

## Activating a license

1. Open **Disqus → Add-ons**.
2. On the add-on's card, click **Activate license**.
3. Paste your key into **License key** and click **Activate license**.

The status changes to **Active · licensed**. If the key is rejected — a
typo, an expired license, or no sites left on it — the window stays open with
the reason. Fix it and try again.

Bought the **Pro Bundle**? Activate it once from the Pro Bundle card at the
top instead — see
[Pro Bundle](/better-disqus-comments/addons/premium-bundle#activating-the-bundle).

## Deactivating a license

To move a license to another site:

1. Click **Manage license** on the add-on's card.
2. Click **Deactivate license**.

The add-on keeps working on this site; it just stops getting updates, and the
license is free to use elsewhere. The key field is locked while a license is
active — deactivate the license to change it.

::: info What a license covers
A license gives you automatic updates and support for the add-on while it's
valid, on as many sites as your plan allows. Deactivate it on a site you no
longer use to free up the slot.
:::

## Updates

Licensed add-ons update like any other plugin, under **Dashboard → Updates**.

## Uninstalling

Deactivating an add-on removes its feature; the free plugin keeps working.
Add-on settings are kept, so reactivating it brings everything back, as it was.

## Troubleshooting

- **The add-on won't activate.** Install and activate Better Disqus Comments
  first.
- **The add-on is active but does nothing.** Update Better Disqus Comments to
  13.0 or later — add-ons stay idle on older versions.
- **The upload fails.** Your server's upload limit may be too low. Raise
  `upload_max_filesize` and `post_max_size`, or upload the add-on folder over
  FTP to `wp-content/plugins/`.
- **The license won't activate.** Check the key in the
  [Freemius customer portal](https://customers.freemius.com/store/20281) and
  that it has a site left. Then click **Refresh list** and try again.
- **The page says "No add-ons to show right now".** The list couldn't be
  loaded. Click **Refresh list**, or see every add-on on the website with
  **Visit dclwp.com**.

Still stuck? [Contact us](https://dclwp.com/contact/) with the add-on name and
any error message — paid customers get priority support.
