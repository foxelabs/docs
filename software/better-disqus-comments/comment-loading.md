---
title: Comment Loading
description: Choose when Disqus loads — on scroll, on click or immediately — with a separate method for mobile visitors.
---

# Comment Loading

The **Comment loading** panel decides *when* Disqus loads. Until then, the
page carries only an empty placeholder and a small script — Disqus's own
scripts, fonts and iframes aren't downloaded at all.

[[toc]]

## Load comments

**Setting key:** `dcl_gnrl_options.dcl_type` &middot; **Default:** `scroll`

| Option | Slug | What happens |
| --- | --- | --- |
| **When comments come into view** | `scroll` | Disqus loads when the visitor scrolls down to the comments section. |
| **When the visitor clicks a button** | `click` | A **Load Comments** button replaces the thread until it is clicked. |
| **Immediately (no lazy load)** | `normal` | Disqus loads with the page, like the official Disqus plugin. |

Addons can add more — the [Scroll Load](/better-disqus-comments/addons/scroll-load)
addon adds **As soon as the visitor scrolls**.

### When comments come into view

The default, and the right choice for most sites. Disqus starts loading once
the bottom of the visitor's screen reaches the comments area, so readers who
never get that far never download it.

It loads straight away instead when:

- the address points at a comment — it contains `#comment`, as in
  `#comments` or `#comment-123` — so links to a comment land on it;
- the page is too short to scroll, so the visitor could never trigger it.

### When the visitor clicks a button

The lightest option: Disqus loads only for visitors who ask for it. The
thread area shows a **Load Comments** button; clicking it shows the
[loading message](#loading-message), removes the button and loads Disqus.

A link to a comment (`#comment-…`) clicks the button automatically.

Choosing this method, for desktop or mobile, shows three more fields.

#### Button text

**Setting key:** `dcl_btn_txt` &middot; **Default:** `Load Comments`

The button label. Plain text only — HTML is escaped. Don't leave it empty: an
empty value is saved as is and the button has no label.

::: tip Show the comment count on the button
With the [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons)
addon the label becomes *"Load Comments (12)"*, and you can pick one of six
ready-made button styles.
:::

#### Button CSS classes

**Setting key:** `dcl_btn_class` &middot; **Default:** empty

Extra classes for the button, separated by spaces — handy for reusing your
theme's button styles, for example `button wp-element-button`. The button's
ID is always `dcl_comment_btn`, so you can also target it in your own CSS.

#### Loading message

**Setting key:** `dcl_message` &middot; **Default:** `Loading...`

Shown for a moment after the button is clicked, while Disqus loads, as
`<p id="dcl_progress">`.

### Immediately

Disqus loads with the page, like the official plugin. Use it when comments are
the point of the page, or to rule out lazy loading while troubleshooting.
Everything else the plugin does — counts, sync, SEO mode — still works.

## On mobile devices

**Setting key:** `dcl_gnrl_options.dcl_type_mob` &middot; **Default:** empty
(**Same as above**)

Use a different method for phones and tablets. A common setup is **When
comments come into view** on desktop and **When the visitor clicks a
button** on mobile, where data and battery matter more.

Mobile detection happens on the server, using WordPress's `wp_is_mobile()`.

::: warning Page caching
Because the method is decided on the server, a page cache that stores one
copy of each page serves whichever version it cached first — desktop or
mobile — to everyone. If you use different methods, enable your cache's
separate mobile cache, or use the same method for both.
:::

## If a method's addon is switched off

A method added by an addon is only offered while that addon is active. If
the addon is deactivated, pages fall back to **When comments come into view**
— but your choice is kept, and comes back as soon as the addon is active
again.

## How lazy loading works

The plugin replaces your theme's comments area with an empty
`<div id="disqus_thread">`, plus the button for the click method. A single
script in the footer then waits for the trigger and injects
`https://<shortname>.disqus.com/embed.js` once.

Disqus is never loaded twice, and a `disqus_config` function your site
defines is still called, after the plugin's own — see
[Developer Docs](/better-disqus-comments/developer-docs#disqus-config).

## Related

- [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons) —
  button styles and the comment count on the button.
- [Scroll Load](/better-disqus-comments/addons/scroll-load) — start loading
  on the first scroll.
- [Advanced](/better-disqus-comments/advanced) — Cloudflare Rocket Loader
  and caching or minify plugins that break loading.
