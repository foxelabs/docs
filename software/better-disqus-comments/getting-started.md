---
title: Getting Started
description: Install Better Disqus Comments, connect your Disqus site and pick how comments load.
---

# Getting Started

**Better Disqus Comments** puts [Disqus](https://disqus.com/) comments on your
WordPress site without slowing your pages down. Disqus is heavy — its embed
pulls in several hundred kilobytes of scripts, fonts and iframes on every page
view. This plugin holds all of that back until a visitor actually gets to the
comments, or clicks a button to open them.

It works on its own. You don't need the official *Disqus Comment System*
plugin: enter your Disqus shortname and comments show up. Everything else is
optional:

- **Lazy loading** — Disqus loads when the comments come into view, when the
  visitor clicks a button, or straight away. Mobile visitors can get a
  different method.
- **Comment counts** — "12 Comments" links on your archives show the Disqus
  count.
- **Comment sync** — Disqus comments are copied into your WordPress database
  as they are posted, and older ones can be pulled in or sent the other way.
- **SEO mode** — search engines get your comments as plain WordPress comments
  they can index, while people get Disqus.
- **Add-ons** — Disqus on WooCommerce and Easy Digital Downloads pages, comment
  widgets, button styles and more.

::: info Formerly Disqus Conditional Load
The plugin was called **Disqus Conditional Load** until version 13. The slug
(`disqus-conditional-load`), settings and shortcodes are unchanged, and most
hooks are kept, so existing sites keep working. A few old developer hooks
were removed; the [Changelog](/better-disqus-comments/changelog) lists them.
Coming from the official Disqus plugin or DCL Pro? See
[Upgrading](/better-disqus-comments/upgrading).
:::

[[toc]]

## Requirements

- WordPress **6.6** or later
- PHP **7.4** or later
- A Disqus site. [Create one on Disqus](https://disqus.com/admin/create/) if
  you don't have it yet — it's free.

## Install

1. In your WordPress admin, go to **Plugins → Add New Plugin**.
2. Search for **Better Disqus Comments**.
3. Click **Install Now**, then **Activate**.

Or download the ZIP from
[WordPress.org](https://wordpress.org/plugins/disqus-conditional-load/) and
upload it under **Plugins → Add New Plugin → Upload Plugin**.

If the official *Disqus Comment System* plugin is active, see
[Upgrading from the official Disqus plugin](/better-disqus-comments/upgrading#from-the-official-disqus-plugin)
before you deactivate it — your settings are copied over automatically, but
only while its data is still there.

## Connect your Disqus site

Until a shortname is saved, nothing is shown to visitors and the WordPress
admin shows a reminder:

> Better Disqus Comments is almost ready. Enter your Disqus shortname to start
> showing comments.

1. Open **Disqus** in the WordPress admin menu (just below **Comments**). The
   **General** page opens. Until a shortname is saved, it says *"Comments are
   off until you add your Disqus shortname"* and the sidebar marks it
   **Needs fixing**.
2. Under **Disqus site**, enter your **Shortname** — the *example* in
   `example.disqus.com`. Pasting the full address works too.
3. Click **Save** at the top of the page.

That's it — open any post with comments enabled and scroll down. See
[Disqus Account](/better-disqus-comments/disqus-account) for finding your
shortname and what the other keys are for.

## The settings screen

Everything lives under **Disqus** in the admin menu. A sidebar lists the
pages in three groups:

| Group | Page | What it has |
| --- | --- | --- |
| Settings | **General** | **Disqus site** (your shortname) and **Comment loading**, plus **Load comments button** while the click method is in use. |
| | **Display** | **Comment counts**, and **Comment section**: excluded post types and the width of the thread. |
| | **Comment sync** | **Disqus API** (the API keys), then **Sync status** once the keys are saved. |
| | **Advanced** | **Compatibility** switches for caching and optimisation plugins. |
| Manage | **Import & export** | Import past Disqus comments, and export WordPress comments to Disqus. |
| More | **Add-ons** | The add-ons and the [Pro Bundle](/better-disqus-comments/addons/premium-bundle): buy, download and activate licenses. |
| | **Help** | Links to these docs, the support forum and priority support, and your plugin, WordPress and PHP versions to copy into a support request. |

Add-ons add their settings to these pages too; each add-on's guide says
where.

Each page has its own address, so a reload or a bookmark opens the same
page.

### Saving

**Save** sits in the header at the top of each settings page. It does
nothing until you change something. Then the header counts your
changes — *"2 unsaved changes"* — and **Discard** appears to undo them.

Changes on different pages are kept together, and one **Save** saves them
all. A message at the bottom of the screen confirms it: *"Settings saved."*
If you try to leave with unsaved changes, the browser asks first.

If saving fails, a notice says *"The settings could not be saved"* and why.
Your changes are kept; click **Try again**.

The screen needs the `manage_options` capability by default (administrators).
Developers can change that with the
[`DCL_ACCESS`](/better-disqus-comments/developer-docs#capability) constant.

## Where Disqus shows

Disqus replaces your theme's comments area — the classic comments template or
the **Comments** block in block themes — on posts where all of these are true:

- It is a single post, page or custom post type view (not an archive).
- Comments are open on that post.
- The post is published (not a draft, scheduled, pending or trashed).
- Its post type isn't in **Exclude post types** on the
  [Display](/better-disqus-comments/display#exclude-post-types) page.
- The visitor isn't a search engine bot — bots get
  [SEO mode](/better-disqus-comments/seo-mode) instead.

WooCommerce products are left alone so product reviews keep working. The
[Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments)
add-on puts Disqus on product pages.

To place the thread somewhere else in your content, use the `[dcl-comments]`
[shortcode](/better-disqus-comments/developer-docs#shortcodes).

## The toolbar menu

Users who can moderate comments get a **Disqus** menu in the WordPress
toolbar, on the front end and in the admin:

| Item | Opens |
| --- | --- |
| **Moderate** | Your Disqus moderation queue |
| **Analytics** | Disqus comment analytics |
| **Disqus Settings** | Your site's settings on disqus.com |
| **Configure Plugin** | This plugin's settings page |

The first three appear once a shortname is saved and open in a new tab. The
core **Comments** menu is left in place.

## What's next

- [Comment Loading](/better-disqus-comments/comment-loading) — pick when
  Disqus loads, on desktop and on mobile.
- [Display](/better-disqus-comments/display) — comment counts, excluded post
  types and the width of the thread.
- [Comment Sync](/better-disqus-comments/comment-sync) — keep a copy of your
  Disqus comments in WordPress.
- [SEO Mode](/better-disqus-comments/seo-mode) — let search engines index
  your comments.
- [Add-ons](/better-disqus-comments/addons/) — WooCommerce, EDD, widgets and
  more.
- [Developer Docs](/better-disqus-comments/developer-docs) — hooks,
  shortcodes and REST endpoints.
