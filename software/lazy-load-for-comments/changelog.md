---
title: Changelog
---

# Changelog

Full release history for **Lazy Load for Comments**. The plugin's bundled
`readme.txt` keeps only the latest few releases; the complete history
lives here.

## 2.1.0

### Changed

* The plugin moved to the **Foxe Labs** brand. Nothing about how it works has changed.
* The PHP namespace is now `FoxeLabs\LazyComments\` (was `DuckDev\LazyComments\`), and the Composer package is `foxelabs/lazy-load-for-comments` (was `duckdev/lazy-load-for-comments`).
* Every link in the plugin now points at the [foxelabs.com](https://foxelabs.com/software/plugins/lazy-load-for-comments/) product page and this documentation site.

::: info Extending the plugin
The old `DuckDev\LazyComments\*` class names still resolve, so add-ons and
custom templates keep working. They are deprecated and raise a
`_doing_it_wrong()` notice — see the [architecture
overview](/lazy-load-for-comments/developer-docs#architecture-overview).
Hooks, filters, option keys and setting names are unchanged.
:::

## 2.0.2

### Fixed

* Comments intermittently failed to load on sites behind a full-page cache such as Cloudflare or a host-level page cache. A REST nonce was embedded in the page HTML for logged-out visitors, and a logged-out nonce is only valid for 12–24 hours — well short of how long a cached page keeps being served. Once it expired, WordPress rejected the request with a `403` in `rest_cookie_check_errors()`, before the plugin's public endpoint was ever reached. Clearing the cache regenerated the nonce and hid the problem until the page aged out again. Logged-out visitors are no longer sent a nonce at all, and a request rejected over a stale one is retried once without it, so pages already sitting in a cache recover on their own. See [Full-page caches and CDNs](/lazy-load-for-comments/cache#full-page-caches-and-cdns).

This was a regression: [1.0.4](#_1-0-4) had removed the front-end nonce for the
same reason back in 2018, and the 2.0 rewrite reintroduced it.

## 2.0.1

### Fixed

* Comments did not render on Genesis and other classic themes that rely on `comments_template()` populating `comments_by_type`.

## 2.0.0

A complete rewrite.

### Added

* Support for block themes, via the core Comments block.
* A new React settings page under **Comments → Lazy Load**.
* Settings for load method, minimum comment count, button text, button style and loader visibility.
* A per-post cache of the rendered comments block, with a **Clear comments cache** action in the settings.

### Changed

* The comments markup is now fetched through the WordPress REST API instead of `admin-ajax.php`.
* Crawlers receive the inline comments by default, so SEO is preserved.
* The existing 1.x load-method setting is migrated automatically on upgrade.

### Removed

* The dependency on jQuery.

## 1.0.10

*24 July 2019*

* Added support for Divi.

## 1.0.9

*16 March 2019*

* Fixed issues with scroll load in WooCommerce reviews.

## 1.0.8

*14 March 2019*

* Added WooCommerce reviews support.

## 1.0.7

*14 March 2019*

* Fixed issues with WordPress 5.1.
* Fixed issues with WooCommerce reviews.

## 1.0.6

*27 January 2019*

* Added Genesis support.

## 1.0.5

*19 January 2019*

* Added a new filter to set the minimum number of comments required before lazy loading.
* Lazy load only when there are comments.
* Fixed empty comments when comments are closed.

## 1.0.4

*22 December 2018*

* Removed the nonce — a nonce is [not required for front-end GET requests](https://konstantin.blog/2012/nonces-on-the-front-end-is-a-bad-idea/).
* Changed the AJAX request to `GET`.
* Fixed the comments respond link.

## 1.0.3

*3 April 2017*

* Fixed a wrong return value in the bot-checking function.

## 1.0.2

*8 February 2017*

* Added custom filters.
* Added a loader while the comments are being fetched.
* Disabled lazy loading for search-engine crawlers.
* Scroll to the comment when a `#comment` ID is present in the URL.
* Fully translation ready.

## 1.0.0.1

*19 November 2016*

* Fixed a parse error on PHP 5.3.

## 1.0.0

*18 November 2016*

* First version.
