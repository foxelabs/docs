---
title: Display
description: Disqus comment counts, excluded post types and the width of the comment thread.
---

# Display

The **Display** panel controls comment counts, where Disqus never shows, and
how wide the thread is.

[[toc]]

## Show Disqus comment counts

**Setting key:** `dcl_gnrl_options.dcl_count_disable` &middot; **Default:**
`1` (on)

Themes print comment-count links such as *"12 Comments"* on archives and
posts. WordPress counts only its own comments, so on a Disqus site those
links say *"No Comments"* or show a stale number. With this on, the plugin
swaps in the Disqus count.

How it works:

- The count text from WordPress's `comments_number` is wrapped in a
  `<span class="dsq-postid">` marker carrying the post's Disqus identifier.
- Links around those markers are pointed at `#disqus_thread`.
- Disqus's `count.js` is loaded once and fills in the numbers.

Counts show on archives and listings too, not only where the thread loads.
They need a shortname and are never added to feeds.

Turn it off if your theme doesn't show comment counts — `count.js` is loaded
on every page where counts are allowed, so turning it off saves a request.

::: info The key name is inverted
The setting is stored as `dcl_count_disable`, but `1` means counts are
**shown**. The name is kept from older versions so existing settings carry
over.
:::

### Block themes

Counts come from the classic `comments_number` output. The **Comments Count**
and **Comments Link** blocks in block themes may not use it, in which case
they keep showing the WordPress count.

## Exclude post types

**Setting key:** `dcl_gnrl_options.dcl_cpt_exclude` &middot; **Default:**
empty

Post types that should never show Disqus, as a comma-separated list of slugs —
for example `page, attachment`. Slugs are lower-cased and anything that isn't
a valid slug is dropped when you save.

Excluded post types keep your theme's normal WordPress comments.

To find a post type's slug, open its list screen in the admin and look at the
address: `edit.php?post_type=product` → `product`. Posts are `post`, pages
are `page`.

::: tip WooCommerce products
Products are always left out while WooCommerce is active, so product reviews
keep working, even though `product` isn't in this list. The
[Comments for WooCommerce](/disqus-conditional-load/addons/woocommerce-comments)
addon brings Disqus to product pages. If you add `product` here yourself, the
addon respects it.
:::

To show Disqus only on some posts of a type, close comments on the others:
Disqus follows each post's **Allow comments** setting.

## Comments width

**Setting keys:** `dcl_div_width`, `dcl_div_width_type` &middot;
**Default:** empty (theme width), `px`

Limit the width of the Disqus thread and centre it. Enter a number and pick
the **Unit**, `px` or `%`. Leave it empty to use your theme's width.

When set, the plugin adds this CSS on pages where Disqus loads:

```css
#disqus_thread { width: 700px; margin: 0 auto; }
```

## Related

- [Comment Loading](/disqus-conditional-load/comment-loading) — when Disqus
  loads.
- [Developer Docs](/disqus-conditional-load/developer-docs#loading-and-detection)
  — the `dcl_excluded_cpts` and `dcl_can_count` filters.
