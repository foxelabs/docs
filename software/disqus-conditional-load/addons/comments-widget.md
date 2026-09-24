---
title: Comments Widget
description: Place the Disqus comment thread in a sidebar, footer or any other widget area.
---

# Comments Widget

The **Comments Widget** addon adds a **Disqus Comments** widget that shows the
Disqus thread in any widget area — a sidebar, a footer — instead of below the
post content. It's lazy loaded like everywhere else on your site.

[[toc]]

## Adding the widget

1. Go to **Appearance → Widgets**, or open the Customizer.
2. Add **Disqus Comments** to a widget area.
3. Give it a **Title**, or leave it empty for none.
4. Save.

The widget has no other settings. Loading method, button and width come from
the [plugin settings](/disqus-conditional-load/comment-loading).

## Where it shows

The widget shows only where Disqus can load — on single posts with comments
open (see [Where Disqus shows](/disqus-conditional-load/getting-started#where-disqus-shows)).
Everywhere else, archives included, it shows nothing at all, not even its
title.

## One thread per page

Disqus shows one thread per page. While the widget is in use, the comments
area below the post content is hidden on posts where Disqus loads, so the
thread shows once — in the widget.

This works whatever the order of your layout, including the usual one where
the sidebar comes after the content.

::: warning Sidebars that aren't shown on every post
If a template doesn't show the sidebar holding the widget — a full-width
template, say — posts using it show no thread at all. Put the widget in an
area shown on every post, or keep the comments area with this snippet:

```php
add_filter( 'dcl_comments_widget_takes_over', '__return_false' );
```

With that filter, the thread stays below the post and the widget stays empty.
:::

## Block themes

Block themes have no widget areas, so the widget can't be placed there. You
don't need it: move the **Comments** block in the Site Editor to wherever you
want the thread — a sidebar column, say — and Better Disqus Comments shows
Disqus there.

## Developer hooks

### `dcl_comments_widget_takes_over`

Whether the widget hides the comments area below the post. Default: `true`
while the widget is in an active widget area.

### `dcl_comments_widget_title`

The default title in the widget form. Kept from DCL Pro 11.x.

### `dcl_comments_widget_form_content`

Filters the widget form's HTML. Kept from DCL Pro 11.x.

## Coming from DCL Pro

Widgets you placed with DCL Pro 11.x stay where they are, with their titles —
the widget is the same one. DCL Pro's on/off switch is gone: the addon being
active is the switch.

DCL Pro could show the thread twice when the sidebar came after the content;
the addon fixes that.

## Related

- [Latest Comments Widget](/disqus-conditional-load/addons/latest-comments) —
  a list of recent comments instead of the thread.
- [Comment Loading](/disqus-conditional-load/comment-loading) — how the
  thread loads.
