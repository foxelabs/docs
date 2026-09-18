---
title: Cache Management
---

# Cache Management

The Cache section lets you control how Lazy Load for Comments stores the rendered comments markup, and gives you a quick way to clear it. You can find it under **Comments → Lazy Load** in your WordPress admin, inside the **Cache** section of the settings page.

[![Cache Management](/lazy-load-for-comments/cache.png)](/lazy-load-for-comments/cache.png)

::: info How the cache works
On block themes the plugin stashes the serialized `core/comments` block in a transient (`llc_comments_block_{post_id}`) the first time a post is viewed. The REST endpoint then re-renders that transient instead of parsing the block tree on every request. The cache is automatically flushed when you switch themes.
:::

## Store comments markup in cache

When enabled, the parsed comments block is cached in a transient so the REST endpoint can render it quickly on subsequent requests. Disable this if you are actively debugging the comments output or if your comments markup changes frequently (for example, while iterating on a custom comments template).

This is an on/off toggle.

**Expected value:** `On` or `Off`. Default: `On`.

::: tip Recommended
Leave this enabled on production sites. The cache only stores the serialized block markup for posts that are actually viewed, and clears itself when you change themes.
:::

## Clear comments cache

Deletes every cached comments transient stored by the plugin. Useful after editing your theme templates, comment-related blocks, or any code that changes how comments are rendered — without it, visitors would keep seeing the previously cached markup until each post is re-viewed.

This is a button. Clicking it sends a `DELETE` request to the plugin's REST endpoint and shows a success notice when the cache has been cleared.

::: info Note
Only administrators can clear the cache. The action affects all posts at once — there is no per-post clear.
:::

## Full-page caches and CDNs

This plugin's own cache is separate from any full-page cache you run in front of WordPress — Cloudflare, a host-level page cache such as BigScoots, or a caching plugin. Those store the whole HTML page, including the placeholder the comments load into.

Lazy Load for Comments is designed to work behind them: the request that fetches the comments is a plain public `GET`, with nothing user-specific baked into the cached page, so a page can sit in a CDN cache indefinitely and still load its comments.

::: tip Upgrading from 2.0.1 or earlier
Versions up to 2.0.1 embedded a security token in the page that expired after 12–24 hours, which made comments intermittently stop loading on cached sites until the cache was cleared. If you are upgrading from one of those versions, clear your full-page and CDN cache once after updating so the old pages are replaced.
:::
