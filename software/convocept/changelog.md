---
title: Changelog
description: Release history of Convocept, the fast native comment system for WordPress.
---

# Changelog

Release history for **Convocept**. The plugin's bundled `readme.txt` keeps
only the latest releases; the complete history lives here.

## 1.0.0

The first release of Convocept: a server-rendered comment system with zero
JavaScript on page load.

### Added

* **Fast comment thread.** Comments are rendered in PHP into the page, with
  no script on page load, no extra requests and no layout shift. The
  interactive script (under 6 KB gzipped) loads when a reader nears the
  comments. See [Performance](/convocept/performance).
* **Threaded replies** with inline reply forms, **Load more comments** and
  **Show more replies**, and comment links that open the right page and
  highlight the comment.
* **Composer** with a formatting toolbar, safe Markdown, a live preview and
  an [edit window](/convocept/composer#edit-window) with a countdown.
* **Upvotes** and ordering by oldest, newest or most upvoted, and **pinned
  comments**.
* **Optional live updates** that show new comments while the page is open.
* **Moderation in the thread** (approve, pin, spam, trash) and
  [spam protection](/convocept/moderation) without CAPTCHAs: a hidden trap
  field, a signed timing check and per-visitor rate limits, on top of
  WordPress's own rules and Akismet.
* **[Comment subscriptions](/convocept/subscriptions)** with double opt-in,
  one-click unsubscribe, a page to manage subscriptions, background
  sending, a block and a shortcode.
* **[Disqus importer](/convocept/import-from-disqus)** with a dry run,
  resumable batches, duplicate detection and a
  [WP-CLI command](/convocept/wp-cli).
* **Structured data** for comments, joining the Yoast SEO and Rank Math
  graphs when they are active.
* **Settings screen** under **Comments → Convocept**.
* **Privacy tools**: personal data export and erasure for subscriptions and
  upvotes, suggested privacy policy text, and a choice to store commenters'
  IP addresses in full, anonymized or not at all.
* **Accessibility** checked against WCAG 2.2 AA, right-to-left languages,
  and a translation template.
* Optional deletion of all Convocept data when the plugin is deleted.
