---
description: "Full release history of Better Disqus Comments, formerly Disqus Conditional Load, including version notes for every addon."
title: Changelog
---

# Changelog

Full release history for **Better Disqus Comments**, formerly **Disqus
Conditional Load**. The plugin's bundled `readme.txt` keeps only the latest
releases; the complete history lives here. Addons have their own version
numbers, listed at the [bottom](#addons).

## 13.0.0

The plugin becomes a complete Disqus plugin of its own, under a new name.
See [Upgrading](/better-disqus-comments/upgrading) for what to do on your
site.

### Added

* **Works on its own.** The official *Disqus Comment System* plugin is no
  longer needed. Enter your [shortname](/better-disqus-comments/disqus-account#shortname)
  and comments show — the plugin builds the Disqus embed itself.
* **[Comment Sync](/better-disqus-comments/comment-sync)**, ported from the
  official plugin: Disqus pushes each new comment to your site as it's
  posted, and it's saved as a WordPress comment. It uses the same webhook
  address and signing token, so existing subscriptions keep working.
  API credentials are sent in the request body instead of the URL, so they
  don't end up in server logs.
* **[Sync past comments](/better-disqus-comments/comment-sync#sync-past-comments)**
  — pull in comments from a date range.
* **[Export comments to Disqus](/better-disqus-comments/comment-sync#export-comments-to-disqus)**
  — send your WordPress comments to Disqus. The upload runs on your server,
  so the access token never reaches the browser.
* **Toolbar menu** — Moderate, Analytics and Disqus Settings links, for users
  who can moderate comments.
* **[Print the script inline](/better-disqus-comments/advanced#print-the-script-inline)**
  for caching and minify plugins that break script loading.
* **[Addons](/better-disqus-comments/addons/)** tab with the
  [Pro Bundle](/better-disqus-comments/addons/pro-bundle): one license key
  for every addon.
* Settings from the official Disqus plugin — shortname, API keys, sync token,
  inline script — are copied over once on upgrade.
* A notice for sites that used Disqus Single Sign-On, which isn't supported.
* Addon extension points: the [`dcl_load_method_options`](/better-disqus-comments/developer-docs#dcl-load-method-options)
  filter, `window.dclEmbed` for [custom load methods](/better-disqus-comments/developer-docs#adding-a-load-method),
  and the [`dcl.settings.panels`](/better-disqus-comments/developer-docs#dcl-settings-panels)
  and [`dcl.settings.loading.fields`](/better-disqus-comments/developer-docs#dcl-settings-loading-fields)
  settings slots.

### Changed

* Renamed to **Better Disqus Comments**. The slug, text domain, settings and
  hooks are unchanged.
* The settings page is a top-level **Disqus** menu, just below **Comments**,
  with **Settings**, **Addons** and **Help** tabs and one **Save Changes**
  button.
* The [mobile loading method](/better-disqus-comments/comment-loading#on-mobile-devices),
  a DCL Pro feature before, is now free.
* DCL Pro is replaced by six addons, sold alone or in the Pro Bundle. See
  [Upgrading from DCL Pro 11.x](/better-disqus-comments/upgrading#from-dcl-pro-11-x).
* Button styles moved to the [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons)
  addon. Your stored style is kept and applies again once the addon is
  active.
* Loading methods from inactive addons fall back to **When comments come
  into view**, and come back when the addon is reactivated.

### Removed

* The dependency on the official Disqus plugin.
* Disqus Single Sign-On (SSO).

## 12.0.0

### Added

* Lazy loading works in block themes — the **Comments** block — not only
  classic themes.
* A React settings screen.

### Changed

* Rewritten codebase: namespaced, autoloaded, PHP 7.4+ and WordPress 6.5+.
* The official Disqus plugin became a required plugin instead of being
  bundled.
* One front-end script that loads only what's needed, instead of several
  files.
* Security hardening and escaping improvements throughout.

## 11.1.2

### Fixed

* Security fixes.

## 11.1.1

### Fixed

* Security fixes.

## 11.1.0

### Changed

* Updated the bundled Disqus plugin.
* Tested with WordPress 6.2.

## 11.0.6

### Changed

* Updated the bundled Disqus plugin and build tools.
* Tested with WordPress 5.7.

### Fixed

* Console errors.

## 11.0.5

### Fixed

* A JavaScript error with the scroll method.

## 11.0.4

### Changed

* Tested with WordPress 5.5.

### Fixed

* The comment count script.
* Cloudflare Rocket Loader support.

## 11.0.1

### Changed

* Comment links point at the Disqus thread (`#disqus_thread`).

## 11.0.0

### Changed

* Rewritten on top of Disqus 3.0.
* Faster, with an improved settings screen.
* Tested with WordPress 5.0.

### Fixed

* Cron-related bugs.

## 10.x

* **10.2.0** — Disqus JavaScript config variables added to the page. Fixed
  the respond link. Tested with WordPress 4.5.1.
* **10.1.9** — Option to remove Disqus from post types. Custom post type
  fixes.
* **10.1.8** — Fixed URLs containing `#`.
* **10.1.7** — Fixed issues with caching plugins.
* **10.1.6** — Fixed Internet Explorer issues.
* **10.1.4** — No longer depends on jQuery. Faster.
* **10.1.3** — Comment width in `%` or `px`. Cloudflare Rocket Loader option.
  The thread is centred.
* **10.1.2** — Checks the user agent is set before reading it.
* **10.1.1** — [SEO mode](/better-disqus-comments/seo-mode): search engines
  get synced WordPress comments, even with lazy loading.
* **10.1.0** — Output fix. Tested with WordPress 4.2.4.
* **10.0.7** — Custom post type fixes, a warning when Disqus isn't set up,
  removed the activation redirect.
* **10.0.5** — Fixed `count.js`.
* **10.0.3** — Fixes with external script rendering off, activation and an
  undefined Disqus variable.
* **10.0.2** — Old options are carried over on update.
* **10.0.1** — Comment width setting. Rewritten to modern coding standards.

## Earlier

Versions 1.0 to 9.0.9 built the original lazy loading for Disqus, including
jumping to linked comments, WooCommerce review support and SSL fixes.

## Addons

| Addon | Version | Notes |
| --- | --- | --- |
| [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons) | 1.0.0 | First release. |
| [Scroll Load](/better-disqus-comments/addons/scroll-load) | 1.0.0 | First release. |
| [Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments) | 1.0.0 | First release. New: show Disqus instead of the Reviews tab. |
| [Comments for EDD](/better-disqus-comments/addons/edd-comments) | 1.0.0 | First release. Fixes DCL Pro's EDD support, which never took effect. |
| [Comments Widget](/better-disqus-comments/addons/comments-widget) | 1.0.0 | First release. Fixes the thread showing twice when the sidebar came after the content. |
| [Latest Comments Widget](/better-disqus-comments/addons/latest-comments) | 1.0.0 | First release. One API request for all widgets, per-widget settings, a backup list for Disqus outages. |
