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
- **Addons** — Disqus on WooCommerce and Easy Digital Downloads pages, comment
  widgets, button styles and more.

::: info Formerly Disqus Conditional Load
The plugin was called **Disqus Conditional Load** until version 13. The slug
(`disqus-conditional-load`), settings and hooks are unchanged, so existing
sites and custom code keep working. Coming from the official Disqus plugin or
DCL Pro? See [Upgrading](/better-disqus-comments/upgrading).
:::

[[toc]]

## Requirements

- WordPress **6.5** or later
- PHP **7.4** or later
- A Disqus site. [Create one on Disqus](https://disqus.com/admin/create/) if
  you don't have it yet — it's free.

## Install

1. In your WordPress admin, go to **Plugins → Add New**.
2. Search for **Better Disqus Comments**.
3. Click **Install Now**, then **Activate**.

Or download the ZIP from
[WordPress.org](https://wordpress.org/plugins/disqus-conditional-load/) and
upload it under **Plugins → Add New → Upload Plugin**.

If the official *Disqus Comment System* plugin is active, see
[Upgrading from the official Disqus plugin](/better-disqus-comments/upgrading#from-the-official-disqus-plugin)
before you deactivate it — your settings are copied over automatically, but
only while its data is still there.

## Connect your Disqus site

Until a shortname is saved, nothing is shown to visitors and every admin
screen shows a reminder:

> Better Disqus Comments is almost ready. Enter your Disqus shortname to start
> showing comments.

1. Open **Disqus** in the WordPress admin menu (just below **Comments**).
2. In the **Disqus** panel, enter your **Shortname** — the *example* in
   `example.disqus.com`. Pasting the full address works too.
3. Click **Save Changes**.

That's it — open any post with comments enabled and scroll down. See
[Disqus Account](/better-disqus-comments/disqus-account) for finding your
shortname and what the other keys are for.

## The settings page

Everything lives on one page under **Disqus** in the admin menu, with three
tabs:

| Tab | What it has |
| --- | --- |
| **Settings** | Five panels — **Disqus**, **Comment loading**, **Display**, **Comment sync** and **Advanced** — plus panels added by addons. One **Save Changes** button at the bottom saves them all. |
| **Addons** | The addon catalogue and the [Pro Bundle](/better-disqus-comments/addons/pro-bundle): buy, download and activate licenses. |
| **Help** | Links to these docs, the support forum and priority support. |

The page needs the `manage_options` capability by default (administrators).
Developers can change that with the
[`DCL_ACCESS`](/better-disqus-comments/developer-docs#capability) constant.

## Where Disqus shows

Disqus replaces your theme's comments area — the classic comments template or
the **Comments** block in block themes — on posts where all of these are true:

- It is a single post, page or custom post type view (not an archive).
- Comments are open on that post.
- The post is published (not a draft, scheduled, pending or trashed).
- Its post type isn't in **Exclude post types** on the
  [Display](/better-disqus-comments/display#exclude-post-types) panel.
- The visitor isn't a search engine bot — bots get
  [SEO mode](/better-disqus-comments/seo-mode) instead.

WooCommerce products are left alone so product reviews keep working. The
[Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments)
addon puts Disqus on product pages.

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
- [Addons](/better-disqus-comments/addons/) — WooCommerce, EDD, widgets and
  more.
- [Developer Docs](/better-disqus-comments/developer-docs) — hooks,
  shortcodes and REST endpoints.
