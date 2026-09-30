---
title: Getting Started
description: Install Convocept, the fast native comment system for WordPress, and find your way around its settings.
---

# Getting Started

**Convocept** replaces your theme's comment section with a fast, modern one:
threaded replies, upvotes, pinned comments, email subscriptions and spam
protection. Every comment stays a normal WordPress comment in your own
database, so Akismet, backups, exports and the core **Comments** screen keep
working, and nothing is lost if you ever switch back.

It is built to cost nothing on page load:

- **0 KB of JavaScript** when the page loads. A small script (under 6 KB
  gzipped) loads only when a reader scrolls near the comments or starts
  typing.
- **0 extra requests.** The stylesheet (under 3 KB) is inlined next to the
  comments.
- **Server-rendered.** Readers and search engines get the comments in the
  page HTML, and page caches can serve the page to everyone.

See [Performance](/convocept/performance) for the numbers.

[[toc]]

## Requirements

- WordPress **6.5** or later
- PHP **7.4** or later
- A classic theme or a block theme. No account, API key or outside service.

## Install

1. In your WordPress admin, go to **Plugins → Add New**.
2. Search for **Convocept**.
3. Click **Install Now**, then **Activate**.

Or download the ZIP from
[WordPress.org](https://wordpress.org/plugins/convocept/) and upload it under
**Plugins → Add New → Upload Plugin**.

That's it. Posts and pages now show the Convocept comment section with all
their existing comments. Nothing is copied or converted: Convocept reads and
writes the standard WordPress comment tables.

::: tip Coming from Disqus, wpDiscuz or Subscribe to Comments Reloaded?
Disqus comments can be imported in a few clicks: see
[Import from Disqus](/convocept/import-from-disqus). wpDiscuz comments are
already WordPress comments and show up straight away: see
[Switching Plugins](/convocept/switching-plugins).
:::

## What stays with WordPress

Convocept changes how comments look and how they are posted. These still
come from **Settings → Discussion**, exactly as before:

- whether comments are open, and closing them on old posts;
- whether commenters must be logged in, or give a name and email;
- moderation: holding comments for approval, the moderation and
  disallowed-word lists and the link limit;
- avatars.

Convocept's own [General](/convocept/general#thread) settings take over the
threading and paging options (threading depth, comments per page, which
page shows first and the order) on posts where it shows.

Akismet, Antispam Bee and similar plugins keep checking every comment,
because Convocept posts comments through WordPress's own comment handling.

## The settings screen

Everything lives under **Comments → Convocept**, with a sidebar of pages:

| Page | What it has |
| --- | --- |
| [General](/convocept/general) | Where Convocept shows, order, comments per page, reply depth, upvotes and live updates. |
| [Appearance](/convocept/appearance) | Colour scheme, accent colour and a preview. |
| [Comment form](/convocept/composer) | How long authors may edit their comment, [email subscriptions](/convocept/subscriptions) and sending, and the Discussion settings that apply. |
| [Spam & moderation](/convocept/moderation) | Comments waiting for review and the spam checks in place. |
| [Advanced](/convocept/advanced) | Proxies and visitor IPs, privacy, structured data and uninstall. |
| [Import](/convocept/import-from-disqus) | Import comments from Disqus. |
| **Help** | Links to these docs, the support forum and your versions. |

Changes on several pages are kept together: the page header shows how many
settings changed, **Save** saves them all at once and **Discard** undoes
them. The header stays in view while you scroll. The page needs the
`manage_options` capability (administrators).

Each page has its own address, such as
`wp-admin/edit-comments.php?page=convocept&tab=appearance`, so you can
bookmark it or share it with another admin.

## What readers get

- **Threaded comments** with inline replies: the form moves under the comment
  being answered.
- A **formatting toolbar** for bold, italic, links, code and quotes, with a
  live preview. See [Composer](/convocept/composer#formatting).
- **Upvotes** and sorting by oldest, newest or most upvoted.
- **Pinned comments** at the top of the thread.
- **Editing** for a few minutes after posting, with a countdown.
- **Load more comments** and **Show more replies**, so long discussions stay
  quick.
- **Comment links** that open the right page and highlight the comment.
- **Email subscriptions**: replies to their comment, or all new comments.

Reading, commenting, replying, subscribing and paging work without
JavaScript too: the thread is plain HTML and the form posts the normal
WordPress way. Upvotes, editing, preview and live updates need JavaScript.

## Moderating in the thread

Users who can moderate comments see extra actions on each comment in the
thread: **Approve**, **Pin**, **Spam**, **Trash** and **Edit in
dashboard**, and the comments waiting for approval on that post. The core
**Comments** screen keeps working as usual, with a column that shows when
one of Convocept's spam checks held a comment. See
[Moderation & Spam](/convocept/moderation).

## Turning it off

Switch off **General → Replace the theme's comments**, or deactivate the
plugin. Your theme's comments come back, with every comment. Deleting the
plugin never deletes comments; see
[Advanced → Uninstall](/convocept/advanced#uninstall) for what else is
kept.

## What's next

- [General](/convocept/general) — where comments show and how the thread is
  split into pages.
- [Appearance](/convocept/appearance) — match your theme, or pick light or
  dark.
- [Import from Disqus](/convocept/import-from-disqus) — bring your Disqus
  comments home.
- [Theming](/convocept/theming) — CSS custom properties and template
  overrides.
- [Developer Docs](/convocept/developer-docs) — hooks, REST routes and
  templates.
