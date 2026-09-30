---
title: Composer
description: The Convocept comment form — formatting, preview, editing after posting and the WordPress Discussion settings it follows.
---

# Composer

The composer is Convocept's comment form. **Comments → Convocept →
Comment form** sets how long authors may edit their comments and the
[email subscriptions](/convocept/subscriptions), and shows the WordPress
settings the form follows.

[[toc]]

## Editing after posting

### Edit window

How many minutes authors can edit their comment after posting, from 0 to
1440. Default: **5**. `0` turns editing off.

While the window is open, the author's comment shows **Edit** and a
countdown. Guests can edit from the same browser they posted from;
logged-in readers from any device. Moderators can always edit.

Only comments written in Convocept's form with JavaScript on can be edited
in the thread. Comments posted without JavaScript, through the core form or
before Convocept, are edited from the dashboard.

Edits are checked against the **Settings → Discussion** rules again: the
link limit, the moderation list and the disallowed-words list. An edit that
matches one is held for review.

## Set in WordPress

A summary of the **Settings → Discussion** options that decide who can
comment, with a link to change them:

- **Name and email required**
- **Must be logged in to comment**
- **Every comment waits for approval**
- **Close comments on old posts**

Convocept follows these exactly, on the front end and for comments posted
through its REST API.

## Formatting

Readers format comments with a small toolbar (bold, italic, link, code,
quote) or by typing Markdown. **Preview** shows the comment exactly as it
will look before posting.

| Type | To get |
| --- | --- |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `~~strike~~` | ~~strike~~ |
| `` `code` `` | `code` |
| `[text](https://example.com)` | a link |
| `> quote` | a quote |
| `- item` or `1. item` | a list |
| three backticks on their own line | a code block |

Bare `http` and `https` addresses become links. Raw HTML is never allowed:
it shows as typed. Links accept only `http`, `https` and `mailto`
addresses, and get `rel="nofollow ugc"` like core comment links.

Comments posted before Convocept, or through the core form, are shown as
WordPress stored them.

## Without JavaScript

The composer is a real HTML form that posts to WordPress's own
`wp-comments-post.php`. Readers without JavaScript, or before the script has
loaded, can still comment, reply and subscribe. The same spam checks run
either way.

Without JavaScript, comments are saved as plain text rather than Markdown,
and editing after posting isn't available.
