---
title: Comments for EDD
description: Show Disqus comments on Easy Digital Downloads product pages, right after the download content.
---

# Comments for EDD

Easy Digital Downloads product pages — *downloads* — don't have comments, so
there's nowhere for Disqus to show. The **Comments for EDD** add-on turns
comments on for downloads. Your theme then shows its comments area after the
download content, and Better Disqus Comments puts the lazy-loaded Disqus
thread there, as on your posts.

There's nothing to set up: activate the add-on and open comments on your
downloads. It adds nothing to the settings screen.

Requires Easy Digital Downloads, which the add-on declares as a required
plugin.

[[toc]]

## Which downloads show Disqus

Disqus follows each download's **Allow comments** setting, in its
**Discussion** box.

- **New downloads** follow your site's default, under **Settings →
  Discussion → Allow people to submit comments on new posts**.
- **Existing downloads** — created before the add-on was active — have
  comments **closed**, because downloads didn't support comments then.

### Open comments on existing downloads

1. Go to **Downloads** in the admin.
2. Select the downloads — or all of them with the checkbox in the header.
3. Choose **Edit** under **Bulk actions** and click **Apply**.
4. Set **Comments** to **Allow** and click **Update**.

To hide Disqus on one download, untick **Allow comments** in its
**Discussion** box. To keep downloads out entirely, add `download` to
[Exclude post types](/better-disqus-comments/display#exclude-post-types).

::: tip Don't see the Discussion box?
Open **Screen Options** at the top of the download editor and tick
**Discussion**.
:::

## Where it shows

Disqus appears wherever your theme shows comments on a download page —
usually right after the download content. In block themes, that's the
**Comments** block in the single download template.

## Developer hooks

### `dcl_edd_comments_enabled`

Return `false` to keep comment support off for downloads while the add-on is
active.

```php
add_filter( 'dcl_edd_comments_enabled', '__return_false' );
```

## Coming from version 11

Nothing to set up again. Version 11 had an on/off switch for EDD; the add-on
being active is the switch now.

## Related

- [Getting Started](/better-disqus-comments/getting-started#where-disqus-shows)
  — where Disqus shows.
- [Add-ons](/better-disqus-comments/addons/) — installing and licensing.
