---
title: SEO Mode
description: Search engines get your comments as plain WordPress comments they can index, while people get lazy-loaded Disqus.
---

# SEO Mode

Disqus comments live in an iframe loaded by JavaScript, so search engines
mostly can't see them. Lazy loading makes that worse: the thread only loads
when someone scrolls or clicks, which a crawler never does.

**SEO mode** fixes that. Search engine bots never get the Disqus embed.
Instead they get your theme's own WordPress comment list — filled with your
Disqus comments by [Comment Sync](/disqus-conditional-load/comment-sync).
People still get Disqus, lazy loaded as usual.

SEO mode is on by default. It needs nothing else to work, but without sync
there are usually no WordPress comments to show crawlers.

[[toc]]

## Set it up

1. Set up [Comment Sync](/disqus-conditional-load/comment-sync) so new Disqus
   comments are copied into WordPress.
2. Run [Sync past comments](/disqus-conditional-load/comment-sync#sync-past-comments)
   to bring in the comments you already have.
3. Leave **Advanced → Load comments for search engine bots** off (the
   default).

## What bots see

| Visitor | Gets |
| --- | --- |
| A person | The Disqus thread, loaded by your [loading method](/disqus-conditional-load/comment-loading) |
| A search engine bot | Your theme's normal comments area, listing the approved WordPress comments — including every synced Disqus comment |

A visitor counts as a bot when its user agent contains `bot`, `crawl`,
`slurp` or `spider` — Googlebot, Bingbot, Yahoo Slurp, Baiduspider,
YandexBot, DuckDuckBot, Applebot and similar — or when it sends no user agent
at all.

Crawlers get the same comments people see on Disqus — only the format
differs. Keep sync running so the two stay in step.

## Page caching

SEO mode decides per request, which clashes with full-page caching. With a
page cache, the first visitor to a page decides what's cached. If that was a
bot — or a cache preloader that sends no user agent — people get the cached
bot version: WordPress comments and no Disqus.

If you use a page cache (WP Rocket, W3 Total Cache, LiteSpeed Cache, WP Super
Cache, a host or CDN cache, …), you have two options:

1. **Keep SEO mode, and exclude bots from the cache.** Some caches can skip
   caching for bot user agents or keep a separate bot cache. This keeps SEO
   mode fully working.
2. **Turn SEO mode off.** Turn on **Advanced → Load comments for search
   engine bots**. Bots then get the Disqus embed like everyone else, so the
   cache is always safe — but crawlers no longer see your comments as
   indexable text.

## Load comments for search engine bots

**Panel:** Advanced &middot; **Setting key:** `dcl_gnrl_options.dcl_caching`
&middot; **Default:** `0` (off)

> By default Disqus is hidden from crawlers. Turn this on if you use page
> caching, so cached pages still include the comments.

Off means SEO mode is on. On means SEO mode is off: bots are treated like
people.

## Customising

Developers can take full control of the decision with the
[`dcl_can_load`](/disqus-conditional-load/developer-docs#dcl-can-load) filter —
for example to treat another user agent as a bot:

```php
// Treat Facebook's link previewer like a search engine bot.
add_filter( 'dcl_can_load', function ( $can_load ) {
    $agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    return false !== stripos( $agent, 'facebookexternalhit' ) ? false : $can_load;
} );
```

## Related

- [Comment Sync](/disqus-conditional-load/comment-sync) — what fills the
  WordPress comment list.
- [Advanced](/disqus-conditional-load/advanced) — the other compatibility
  switches.
