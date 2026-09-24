---
title: Advanced
description: Compatibility switches for page caching, Cloudflare Rocket Loader and caching or minify plugins.
---

# Advanced

The **Advanced** panel holds three compatibility switches. All are off by
default — turn one on only when you have the problem it solves.

[[toc]]

## Load comments for search engine bots

**Setting key:** `dcl_gnrl_options.dcl_caching` &middot; **Default:** `0`

> By default Disqus is hidden from crawlers. Turn this on if you use page
> caching, so cached pages still include the comments.

Turning this on switches [SEO mode](/better-disqus-comments/seo-mode) off:
bots get the Disqus embed like people do. See
[Page caching](/better-disqus-comments/seo-mode#page-caching) for when you
need it and the alternative.

## Cloudflare Rocket Loader compatibility

**Setting key:** `dcl_gnrl_options.dcl_cfasync` &middot; **Default:** `0`

> Adds data-cfasync="false" to the DCL script so Rocket Loader leaves it
> alone.

Cloudflare's [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/)
defers every script on the page, which can stop comments from loading or
make them load late. With this on, the plugin's script tag becomes:

```html
<script type="text/javascript" src="…/build/embed.js" data-cfasync="false"></script>
```

and Rocket Loader skips it. Only turn it on if Rocket Loader is enabled for
your site and comments misbehave.

::: tip Pick one
This has no effect together with **Print the script inline** — an inline
script has no tag of its own to mark. Use one or the other.
:::

## Print the script inline

**Setting key:** `dcl_gnrl_options.dcl_render_inline` &middot; **Default:**
`0`

> Outputs the DCL script directly in the page instead of as a separate file.
> Try this if a caching or minify plugin stops comments from loading.

Some optimisation plugins combine, defer or rewrite script files in ways that
break the loader. Printing it inline, in the footer, keeps it out of their
reach. The script is small, so the cost is a few kilobytes per page.

Sites that had the official Disqus plugin's inline JavaScript option on get
this turned on automatically when they upgrade.

## Troubleshooting comments that don't load

Work through these in order:

1. **Check the shortname.** A typo shows a Disqus error in the thread. See
   [Shortname](/better-disqus-comments/disqus-account#shortname).
2. **Check the post.** Comments must be open, and the post type not
   [excluded](/better-disqus-comments/display#exclude-post-types).
3. **Switch to Immediately** under
   [Comment loading](/better-disqus-comments/comment-loading). If comments
   now load, a script optimiser is interfering with lazy loading.
4. **Exclude the script from optimisation.** In your caching or minify
   plugin, exclude `disqus-conditional-load/build/embed.js` from combining,
   deferring and delaying — or turn on **Print the script inline**.
5. **Using Cloudflare?** Turn on **Cloudflare Rocket Loader compatibility**.
6. **Clear every cache** — plugin, host and CDN — after each change.

Still stuck? Ask on the
[support forum](https://wordpress.org/support/plugin/disqus-conditional-load/)
with a link to a post where it happens.

## Related

- [SEO Mode](/better-disqus-comments/seo-mode) — what the bots switch
  changes.
- [Comment Loading](/better-disqus-comments/comment-loading) — the loading
  methods.
