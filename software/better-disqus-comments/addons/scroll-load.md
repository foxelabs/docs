---
title: Scroll Load
description: Start loading Disqus on the visitor's first scroll, so comments are ready by the time they reach them.
---

# Scroll Load

The **Scroll Load** addon adds one more
[loading method](/better-disqus-comments/comment-loading): **As soon as the
visitor scrolls**.

The built-in **When comments come into view** waits until the visitor reaches
the comments, so they can see the thread load in front of them. Scroll Load
starts loading Disqus on the *first* scroll instead. The first paint of the
page stays free of Disqus, and by the time the visitor gets to the comments,
they're usually ready.

[[toc]]

## Setting it up

1. [Install and activate](/better-disqus-comments/addons/#installing-an-addon)
   the addon.
2. Go to **Disqus → Settings → Comment loading**.
3. Under **Load comments** — or **On mobile devices** — choose **As soon as
   the visitor scrolls**.
4. Click **Save Changes**.

The addon has no other settings.

## How it compares

| Method | Disqus starts loading | Best for |
| --- | --- | --- |
| When comments come into view | When the visitor reaches the comments | Saving the most data; readers who stop early never load it |
| **As soon as the visitor scrolls** | On the first scroll | Comments that are ready on arrival, with a fast first paint |
| When the visitor clicks a button | On click | The lightest pages |
| Immediately | With the page | Pages where comments are the main content |

## When it loads straight away

Disqus loads without waiting for a scroll when:

- the address points at a comment (it contains `#comment`);
- the page is too short to scroll;
- the page opens already scrolled — for example when the browser restores
  the scroll position on reload.

## Deactivating

If the addon is deactivated, pages fall back to **When comments come into
view**. Your choice is kept, and comes back when the addon is active again.

## Coming from DCL Pro

This is DCL Pro 11.x's **On Scroll Start** method. It's stored the same way
(`scroll_start`), so a site that used it keeps it — install the addon and it
works again.

## Related

- [Comment Loading](/better-disqus-comments/comment-loading) — all loading
  methods.
- [Developer Docs](/better-disqus-comments/developer-docs#adding-a-load-method)
  — how an addon adds a loading method.
