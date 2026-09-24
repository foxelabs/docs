---
title: Advanced Buttons
description: Six ready-made styles for the Load Comments button, and the Disqus comment count on it.
---

# Advanced Buttons

The **Advanced Buttons** addon improves the **Load Comments** button that the
[click loading method](/disqus-conditional-load/comment-loading#when-the-visitor-clicks-a-button)
shows:

- **Button styles** — six ready-made looks instead of your theme's default
  button, with a live preview.
- **Comment count** — *"Load Comments (12)"*, so visitors can see there's a
  discussion worth opening.

When active, both options appear in the **Comment loading** panel while
**When the visitor clicks a button** is selected, for desktop or mobile.

[[toc]]

## Button style

**Setting key:** `dcl_gnrl_options.dcl_btn_style` &middot; **Default:**
empty (**Theme default**)

| Style | Colour |
| --- | --- |
| **Theme default** | Your theme's own button styling |
| **Red** | `#d63638` |
| **Orange** | `#e26f1b` |
| **Cyan** | `#0e8fa3` |
| **Black** | `#1d2327` |
| **Green** | `#008a20` |
| **Magenta** | `#b0197e` |

Each style is a solid button in its colour that switches to an outlined
version on hover and focus. The **Preview** below the fields shows the
button with your text, style and count before you save.

The styles are CSS classes on the button — `dcl-button` plus a colour class
such as `dcl-red` — and their small stylesheet loads only on pages where the
button is shown. The colour is one custom property, so you can tweak it in
your theme's CSS:

```css
#dcl_comment_btn.dcl-red {
    --dcl-btn-color: #b32d2e;
}
```

Your own [Button CSS classes](/disqus-conditional-load/comment-loading#button-css-classes)
are still added next to the style's classes.

## Show the comment count on the button

**Setting key:** `dcl_gnrl_options.dcl_btn_count` &middot; **Default:** `0`
(off)

Adds the number of Disqus comments to the button: *"Load Comments (12)"*.
Posts Disqus has no thread for yet — nobody has opened their comments — keep
the plain label.

The count needs your Disqus
[public API key](/disqus-conditional-load/disqus-account#api-keys). Without
one, the toggle's help text says so and the label is left alone.

### Caching

Each count comes from the Disqus API and is cached per post for **an hour**,
so most page views make no API request. A failed lookup is remembered for 15
minutes, so a post Disqus doesn't know yet doesn't cost a request on every
view. The cached count for a post is cleared when a comment is added to or
deleted from it in WordPress — for example by
[Comment Sync](/disqus-conditional-load/comment-sync).

## Developer hooks

### `dcl_advanced_buttons_count_text`

Filters the button label with the count added.

```php
// "12 comments — join in" instead of "Load Comments (12)".
add_filter( 'dcl_advanced_buttons_count_text', function ( $label, $text, $count ) {
    return sprintf( '%d comments — join in', $count );
}, 10, 3 );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$label` | `string` | Button text with the count, e.g. `Load Comments (12)`. |
| `$text` | `string` | The button text without the count. |
| `$count` | `int` | The comment count. |
| `$post` | `WP_Post` | The current post. |

### `dcl_module_comments_count_cache`

Return `false` to turn the count cache off. Kept from DCL Pro 11.x.

### `dcl_module_comments_count_cache_time`

How long a count is cached, in seconds. Default `3600`; the minimum is `60`.
Kept from DCL Pro 11.x.

## Coming from DCL Pro

Your button style and count setting carry over — the addon uses the same
settings and the same count cache as DCL Pro 11.x.

## Related

- [Comment Loading](/disqus-conditional-load/comment-loading) — the button
  text, classes and loading message.
- [Addons](/disqus-conditional-load/addons/) — installing and licensing.
