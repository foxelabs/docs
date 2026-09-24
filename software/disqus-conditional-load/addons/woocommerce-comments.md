---
title: Comments for WooCommerce
description: Show Disqus comments on WooCommerce product pages — in a new tab, below the description or instead of reviews.
---

# Comments for WooCommerce

Better Disqus Comments leaves WooCommerce products alone, so product reviews
keep working. The **Comments for WooCommerce** addon brings Disqus to your
product pages too, lazy loaded like everywhere else on your site.

When active, it adds a **WooCommerce** panel to **Disqus → Settings**, after
**Display**.

Requires WooCommerce 8.0 or later. The addon declares WooCommerce as a
required plugin and is compatible with High-Performance Order Storage.

[[toc]]

## Show Disqus on product pages

**Setting key:** `dcl_int_options.dcl_woo_method` &middot; **Default:** `tab`

| Option | Slug | Where Disqus shows |
| --- | --- | --- |
| **In a new “Comments” tab** | `tab` | A **Comments** tab next to the product's Description and Reviews tabs. |
| **Below the product description** | `desc` | Inside the Description tab, under the description text. |
| **Instead of the Reviews tab** | `reviews` | In the Reviews tab, replacing WooCommerce reviews. |

The first two keep WooCommerce reviews: shoppers can leave a star rating in
**Reviews** and discuss in Disqus. Choose **Instead of the Reviews tab** if
you'd rather use Disqus only.

::: warning Instead of the Reviews tab
Existing reviews stay in WordPress but are no longer shown, and star ratings
can no longer be left. Switching back to another option shows them again.
:::

### Products without a description

WooCommerce drops the Description tab when a product has no description.
With **Below the product description**, Disqus then shows right after the
product tabs instead — in classic themes. In block themes it isn't shown on
those products.

## Tab position

**Setting key:** `dcl_int_options.dcl_woo_tab` &middot; **Default:** `15`
(after Description)

Shown when **In a new “Comments” tab** is selected.

| Option | Priority |
| --- | --- |
| **First** | `5` |
| **After Description** | `15` |
| **After Additional information** | `25` |
| **After Reviews** | `35` |

WooCommerce's own tabs sit at priorities 10 (Description), 20 (Additional
information) and 30 (Reviews). Other plugins' tabs fall in between according
to their own priorities.

## Which products show Disqus

Disqus follows each product's **Enable reviews** box, under **Product data →
Advanced** — WooCommerce's name for "comments open". Tick it on the products
that should show Disqus, for any of the three placements.

If you added `product` to
[Exclude post types](/disqus-conditional-load/display#exclude-post-types),
that wins: no product shows Disqus.

## Block themes

The addon works with block themes: all three placements go through
WooCommerce's product tabs, which the **Product Details** block renders.

## Renaming the tab

Use the `dcl_woocommerce_comments_tab_title` filter:

```php
add_filter( 'dcl_woocommerce_comments_tab_title', function () {
    return 'Questions';
} );
```

## Saving

The panel saves with the settings page's **Save Changes** button, along with
every other setting.

## Coming from DCL Pro

Your placement and tab position carry over — the addon uses the same
settings (`dcl_int_options`) as DCL Pro 11.x. DCL Pro's separate on/off
switch is gone: the addon being active is the switch. A tab position DCL Pro
stored outside the four options shows as the nearest one.

## Related

- [Display](/disqus-conditional-load/display#exclude-post-types) — excluded
  post types.
- [Developer Docs](/disqus-conditional-load/developer-docs#dcl-woocommerce-review-support)
  — the `dcl_woocommerce_review_support` filter.
