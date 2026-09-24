---
title: Latest Comments Widget
description: Show your latest Disqus comments in a sidebar or footer widget, with avatars and excerpts, cached to keep pages fast.
---

# Latest Comments Widget

WordPress's own **Recent Comments** widget can't see Disqus comments. The
**Latest Comments Widget** addon adds a **Disqus Latest Comments** widget that
lists them: who commented, a short excerpt, and a link straight to the
comment.

It needs your Disqus
[public API key](/better-disqus-comments/disqus-account#api-keys).

[[toc]]

## Adding the widget

1. Go to **Appearance → Widgets**, or open the Customizer.
2. Add **Disqus Latest Comments** to a widget area.
3. Adjust its settings and save.

You can add it more than once, with different settings.

## Settings

Each widget has its own settings.

| Setting | Default | |
| --- | --- | --- |
| **Title** | Latest Comments | Leave empty for no title. |
| **Number of comments** | 5 | 1 to 25. |
| **Words per comment** | 15 | 1 to 500. Longer comments are cut with an ellipsis. |
| **Show avatars** | On | The commenter's Disqus avatar, linked to their Disqus profile. |
| **Avatar size** | Small | Small (40 px) or Large (60 px). |
| **Accent colour** | Default | Default (grey), Blue or Green — the colour of the dividers and avatar rings. |

Each comment shows the author, the excerpt, the post it was left on and the
date. The post title links to the comment itself.

Deleted, spam and unapproved comments are never listed.

## Caching

The widget never slows your pages with API requests:

- **One request, every widget.** A single Disqus API request fetches the 25
  latest comments for every widget on the site.
- **Cached for 5 minutes.** Pages in between use the cached list.
- **A backup for outages.** The last good list is kept for a day. If Disqus
  can't be reached, or your API limit is used up, the widget keeps showing it.
- **Back-off on errors.** After a failed request with no backup, the widget
  waits a minute before trying again, instead of trying on every page view.
- **Instant with sync.** With [Comment Sync](/better-disqus-comments/comment-sync)
  on, the cache is cleared whenever a new comment arrives.

The Disqus API allows 1,000 requests an hour per key, shared with everything
else using the key. At one request per 5 minutes the widget uses 12.

## When the widget is empty

The widget hides itself when it can't get comments — usually because the
public API key is missing. Logged-in administrators see a note in its place
explaining why; visitors see nothing.

A site with no comments yet shows *"No comments yet."*

## Styling

The widget's small stylesheet loads only while the widget is in use. The
list keeps DCL Pro's class names — `dcl-latest-comments-widget`,
`dcl-latest-comments-item`, `dcl-latest-comments-author` and so on — so custom
CSS carries over.

The accent colour is one custom property:

```css
.dcl-latest-comments-widget {
    --dcl-lc-accent: #c00;
}
```

## Block themes

Block themes have no widget areas, so the widget can't be placed there.

## Developer hooks

### `dcl_latest_comments_cache_time`

How long the list is cached, in seconds. Default `300`; the minimum is `60`.

```php
// Refresh every 15 minutes.
add_filter( 'dcl_latest_comments_cache_time', function () {
    return 15 * MINUTE_IN_SECONDS;
} );
```

## Coming from DCL Pro

Widgets you placed with DCL Pro 11.x stay where they are. DCL Pro had one set
of widget settings for the whole site; each widget now has its own. Until you
save a widget, it uses your DCL Pro settings, so nothing changes. DCL Pro's
on/off switch is gone: the addon being active is the switch.

The widget is also much lighter than DCL Pro's, which made one extra API
request for every comment it showed.

## Related

- [Comments Widget](/better-disqus-comments/addons/comments-widget) — the
  full thread in a widget.
- [Comment Sync](/better-disqus-comments/comment-sync) — keeps the list
  instantly up to date.
