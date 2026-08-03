---
title: Getting Started
---

# Getting Started

Lazy Load for Comments holds back the WordPress comments section until a reader actually wants it — on scroll or on click — so pages with long comment threads load fast up front. This page walks you through installing the plugin and getting it working with zero configuration.

## Requirements

- WordPress 5.9 or later (block themes get an extra caching optimisation)
- PHP 7.4 or later

## Install the plugin

### From your WordPress admin

1. Go to **Plugins → Add New**.
2. Search for **Lazy Load for Comments**.
3. Click **Install Now**, then **Activate**.

### Manually

1. Download the plugin from the [WordPress.org plugin page](https://wordpress.org/plugins/lazy-load-for-comments/).
2. Go to **Plugins → Add New → Upload Plugin** and choose the downloaded `.zip`.
3. Click **Install Now**, then **Activate**.

## It works out of the box

Once activated, the plugin starts working immediately — there's nothing you have to configure. By default, comments load automatically as the reader scrolls near them, on any post or page that has at least one comment.

::: tip Zero configuration
If the defaults suit you, you're done. Everything below is optional fine-tuning.
:::

## Find the settings

All options live under **Comments → Lazy Load** in your WordPress admin. The settings are split into a few sections:

- **[Loading Behaviour](./loading-behaviour)** — choose *when* comments load (on scroll, on button click, or disabled), set a minimum comment count, toggle the loading spinner, and keep comments visible to search engines.
- **[Load Button](./load-button)** — customise the **Load Comments** button (only used when the load method is *On button click*).
- **[Cache Management](./cache)** — control how the plugin caches rendered comments on block themes, and clear that cache on demand.

## A typical first setup

Most sites are happy with the defaults, but a common tweak is:

1. Open **Comments → Lazy Load**.
2. Leave **Load Method** on **On Scroll** for the smoothest experience — or switch to **On Button Click** if you'd rather readers opt in.
3. Confirm **Disable for Search Engines** is **On** so crawlers still see your comments for SEO.
4. Save changes.

That's it — visit a post with comments and you'll see them load lazily instead of on initial page load.

## Next steps

- Dive into the [Loading Behaviour](./loading-behaviour) options.
- Customise the [Load Button](./load-button).
- Read the [Developer Docs](./developer-docs) for hooks, filters, and the REST endpoint.
