---
title: Loading Behaviour
---

# Loading Behaviour

The Loading Behaviour section controls how and when comments are lazy loaded on your posts and pages. You can find it under **Comments → Lazy Load** in your WordPress admin, inside the **Loading Behaviour** section of the settings page.

[![Loading Behaviour](/lazy-load-for-comments/loading-behaviour.png)](/lazy-load-for-comments/loading-behaviour.png)

## Load Method

This setting decides when the comments should be loaded on a single post or page.

This is a dropdown (select) input with three options:

### On Scroll
Comments are loaded automatically as soon as the visitor scrolls down close to the comments area. This is the default option and gives the smoothest experience.

### On Button Click
Comments are not loaded until the visitor clicks the **Load Comments** button. The button can be customised in the [Load Button](./load-button) section.

### Disabled (load normally)
Lazy loading is turned off completely. Comments load together with the rest of the page, exactly like the default WordPress behaviour.

**Expected value:** `On Scroll`, `On Button Click`, or `Disabled (load normally)`. Default: `On Scroll`.

## Minimum Comments

Use this setting to lazy load comments only when a post has a certain number of comments or more. Posts with fewer comments than this value will load their comments normally.

This is a number input field. The minimum allowed value is `1`.

**Expected value:** a whole number, `1` or greater. Default: `1`.

::: info Note
With the default value of `1`, posts that have no comments yet are not lazy loaded — the comment form is shown normally so visitors can still leave the first comment.
:::

## Show Loading Spinner

When enabled, a small loading spinner is displayed while the comments are being fetched in the background. Disable it if you prefer no visual indicator.

This is an on/off toggle.

**Expected value:** `On` or `Off`. Default: `On`.

## Disable for Search Engines

When enabled, comments are loaded normally (not lazy loaded) for search engine bots and crawlers. This keeps your comment content visible to search engines so it stays indexable.

This is an on/off toggle.

**Expected value:** `On` or `Off`. Default: `On`.

::: tip Recommended
Keep this setting enabled. Lazy loaded comments are fetched with JavaScript, and leaving this on ensures search engines still see the comment content for SEO.
:::
