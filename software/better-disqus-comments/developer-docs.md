---
title: Developer Docs
description: Hooks, shortcodes, REST endpoints, stored data and extension points of Better Disqus Comments.
---

# Developer Docs

Better Disqus Comments has a stable extension surface — PHP actions and
filters, JavaScript slots in the settings screen, REST endpoints, and an
option schema that hasn't changed since version 10. Everything on this page
is public API.

PHP examples can go in your theme's `functions.php` or a small plugin.

[[toc]]

## Architecture overview

The plugin's slug, text domain, option names and hook prefix (`dcl_`) date
from its old name, **Disqus Conditional Load**, and are kept for
compatibility. The PHP namespace is `FoxeLabs\DCL`.

```
FoxeLabs\DCL\
├── Core                     Boot orchestrator — wires every module, fires dcl_running
├── Settings                 dcl_gnrl_options: defaults, access, sanitising, REST schema
├── Account                  dcl_disqus_account: shortname and API credentials
├── Front\
│   ├── Detector             "Can Disqus load here, and how?" — one answer per request
│   ├── Renderer             Thread markup, button, shortcode
│   ├── TemplateReplacer     Swaps the classic comments template
│   ├── BlockReplacer        Swaps the core/comments block
│   ├── Assets               Front-end script and inline styles
│   ├── Count                Comment-count markers
│   └── LinkRewriter         Points comment links at #disqus_thread
├── Embed\Config             Identifier, URL, title and embed config per post
├── Sync\{Webhook, Manager,
│         Mapper, Exporter,
│         ApiService, Log}   Comment sync, manual sync and export
├── Addons\{Addons, Catalog,
│           Bundle}          Freemius wiring, addon catalogue, Pro Bundle license
├── Admin\…                  Menu, settings page, notices, toolbar menu
├── Api\…                    REST controllers under dcl/v1
└── Compat\Manager           Official Disqus plugin detection, WooCommerce reviews
```

Front-end classes only load outside the admin. The rest loads on every
request.

The recommended way to extend the plugin:

1. Hook into [`dcl_running`](#dcl-running) so your code runs after the
   plugin has booted.
2. Use the documented filters and actions.
3. For settings UI, add a panel through the
   [`dcl.settings.panels`](#dcl-settings-panels) JavaScript filter and save
   your own `show_in_rest` option.

### The `dcl()` helper

`dcl()` returns the `Core` instance, with accessors for the main services:

```php
if ( function_exists( 'dcl' ) && dcl()->account()->is_connected() ) {
    $shortname = dcl()->account()->shortname();
    $method    = dcl()->settings()->get( 'dcl_type', 'scroll' );
}
```

| Accessor | Returns |
| --- | --- |
| `dcl()->settings()` | `Settings` — `all()`, `get( $key, $fallback )`, `set( $key, $value )`, `update( $values )`, `defaults()` |
| `dcl()->account()` | `Account` — `shortname()`, `is_connected()`, `has_api_credentials()`, `get( $key )` |
| `dcl()->compat()` | `Compat\Manager` — `is_disqus_active()`, `sync_allowed()`, `woocommerce_review_support()` |
| `dcl()->front()` | `Front\Controller` — front-end requests only |

## Lifecycle hooks

### `dcl_running`

Action. Fires on `plugins_loaded` once every module is wired. The hook every
addon boots from.

```php
add_action( 'dcl_running', function ( $core ) {
    // Better Disqus Comments is ready.
} );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$core` | `FoxeLabs\DCL\Core` | The plugin core, same as `dcl()`. |

### `dcl_deactivated`

Action. Fires when the plugin is deactivated.

## Loading and detection

The plugin answers one question per request — *can Disqus load here, and
how?* — and every part of it uses the same answer.

### `dcl_can_load`

Filter. Whether the Disqus embed loads on this request. Computed once per
request.

The built-in rules, in order: a shortname is set; not a feed;
[`dsq_can_load`](#dsq-can-load) doesn't return `false`; a singular view of a
post; comments open; the post isn't a draft, pending, scheduled, auto-draft
or trashed; the post type isn't [excluded](#dcl-excluded-cpts); and the
visitor isn't a bot, unless [caching support](/better-disqus-comments/seo-mode#load-comments-for-search-engine-bots)
is on.

```php
// Never load Disqus on posts in the "announcements" category.
add_filter( 'dcl_can_load', function ( $can_load ) {
    return is_singular( 'post' ) && has_category( 'announcements' ) ? false : $can_load;
} );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$can_load` | `bool` | Result of the built-in rules. |
| `$post` | `WP_Post\|null` | The post passed to the check. Usually `null` — use `get_post()`. |

When it returns `false`, the theme's normal WordPress comments show instead.

### `dcl_excluded_cpts`

Filter. Post types that never show Disqus: the
[Exclude post types](/better-disqus-comments/display#exclude-post-types)
setting, plus `product` while WooCommerce review support is on.

```php
add_filter( 'dcl_excluded_cpts', function ( $cpts ) {
    $cpts[] = 'attachment';
    return $cpts;
} );
```

### `dcl_woocommerce_review_support`

Filter. Default `true`: WooCommerce products keep their own reviews template
and are excluded from Disqus. Return `false` to let Disqus replace product
reviews. The
[Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments)
addon uses this.

### `dsq_can_load`

Filter kept from the official Disqus plugin, so existing snippets keep
working. Called with `'embed'` for the thread and `'count'` for comment
counts; returning exactly `false` blocks that part.

```php
add_filter( 'dsq_can_load', function ( $context ) {
    return is_page( 'contact' ) ? false : $context;
} );
```

### `dcl_load_method`

Filter. The resolved loading method for this visitor, after the mobile
method and the fallback for inactive addons: `scroll`, `click`, `normal` or
an addon's method.

```php
// Button on long reads only.
add_filter( 'dcl_load_method', function ( $method ) {
    $words = str_word_count( wp_strip_all_tags( get_post_field( 'post_content' ) ) );
    return $words > 3000 ? 'click' : $method;
} );
```

### `dcl_is_mobile`

Filter. Whether the visitor gets the mobile method. Default:
`wp_is_mobile()`.

### `dcl_is_lazy`

Filter. Whether the resolved method is lazy. Parameters: `bool $is_lazy`,
`string $method`.

### `dcl_load_method_options`

Filter. The methods offered in the settings, as
`slug => [ 'label' => …, 'description' => … ]`. A stored method missing from
this list falls back to `scroll`. See [Adding a load method](#adding-a-load-method).

### `dcl_lazy_load_methods`

Filter. Slugs that count as lazy. Default `[ 'scroll', 'click' ]`.

### `dcl_shortname`

Filter. The Disqus shortname. Useful on multisite or staging:

```php
// Keep staging comments out of the live forum.
add_filter( 'dcl_shortname', function ( $shortname ) {
    return 'staging' === wp_get_environment_type() ? 'example-staging' : $shortname;
} );
```

## Rendering

The comments area becomes:

```html
<div id="disqus_thread">
    <!-- dcl_inside_disqus_thread -->
    <div id="dcl_btn_container">
        <button id="dcl_comment_btn" class="…">Load Comments</button>
    </div>
</div>
```

The button container only appears for the click method.

### `dcl_inside_disqus_thread`

Action. Fires inside `#disqus_thread`, before the button. Anything printed
here is replaced when Disqus loads — a good place for a placeholder.

```php
add_action( 'dcl_inside_disqus_thread', function () {
    echo '<p class="comments-placeholder">Comments are loading…</p>';
} );
```

### `dcl_button_text`

Filter. The button label. Escaped on output — plain text only.

### `dcl_button_class`

Filter. The button's CSS classes: the
[Button CSS classes](/better-disqus-comments/comment-loading#button-css-classes)
setting plus the selected style.

### `dcl_button_styles`

Filter. Registered button styles, as `class => label`. Empty in the free
plugin; the [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons)
addon registers its six here. A stored style only takes effect while it's
registered.

### `dcl_empty_comments`

Action. Fires where the theme's comments area was blanked — when the
[shortcode](#shortcodes) or the
[Comments Widget](/better-disqus-comments/addons/comments-widget) shows the
thread elsewhere.

### Templates

The thread is printed from `templates/disqus-comments.php`; a blanked
comments area uses `templates/empty-comments.php`. Themes can't override
these files — use the hooks above, or filter `comments_template` at a
priority above `100` (the plugin's own swap runs at `100`).

## Shortcodes

`[dcl-comments]` shows the Disqus thread where you put it, and blanks the
theme's comments area further down the page so the thread shows once.
`[js-disqus]` is an older alias.

It shows nothing where Disqus can't load — archives, closed comments,
excluded post types.

### `dcl_force_shortcode`

Filter. Return `true` to skip the shortcode's own checks. The shortcode then
always prints the comments template — the Disqus thread where
[`dcl_can_load`](#dcl-can-load) allows it, and the theme's own comments
where it doesn't.

::: warning Block themes
In block themes the shortcode doesn't hide the **Comments** block. Remove
that block from the template if you place the thread with the shortcode.
:::

## Embed configuration

For each post the plugin builds the same values the official Disqus plugin
used, so threads stay attached to their posts:

| Value | Built from |
| --- | --- |
| Identifier | `"<post ID> <guid>"`, e.g. `42 https://example.com/?p=42` |
| URL | `get_permalink()` |
| Title | The post title, without HTML |

### `dcl_embed_vars`

Filter. The per-post embed configuration handed to the front-end script.

```php
// Force the Disqus interface language.
add_filter( 'dcl_embed_vars', function ( $vars, $post ) {
    $vars['disqusConfig']['language'] = 'de';
    return $vars;
}, 10, 2 );
```

| Key | Description |
| --- | --- |
| `disqusShortname` | The shortname |
| `disqusIdentifier` | The thread identifier |
| `disqusUrl` | The post URL |
| `disqusTitle` | The post title |
| `disqusConfig` | `integration` and an optional `language` |
| `postId` | The post ID |

::: warning Changing the identifier
Changing `disqusIdentifier` detaches existing threads, and comment counts and
sync keep using the original identifier. Don't change it on an existing
site.
:::

### `disqus_config`

A `window.disqus_config` function your site defines is kept. The plugin sets
the page URL, identifier, title and language, then calls your function, so
your values win. Define it before the footer:

```html
<script>
window.disqus_config = function () {
    this.callbacks.onNewComment = [ function ( comment ) {
        console.log( 'New comment', comment.id );
    } ];
};
</script>
```

### `dcl_localized_data`

Filter. The whole `window.dclData` object passed to the front-end script:

```js
{
    loadMethod:   'scroll' | 'click' | 'normal' | '<addon method>',
    lazy:         true,
    countEnabled: true,
    progressText: 'Loading...',
    embedVars:    { … } | null, // null where only counts load
    countVars:    { disqusShortname: 'example' }
}
```

## Comment counts

### `dcl_can_count`

Filter. Whether comment-count markers and Disqus's `count.js` are output on
this request. Default: a shortname is set,
[counts are on](/better-disqus-comments/display#show-disqus-comment-counts),
not a feed, and [`dsq_can_load`](#dsq-can-load) allows `'count'`.

The plugin wraps the output of WordPress's `comments_number` in
`<span class="dsq-postid" data-dsqidentifier="…">`; the script turns links
around those markers into Disqus count links.

## Adding a load method

Addons can add a loading method in three steps — this is how
[Scroll Load](/better-disqus-comments/addons/scroll-load) works.

1. **Offer it** in the settings:

   ```php
   add_filter( 'dcl_load_method_options', function ( $options ) {
       $options['on_idle'] = [
           'label'       => 'When the browser is idle',
           'description' => 'Disqus loads once the page has finished loading.',
       ];
       return $options;
   } );
   ```

2. **Mark it lazy**, so the plugin holds the embed back:

   ```php
   add_filter( 'dcl_lazy_load_methods', function ( $methods ) {
       $methods[] = 'on_idle';
       return $methods;
   } );
   ```

3. **Trigger it.** For a method it doesn't know, the front-end script loads
   nothing and exposes `window.dclEmbed = { method, load }`. Enqueue a
   script that depends on the `dcl-comments` handle and call `load()`:

   ```js
   if ( window.dclEmbed && window.dclEmbed.method === 'on_idle' ) {
       requestIdleCallback( () => window.dclEmbed.load() );
   }
   ```

   Enqueue it on `wp_footer` at an early priority, so it also works when the
   [shortcode](#shortcodes) enqueued the main script late. `load()` is safe
   to call more than once.

## Sync

### `dcl_comment_synced`

Action. Fires after Disqus sends a comment and it's saved in WordPress.

```php
add_action( 'dcl_comment_synced', function ( $comment_id, $data, $verb ) {
    if ( 'create' === $verb && $comment_id ) {
        // Notify the post author, clear a cache, …
    }
}, 10, 3 );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$comment_id` | `int` | The WordPress comment ID. `0` if an update changed nothing. |
| `$data` | `array` | The comment as Disqus sent it. |
| `$verb` | `string` | `create`, `update` or `force_sync`. |

It doesn't fire for [Sync past comments](/better-disqus-comments/comment-sync#sync-past-comments).

### `dcl_export_post_types`

Filter. Post types whose comments are
[exported to Disqus](/better-disqus-comments/comment-sync#export-comments-to-disqus).
Default: public post types that support comments.

## Settings screen

The settings screen is a React app. Addons extend it through
`@wordpress/hooks` filters. Register them in a script that loads on the
settings screen (hook suffix `toplevel_page_dcl-settings`) before the app
mounts.

### `dcl.settings.panels`

Adds a panel to the **Settings** tab.

```js
import { addFilter } from '@wordpress/hooks'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { useEntityProp } from '@wordpress/core-data'

const MyPanel = () => {
    const [ option = {}, setOption ] = useEntityProp( 'root', 'site', 'my_addon_options' )

    return (
        <PanelBody title="My addon" initialOpen={ false }>
            <ToggleControl
                label="Enable the thing"
                checked={ !! option.enabled }
                onChange={ ( enabled ) => setOption( { ...option, enabled } ) }
            />
        </PanelBody>
    )
}

addFilter( 'dcl.settings.panels', 'my-addon/panel', ( panels ) => [
    ...panels,
    { id: 'my-addon', Component: MyPanel, after: 'display' },
] )
```

| Key | Description |
| --- | --- |
| `id` | Unique ID. Reusing a core ID — `disqus`, `loading`, `display`, `sync`, `advanced` — replaces that panel. |
| `Component` | The panel component, rendered without props. |
| `after` | The panel to insert after. Default: before `advanced`. |

Register your option with `register_setting()` and `show_in_rest` — the
**Save Changes** button then saves it along with everything else.

### `dcl.settings.loading.fields`

Adds fields to the **Comment loading** panel. Each entry is
`{ id, Component }`; the component receives:

| Prop | Description |
| --- | --- |
| `getSetting( key, fallback )` | Read a `dcl_gnrl_options` value. |
| `setSetting( key, value )` | Change a value (saved with **Save Changes**). |
| `usesButton` | `true` while desktop or mobile uses the click method. |

### `dcl.admin.tabs`

Adds a tab to the settings page, as `key => { label, component, footer?, wide? }`.
`footer: true` shows the **Save Changes** button; `wide: true` uses the wide
layout. Resolved once, when the page loads.

### `dcl_admin_script_vars`

PHP filter. The `window.dcl` object passed to the settings screen.

## Admin

### Capability

The settings page and every `dcl/v1` REST route need the `manage_options`
capability. Change it with the `DCL_ACCESS` constant, in `wp-config.php`:

```php
define( 'DCL_ACCESS', 'edit_others_posts' );
```

or with the `dcl_capability` filter. `dcl_has_access` filters the final
check.

::: info General settings still need manage_options
The general settings save through WordPress's own settings endpoint, which
always requires `manage_options`. Lower `DCL_ACCESS` and other roles can open
the page and manage the Disqus account and sync, but not save the other
settings.
:::

### `dcl_show_admin_bar`

Filter. Whether the toolbar **Disqus** menu shows. Default:
`current_user_can( 'moderate_comments' )`.

### `dcl_admin_menu`

Action. Fires after the **Disqus** menu page is added, with the page's hook
suffix.

### `dcl_disqus_conflict_alert_text`

Filter. The HTML of the warning shown while the official Disqus plugin is
active.

### `dcl_disqus_file`

Filter. The plugin file used to detect the official Disqus plugin. Default
`disqus-comment-system/disqus.php`.

### `dcl_default_settings`

Filter. The default settings. Keys added here are also kept when settings are
saved.

## Addons

### `dcl_register_addon`

Filter. How addon plugins register with the plugin's licensing. Add it at file
load, not on a hook:

```php
add_filter( 'dcl_register_addon', function ( $addons ) {
    $addons[ 12345 ] = [                 // Freemius product ID.
        'slug'       => 'my-dcl-addon',
        'is_premium' => true,
        'main_file'  => __FILE__,
        'public_key' => 'pk_…',
    ];
    return $addons;
} );
```

Premium addons are licensed by the [Pro Bundle](/better-disqus-comments/addons/pro-bundle)
automatically.

### `dcl_addons_catalog`

Filter. The addon rows shown on the **Addons** tab.

### `dcl_addons_bundle`

Filter. The Pro Bundle banner's data. Return an empty array to hide the
banner.

## REST API

### Admin routes

All need the plugin's [capability](#capability) and a REST nonce.

| Route | Method | Does |
| --- | --- | --- |
| `dcl/v1/account` | `GET` | The shortname, public key and `has_secret_key`, `has_access_token`, `has_sync_token` flags. Secrets are never returned. |
| `dcl/v1/account` | `POST` | Update `shortname`, `public_key`, `secret_key`, `access_token`, `sync_token`. An empty string keeps a stored secret; `null` clears it. |
| `dcl/v1/sync` | `GET` | Sync status: `configured`, `allowed`, `subscribed`, `enabled`, `requires_update`, `webhook_url`, `last`. |
| `dcl/v1/sync/enable` | `POST` | Create or repair the Disqus webhook subscription. |
| `dcl/v1/sync/disable` | `POST` | Stop Disqus sending comments. |
| `dcl/v1/sync/manual` | `POST` | Sync past comments. `start`, `end` (date or timestamp), `cursor`. Returns `synced`, `failed`, `next`. |
| `dcl/v1/export` | `POST` | Export comments to Disqus, 10 posts per `page`. Returns `log`, `page`, `total_pages`. |
| `dcl/v1/addons` | `GET` | The addon catalogue and bundle. |
| `dcl/v1/addons/refresh` | `POST` | Reload the catalogue from Freemius. |
| `dcl/v1/addons/<id>/license` | `POST`, `DELETE` | Activate (`key`) or deactivate an addon's license. |
| `dcl/v1/addons/bundle/license` | `POST`, `DELETE` | Activate (`key`) or deactivate the Pro Bundle. |

General settings use WordPress's settings endpoint, `/wp/v2/settings`, under
the `dcl_gnrl_options` key.

### Webhook

| Route | Method |
| --- | --- |
| `disqus/v1/sync/webhook` | `POST` |
| `disqus/v1/sync/comment` | `POST` (alias) |

Disqus sends comments here. The routes use the official plugin's namespace
so existing subscriptions keep working, and are only registered while the
official plugin is inactive.

Requests must carry an `X-Hub-Signature` header — `sha512=` followed by the
HMAC-SHA512 of the request body, keyed with the sync token (at least 32
characters). Anything else gets `401`. Handled verbs are `verify` (the
subscription handshake), `create`, `update` and `force_sync`; others get
`204`.

## Stored data

### Options

| Option | Holds |
| --- | --- |
| `dcl_gnrl_options` | All general settings — see below. |
| `dcl_disqus_account` | `shortname`, `public_key`, `secret_key`, `access_token`, `sync_token`. Not exposed through `/wp/v2/settings`. |
| `dcl_db_version` | Data version, for one-time migrations. |
| `dcl_sso_notice` | Set when an upgraded site used Disqus SSO; cleared when the notice is dismissed. |
| `dcl_sync_last_message` | The last sync event. |
| `dcl_bundle_license` | The Pro Bundle license key. |

`dcl_gnrl_options` keys:

| Key | Default | Setting |
| --- | --- | --- |
| `dcl_type` | `scroll` | [Load comments](/better-disqus-comments/comment-loading#load-comments) |
| `dcl_type_mob` | `''` | [On mobile devices](/better-disqus-comments/comment-loading#on-mobile-devices) |
| `dcl_btn_txt` | `Load Comments` | [Button text](/better-disqus-comments/comment-loading#button-text) |
| `dcl_btn_class` | `''` | [Button CSS classes](/better-disqus-comments/comment-loading#button-css-classes) |
| `dcl_message` | `Loading...` | [Loading message](/better-disqus-comments/comment-loading#loading-message) |
| `dcl_btn_style` | `''` | [Button style](/better-disqus-comments/addons/advanced-buttons#button-style) |
| `dcl_btn_count` | `0` | [Comment count on the button](/better-disqus-comments/addons/advanced-buttons#show-the-comment-count-on-the-button) |
| `dcl_count_disable` | `1` | [Show Disqus comment counts](/better-disqus-comments/display#show-disqus-comment-counts) — `1` means **on** |
| `dcl_cpt_exclude` | `''` | [Exclude post types](/better-disqus-comments/display#exclude-post-types) |
| `dcl_div_width` | `''` | [Comments width](/better-disqus-comments/display#comments-width) |
| `dcl_div_width_type` | `px` | Width unit |
| `dcl_caching` | `0` | [Load comments for search engine bots](/better-disqus-comments/advanced#load-comments-for-search-engine-bots) |
| `dcl_cfasync` | `0` | [Cloudflare Rocket Loader compatibility](/better-disqus-comments/advanced#cloudflare-rocket-loader-compatibility) |
| `dcl_render_inline` | `0` | [Print the script inline](/better-disqus-comments/advanced#print-the-script-inline) |

Switches are stored as `0` or `1`.

### Meta

| Key | On | Holds |
| --- | --- | --- |
| `dsq_post_id` | Comments | The Disqus comment ID of a synced comment |
| `dsq_thread_id` | Posts | The post's Disqus thread ID |

Synced comments also have the user agent `Disqus Sync Host`. The keys match
the official Disqus plugin's.

## Uninstalling

Deleting the plugin removes `dcl_gnrl_options`, `dcl_disqus_account`,
`dcl_db_version`, `dcl_sso_notice` and `dcl_sync_last_message`. Synced
comments, their meta and the official Disqus plugin's own settings are left
in place.
