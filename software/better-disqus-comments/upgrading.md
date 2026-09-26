---
title: Upgrading
description: Move to Better Disqus Comments 13 from the official Disqus plugin, from Disqus Conditional Load, or from DCL Pro 11.x.
---

# Upgrading

Version 13 makes Better Disqus Comments a complete Disqus plugin of its own.
It no longer needs the official *Disqus Comment System* plugin, and the old
**DCL Pro** plugin is replaced by separate [addons](/better-disqus-comments/addons/).

Your settings carry over in every case below. Pick the section that matches
your site.

[[toc]]

## From the official Disqus plugin

Better Disqus Comments does everything the official plugin did — comments,
counts, comment sync, exporting comments to Disqus, the toolbar menu — except
Single Sign-On (see [SSO](#single-sign-on-sso)). It reads the official
plugin's settings once and copies them over:

| Official plugin | Copied to |
| --- | --- |
| Forum shortname | [Shortname](/better-disqus-comments/disqus-account#shortname) |
| API public key, secret key, admin access token | [API keys](/better-disqus-comments/disqus-account#api-keys) |
| Sync token | The [sync token](/better-disqus-comments/disqus-account#the-sync-token), so comment sync keeps working |
| Inline JavaScript option | [Print the script inline](/better-disqus-comments/advanced#print-the-script-inline) |

Values are only copied into empty fields — anything already set in Better
Disqus Comments wins.

### Steps

1. **Install and activate Better Disqus Comments** while the official plugin
   is still installed.
2. **Load any page of your site** or the admin. The settings are copied on
   the first request.
3. **Check the settings** under **Disqus** in the admin menu: the shortname
   and keys should be filled in.
4. **Deactivate *Disqus Comment System*.** The yellow notice at the top of the
   admin has a direct link.
5. Delete the official plugin if you like.

::: warning Don't delete the official plugin first
Deleting the official plugin also deletes its settings. If that happens
before step 2, there is nothing to copy and you'll need to
[enter the shortname](/better-disqus-comments/disqus-account#shortname)
again.
:::

### While both are active

Comments keep showing — Better Disqus Comments takes over the comments area
and stops the official plugin's scripts from loading twice. Every admin
screen shows a notice that can't be dismissed:

> **Better Disqus Comments** now works on its own and replaces the official
> Disqus plugin. Your settings have been carried over. Please deactivate the
> Disqus Comment System plugin — comment sync stays paused until you do.

Comment sync in Better Disqus Comments stays paused until you deactivate the
official plugin. After that, Disqus keeps sending comments to the same
address and Better Disqus Comments receives them — there's nothing to set up
again.

### Single Sign-On (SSO)

Better Disqus Comments doesn't support Disqus SSO, a paid Disqus feature that
logs visitors in to Disqus with their WordPress account. If your site used
it, you'll see:

> Better Disqus Comments does not support Disqus Single Sign-On (SSO). Your
> visitors can still comment by logging in to Disqus directly.

Visitors can still comment — they log in to Disqus, or post as guests if your
Disqus settings allow it. If you depend on SSO, let us know on the
[support forum](https://wordpress.org/support/plugin/disqus-conditional-load/).

### What's different

- **Menu.** Settings live under **Disqus** in the admin menu, just below
  **Comments**, instead of under **Comments → Disqus**.
- **Lazy loading.** Comments load when they come into view by default. To
  keep the official plugin's behaviour, pick
  [Immediately](/better-disqus-comments/comment-loading#immediately).
- **Crawlers.** Search engine bots get your synced WordPress comments instead
  of the Disqus embed — see [SEO Mode](/better-disqus-comments/seo-mode).
- **Threads.** Comments stay attached to the same posts: the Disqus
  identifier is built exactly as the official plugin built it.

## From Disqus Conditional Load 12 or earlier

Update the plugin as usual. Every setting is kept — the option names haven't
changed. What's new:

- The official Disqus plugin is no longer needed. If it's active, follow
  [From the official Disqus plugin](#from-the-official-disqus-plugin) above.
- The separate [mobile loading method](/better-disqus-comments/comment-loading#on-mobile-devices),
  a DCL Pro feature before, is now free.
- [Comment Sync](/better-disqus-comments/comment-sync) and
  [SEO Mode](/better-disqus-comments/seo-mode) are built in.

## From DCL Pro 11.x

DCL Pro was one plugin with every premium feature. It's replaced by six
separate addons, each doing one thing, sold alone or together in the
[Premium Bundle](/better-disqus-comments/addons/pro-bundle):

| DCL Pro feature | Addon |
| --- | --- |
| WooCommerce integration | [Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments) |
| Easy Digital Downloads integration | [Comments for EDD](/better-disqus-comments/addons/edd-comments) |
| Disqus Comments widget | [Comments Widget](/better-disqus-comments/addons/comments-widget) |
| Disqus Latest Comments widget | [Latest Comments Widget](/better-disqus-comments/addons/latest-comments) |
| Button styles, comment count on the button | [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons) |
| "On Scroll Start" loading | [Scroll Load](/better-disqus-comments/addons/scroll-load) |
| Separate mobile loading method | Now free, in [Comment Loading](/better-disqus-comments/comment-loading#on-mobile-devices) |

Existing DCL Pro customers get the Premium Bundle; we'll email you your new
license key.

### Steps

1. **Deactivate DCL Pro.** The free plugin can't be activated while DCL Pro
   is active.
2. **Install and activate Better Disqus Comments** from WordPress.org.
3. **Download the addons you use** from your
   [Freemius account](https://users.freemius.com/), and install and activate
   them. See [Installing an addon](/better-disqus-comments/addons/#installing-an-addon).
4. **Activate your license** in **Disqus → Addons**. A Premium Bundle key is
   activated on every addon at once — see
   [Premium Bundle](/better-disqus-comments/addons/pro-bundle).
5. Delete DCL Pro.

Your DCL Pro settings — button style, WooCommerce placement, widget settings,
the scroll loading method — are kept and picked up by each addon as soon as
it's active. Widgets you placed stay in their sidebars.

::: warning Keep the official Disqus plugin until you switch
DCL Pro 11.x relies on the official Disqus plugin. If you remove the official
plugin while DCL Pro is still active, DCL Pro stops showing comments. Switch
to Better Disqus Comments and the addons first.
:::

## Related

- [Getting Started](/better-disqus-comments/getting-started) — a tour of the
  plugin.
- [Addons](/better-disqus-comments/addons/) — installing addons and
  activating licenses.
- [Changelog](/better-disqus-comments/changelog) — everything that changed in
  13.0.0.
