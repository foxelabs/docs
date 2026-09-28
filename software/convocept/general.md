---
title: General
description: Choose where Convocept replaces your theme's comments, how the thread is ordered and paged, upvotes and live updates.
---

# General

**Comments → Convocept → General** decides where Convocept shows and how a
thread is ordered and split into pages.

[[toc]]

## Where it shows

### Replace the theme's comments

On by default. Turn it off to go back to your theme's own comment list and
form on every post. Nothing is deleted, and turning it back on brings
Convocept back with every comment.

While it is off, the General page shows a reminder with a **Turn Convocept
on** button, and the header of every page shows **Off**.

### Show on

The content types that get Convocept. Default: **Posts** and **Pages**.
Every public content type that supports comments is listed, except media
attachments. Other content
types keep their theme's comments.

Convocept only shows where WordPress would show comments: on a single post
view, with comments open or existing comments to show, not on
password-protected posts, and where the theme loads its comments template
or **Comments** block.

::: tip Developers
The [`convocept_enabled`](/convocept/developer-docs#filters) filter decides
per post, for example to leave one category alone.
:::

## Thread

### Default order

How comments are ordered when a reader first opens the post:

| Option | Order |
| --- | --- |
| **Oldest first** (default) | The first comment at the top, like a conversation. |
| **Newest first** | The latest comment at the top. |
| **Most upvoted** | The most upvoted comment at the top. |

Readers can switch the order with the **Oldest**, **Newest** and **Top**
links above the thread, shown once a post has more than one comment. Each is
a normal link (`?convocept_sort=newest`), so it works without JavaScript;
the links are `nofollow`, and the default order never adds anything to the
address.

Pinned comments always come first, whatever the order.

### Comments per page

Top-level comments per page, from 1 to 100. Default: **20**. Replies come
with their comment and don't count toward the number.

Readers see **Load more comments** at the end of the page. Without
JavaScript, and for search engines, there are numbered page links
(**Previous**, **1 2 3**, **Next**) instead.

### Reply depth

How deep replies nest, from 1 to 10. Default: **3**. Replies deeper than
this show in one flat list at the last level, marked **Replying to**
*name*, so long back-and-forths stay readable on a phone.

This replaces the threading and paging options in **Settings → Discussion**
(threaded comments and their depth, comments per page, which page shows
first, and their order) on posts where Convocept shows.

### Replies shown

How many replies each comment shows before **Show more replies**, from 0 to
50. Default: **5**. `0` shows every reply.

### Readers can upvote comments

On by default. Adds an upvote button to every comment. Each reader gets one
vote per comment and can take it back.

Logged-in readers vote as their account. Guests are recognised by a one-way
hash of their IP address, so the same guest can't vote twice, and the
address itself is never stored with the vote. Guests sharing one IP address
(an office, a school) share one vote.

## Live updates

### Check for new comments

Off by default. When on, new comments appear while a reader has the page
open, briefly highlighted and announced to screen readers. The comment
count updates too.

New replies appear under their comment. New top-level comments appear where
they belong in the current order: at the top of the first page when sorted
**Newest**, or at the end of the last page when sorted **Oldest**.

Checks run only while the browser tab is visible. When nothing is new, a
check is an empty `304 Not Modified` answer, which costs almost nothing.

### Check every

Seconds between checks, from 15 to 600. Default: **60**. Shown only while
live updates are on.
