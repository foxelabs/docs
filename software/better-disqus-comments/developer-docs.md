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
├── Plugin                   Slug, settings page slug and URL, admin screen ID
├── Settings                 dcl_gnrl_options: defaults, access, sanitising, REST schema
├── Account                  dcl_disqus_account: shortname and API credentials
├── Front\
│   ├── Controller           Boots the front-end classes, registers the shortcodes
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
│           Bundle}          Freemius wiring, add-on catalogue, Pro Bundle license
├── Admin\…                  Menu, settings screen, notices, toolbar menu
├── Api\…                    REST controllers under dcl/v1
├── Compat\Manager           Official Disqus plugin detection, WooCommerce reviews
├── Setup\…                  Activation, deactivation, data migrations
└── Utils\…                  Permission check, caches, asset helpers
```

Front-end classes load only outside the admin, and the `Admin` classes,
apart from the toolbar menu, only inside it. The rest loads on every
request.

The recommended way to extend the plugin:

1. Declare your add-on with [`dcl_addons`](#dcl-addons), or hook into
   [`dcl_running`](#dcl-running), so your code runs after the plugin has
   booted.
2. Use the documented filters and actions.
3. For settings, declare cards and fields with the
   [`dcl_settings_schema`](#dcl-settings-schema) PHP filter and keep the
   values in your own `show_in_rest` option. No JavaScript needed.

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
| `dcl()->front()` | `Front\Controller` — `detector()`, `renderer()`. Front-end requests only. |

## Lifecycle hooks

### `dcl_running`

Action. Fires on `plugins_loaded`, once every module is wired and the
add-ons declared through [`dcl_addons`](#dcl-addons) have booted.

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
post per request.

The built-in rules, in order: a shortname is set; not a feed; not an AMP
page; [`dsq_can_load`](#dsq-can-load) doesn't return `false`; a singular view
of a post; comments open; the post isn't waiting for its password; the post
isn't a draft, pending, scheduled, auto-draft or trashed; the post type isn't
[excluded](#dcl-excluded-cpts); and the visitor isn't a bot (a visitor with no
user agent counts as one), unless
[Load comments for search engine bots](/better-disqus-comments/seo-mode#load-comments-for-search-engine-bots)
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
| `$post` | `WP_Post\|null` | The post being checked: the one passed to the check, or else the global post. `null` when there's none. |

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
add-on uses this.

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
method and the fallback for inactive add-ons: `scroll`, `click`, `normal` or
an add-on's method.

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
`slug => array( 'label' => …, 'description' => … )`. A stored method missing
from this list falls back to `scroll`. See
[Adding a load method](#adding-a-load-method).

### `dcl_lazy_load_methods`

Filter. Slugs that count as lazy. Default `array( 'scroll', 'click' )`.

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
        <button type="button" id="dcl_comment_btn" class="…">Load Comments</button>
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
add-on registers its six here. A stored style only takes effect while it's
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

Filter. Return `true` to skip the shortcode's checks. The shortcode then
prints the Disqus thread wherever it's used — off single posts too, and
where [`dcl_can_load`](#dcl-can-load) says no — as long as there's a post to
build the embed for and a shortname is set.

```php
add_filter( 'dcl_force_shortcode', '__return_true' );
```

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
| `disqusConfig` | `integration`. Add `language` to set the Disqus interface language. |
| `postId` | The post ID |

::: warning Changing the identifier
Changing `disqusIdentifier` detaches existing threads, and comment counts and
sync keep using the original identifier. Don't change it on an existing
site.
:::

### `disqus_config`

A `window.disqus_config` function your site defines is kept. The plugin sets
the page URL, identifier, title, integration and language, then calls your
function, so your values win. Define it before the footer:

```html
<script>
window.disqus_config = function () {
    this.callbacks.onNewComment = [
        function (comment) {
            console.log('New comment', comment.id)
        },
    ]
}
</script>
```

### `dcl_localized_data`

Filter. The whole `window.dclData` object passed to the front-end script:

```js
{
    loadMethod:   'scroll' | 'click' | 'normal' | '<add-on method>',
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
not a feed, a singular view, the posts page, an archive or search results, and
[`dsq_can_load`](#dsq-can-load) allows `'count'`.

For posts that would show Disqus on their own page, the plugin wraps the
output of WordPress's `comments_number` in
`<span class="dsq-postid" data-dsqidentifier="…">`; the script turns links
around those markers into Disqus count links. Other posts keep WordPress's
own count.

## Adding a load method

Add-ons can add a loading method in three steps — this is how
[Scroll Load](/better-disqus-comments/addons/scroll-load) works.

1. **Offer it** in the settings:

   ```php
   add_filter( 'dcl_load_method_options', function ( $options ) {
       $options['on_idle'] = array(
           'label'       => 'When the browser is idle',
           'description' => 'Disqus loads once the page has finished loading.',
       );
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
   if (window.dclEmbed && window.dclEmbed.method === 'on_idle') {
       requestIdleCallback(() => window.dclEmbed.load())
   }
   ```

   Enqueue it on `wp_footer` at an early priority, so it also works when the
   [shortcode](#shortcodes) enqueued the main script late. A script this
   short can go inline after the main one instead, as Scroll Load does:

   ```php
   add_action( 'wp_footer', function () {
       if ( ! wp_script_is( 'dcl-comments', 'enqueued' ) ) {
           return;
       }

       wp_add_inline_script(
           'dcl-comments',
           'if (window.dclEmbed && window.dclEmbed.method === "on_idle") requestIdleCallback(() => window.dclEmbed.load())'
       );
   }, 1 );
   ```

   `load()` is safe to call more than once.

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
| `$comment_id` | `int` | The WordPress comment ID, new or updated. |
| `$data` | `array` | The comment as Disqus sent it. |
| `$verb` | `string` | `create`, `update` or `force_sync`. |

It doesn't fire for [Import past comments](/better-disqus-comments/comment-sync#sync-past-comments).

### `dcl_export_post_types`

Filter. Post types whose comments are
[exported to Disqus](/better-disqus-comments/comment-sync#export-comments-to-disqus).
Default: public post types that support comments.

### `dcl_webhook_hosts`

Filter. Hosts that count as this site when the plugin looks for its webhook
subscription among the Disqus forum's subscriptions. A subscription matches
when its URL has this site's webhook path and one of these hosts. Default:
the hosts of the REST URL and the home URL, lower-case and without `www.`.

Sites served under more than one domain can add theirs, in the same form:

```php
add_filter( 'dcl_webhook_hosts', function ( $hosts ) {
    $hosts[] = 'example.org';
    return $hosts;
} );
```

## Settings screen

The settings screen is a React app under **Disqus** in the admin menu, at
`admin.php?page=dcl-settings` (hook suffix `toplevel_page_dcl-settings`). A
sidebar lists its pages in three groups. The `tab` query argument picks the
page — `admin.php?page=dcl-settings&tab=display` — so a reload or a shared
link opens the same page. An unknown `tab` opens **General**.

| Group | Pages (`tab`) |
| --- | --- |
| **Settings** | General (`general`), Display (`display`), Comment sync (`sync`), Advanced (`advanced`) |
| **Manage** | Import & export (`tools`) |
| **More** | Add-ons (`addons`), Help (`help`) |

Every page edits one shared draft: the core settings, the Disqus account and
any add-on option. **Save** and **Discard** sit in the page header. Save
shows on the four settings pages, and on any other page while there are
unsaved changes; Discard shows while there are changes. Changes made on
several pages save together.

Add-ons extend the screen in two ways:

- **In PHP**, with [`dcl_settings_schema`](#dcl-settings-schema). Declare
  cards and fields, and the screen draws them with its own controls. This is
  the recommended way, and the add-ons with settings use it.
- **In JavaScript**, with `@wordpress/hooks` filters. Add a
  [page](#dcl-admin-pages), a [panel](#dcl-settings-panels) or a
  [field](#dcl-settings-loading-fields) drawn by your own components.

### Panels

The settings pages are built from panels. These are the core panels, and
the IDs that `after` refers to:

| Panel | Page | Cards |
| --- | --- | --- |
| `disqus` | General | Disqus site |
| `loading` | General | Comment loading, Load comments button |
| `display` | Display | Comment counts, Comment section |
| `sync` | Comment sync | Disqus API, Sync status |
| `advanced` | Advanced | Compatibility |

Add-on cards and panels are placed the same way:

- `after` puts it right after the named panel — a core panel or an
  add-on's — on that panel's page.
- `tab` moves it to another settings page: `general`, `display`, `sync` or
  `advanced`.
- Without `after`, or with an `after` that matches nothing, it goes just
  before the core `advanced` panel: at the end of the page `tab` names, or
  at the top of **Advanced** when there's no `tab` either.

Schema cards are placed before JavaScript panels, so a panel's `after` can
name a schema card.

### `dcl_settings_schema`

PHP filter. Settings that add-ons declare in PHP. The screen draws them with
the same controls as the core settings, and the header **Save** saves them.
Receives and returns `array( 'cards' => array(), 'fields' => array() )`.

Keep the values in your own option, registered with `show_in_rest` and a
schema that lists every key:

```php
add_action( 'init', function () {
    register_setting(
        'options',
        'my_addon_options',
        array(
            'type'         => 'object',
            'default'      => array(
                'enabled' => 0,
                'label'   => '',
            ),
            'show_in_rest' => array(
                'schema' => array(
                    'type'       => 'object',
                    'properties' => array(
                        'enabled' => array( 'type' => 'integer' ),
                        'label'   => array( 'type' => 'string' ),
                    ),
                ),
            ),
        )
    );
} );
```

Then declare a card and its fields:

```php
add_filter( 'dcl_settings_schema', function ( $schema ) {
    $schema['cards'][] = array(
        'id'          => 'my-addon',
        'title'       => 'My add-on',
        'description' => 'One sentence under the title.',
        'after'       => 'display',
    );

    $schema['fields'][] = array(
        'card'   => 'my-addon',
        'option' => 'my_addon_options',
        'key'    => 'enabled',
        'type'   => 'toggle',
        'label'  => 'Show the thing',
    );

    $schema['fields'][] = array(
        'card'    => 'my-addon',
        'option'  => 'my_addon_options',
        'key'     => 'label',
        'type'    => 'text',
        'label'   => 'Label',
        'show_if' => array(
            'key'    => 'enabled',
            'equals' => 1,
        ),
    );

    return $schema;
} );
```

The card shows on **Display**, below the core cards.
[Comments for WooCommerce](/better-disqus-comments/addons/woocommerce-comments)
declares its card the same way.

Cards:

| Key | Description |
| --- | --- |
| `id` | Unique card ID. Fields name it in `card`. |
| `title` | The card title. |
| `description` | Optional. One sentence under the title. |
| `after` | Optional. The panel or card to follow. See [Panels](#panels). |
| `tab` | Optional. The settings page to show the card on. See [Panels](#panels). |

Fields:

| Key | Description |
| --- | --- |
| `card` | A card ID, or `loading-button` for the core **Load comments button** card on **General**, which shows while the click method is in use. |
| `key` | The key in the option. |
| `type` | `toggle`, `select`, `text`, `number` or `button_preview`. Any other type draws a text field. |
| `label` | The field label. |
| `help` | Optional. A line under the field. |
| `option` | Optional. The site option holding `key`. Default: `dcl_gnrl_options`. |
| `options` | `select` only. A list of `array( 'value' => …, 'label' => …, 'help' => … )`. The chosen option's `help` replaces the field's. Before a value is saved, the first option shows. |
| `min`, `max` | `number` only. The allowed range. |
| `show_if` | Optional. `array( 'key' => …, 'equals' => … )`: show the field only while that key, in the same option, equals the value. The check is strict, so match the stored type. |
| `cast` | Optional. `int` stores the value as a number. |

What each type stores:

| Type | Stores |
| --- | --- |
| `toggle` | `1` or `0`. |
| `select` | The chosen `value`, as a string, or as a number with `'cast' => 'int'`. |
| `text` | A string. |
| `number` | A number, or `''` while the field is empty. |
| `button_preview` | Nothing. Shows the load button as visitors see it, from the core button settings. |

::: warning Keep new keys in your own option
The settings endpoint, `/wp/v2/settings`, only accepts the keys listed in an
option's REST schema, and rejects the whole save over any other. Leave
`option` out only for keys the core already stores —
[Advanced Buttons](/better-disqus-comments/addons/advanced-buttons) does this
for `dcl_btn_style` and `dcl_btn_count`.
:::

### JavaScript filters

The JavaScript filters go through `@wordpress/hooks`. Add them in a script
built with `@wordpress/scripts` that depends on the `dcl-settings` handle,
and enqueue it on the settings screen only:

```php
add_action( 'admin_enqueue_scripts', function ( $hook ) {
    if ( 'toplevel_page_dcl-settings' !== $hook ) {
        return;
    }

    $asset = require __DIR__ . '/build/admin.asset.php';

    wp_enqueue_script(
        'my-addon-admin',
        plugins_url( 'build/admin.js', __FILE__ ),
        array_merge( $asset['dependencies'], array( 'dcl-settings' ) ),
        $asset['version'],
        true
    );
} );
```

The app mounts once the DOM is ready, after such scripts have run, and reads
each filter once. Its own controls aren't exposed to other scripts, so your
components draw their own markup. For the core look, use
[`dcl_settings_schema`](#dcl-settings-schema).

### `dcl.admin.pages`

Adds pages to the sidebar.

```js
import { addFilter } from '@wordpress/hooks'

const ReportsPage = () => <p>Reports go here.</p>

addFilter('dcl.admin.pages', 'my-addon/pages', (pages) => [
    ...pages,
    {
        id: 'my-reports',
        group: 'manage',
        title: 'Reports',
        icon: 'download',
        render: ReportsPage,
    },
])
```

The page opens at `admin.php?page=dcl-settings&tab=my-reports`.

| Key | Description |
| --- | --- |
| `id` | Unique page ID, and its `tab` value. Reusing a core ID replaces that page. |
| `group` | `settings`, `manage` or `more`. A page with any other group is left out. |
| `title` | The sidebar label and page heading. |
| `render` | The page component, rendered without props once the settings have loaded. |
| `icon` | Optional. An icon from the plugin's set, such as `download`, `mail` or `plugin`. Other names show a dot. |
| `saves` | Optional. `true` shows **Save** in the header before anything has changed, for pages that edit settings. |
| `wide` | Optional. `true` uses the wider content column. |

A new page goes last in its group; in **More**, above **Help**, which stays
last. A page that edits settings uses core-data, as a
[panel](#dcl-settings-panels) does, and the header **Save** saves it.

### `dcl.admin.tabs`

The filter from before 13.0, still read so older add-ons keep working. Each
tab, keyed by its ID — `{ label, component, footer?, saves?, wide? }` —
becomes a page:

- `label` is the title and `component` the page.
- A tab with `footer` or `saves` joins the **Settings** group and shows
  **Save**. Any other tab joins **More**.
- It gets a dot icon and goes after every other page in its group.
- A tab whose key is already a page ID, or that has no `component`, is
  skipped.

Use [`dcl.admin.pages`](#dcl-admin-pages) in new code.

### `dcl.settings.panels`

Adds a panel to a settings page, for settings that need more than the
schema's fields.

```js
import { addFilter } from '@wordpress/hooks'
import { Card, CardBody, CardHeader, ToggleControl } from '@wordpress/components'
import { useEntityProp } from '@wordpress/core-data'

const MyPanel = () => {
    const [option, setOption] = useEntityProp('root', 'site', 'my_addon_options')
    const values = option || {}

    return (
        <Card>
            <CardHeader>
                <h2>My add-on</h2>
            </CardHeader>
            <CardBody>
                <ToggleControl
                    label="Show the thing"
                    checked={!!values.enabled}
                    onChange={(on) => setOption({ ...values, enabled: on ? 1 : 0 })}
                />
            </CardBody>
        </Card>
    )
}

addFilter('dcl.settings.panels', 'my-addon/panel', (panels) => [
    ...panels,
    { id: 'my-addon-panel', Component: MyPanel, after: 'display' },
])
```

| Key | Description |
| --- | --- |
| `id` | Unique panel ID. Reusing a core panel ID replaces that panel, on the same page unless `tab` says otherwise. |
| `Component` | The panel component, rendered without props. |
| `after` | Optional. The panel or card to follow. See [Panels](#panels). |
| `tab` | Optional. The settings page to show it on. See [Panels](#panels). |

Edit your own option with `useEntityProp('root', 'site', 'my_addon_options')`,
registered with `show_in_rest` as in the
[schema example](#dcl-settings-schema). The header **Save** then saves it with
everything else, and **Discard** reverts it.

### `dcl.settings.loading.fields`

Adds fields to the **Comment loading** card on **General**, below **On
mobile devices**. Each entry is `{ id, Component }`.

```js
import { addFilter } from '@wordpress/hooks'

const ButtonNote = ({ usesButton }) =>
    usesButton ? <p>Visitors click the button to load comments.</p> : null

addFilter('dcl.settings.loading.fields', 'my-addon/note', (fields) => [
    ...fields,
    { id: 'my-addon-note', Component: ButtonNote },
])
```

The component receives:

| Prop | Description |
| --- | --- |
| `getSetting(key, fallback)` | Reads a `dcl_gnrl_options` value. `fallback` defaults to `''`. |
| `setSetting(key, value)` | Changes a `dcl_gnrl_options` value in the draft. Only for keys the core stores — see the [warning above](#dcl-settings-schema). |
| `usesButton` | `true` while desktop or mobile uses the click method. |

To add PHP fields to the **Load comments button** card instead, use the
schema's `loading-button` card.

### `dcl_admin_script_vars`

PHP filter. The `window.dcl` object passed to the settings screen: the
version, option key, REST nonce, links, `loadMethods`, `activeAddons` (slugs
of the installed add-ons) and `schema` (the
[settings schema](#dcl-settings-schema)), among others.

## Admin

### Capability

The settings page and every `dcl/v1` REST route need the `manage_options`
capability. Change it with the `DCL_ACCESS` constant, in `wp-config.php`:

```php
define( 'DCL_ACCESS', 'edit_others_posts' );
```

or with the `dcl_capability` filter. `dcl_has_access` filters the check the
`dcl/v1` routes run; the menu page only checks the capability.

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

Filter. The full notice markup of the warning shown while the official
Disqus plugin is active.

### `dcl_disqus_file`

Filter. The plugin file used to detect the official Disqus plugin. Default
`disqus-comment-system/disqus.php`.

### `dcl_default_settings`

Filter. The default settings, filled in under the stored values. Keys added
here are also kept when settings are saved. The settings endpoint only
accepts the core keys, though, so the settings screen can't edit them — keep
add-on settings in [their own option](#dcl-settings-schema).

### `dcl_admin_action_links`

Action. Fires after the plugin adds its **Settings** link to its row on the
**Plugins** screen, with the row's action links. To change the links, use
WordPress's `plugin_action_links_{$plugin_file}` filter.

### `dcl_plugin_row_meta`

Action. Fires after the plugin adds its **Docs** and **Add-ons** links to its
row on the **Plugins** screen, with the row's meta links. To change the
links, use WordPress's `plugin_row_meta` filter.

## Add-ons

### `dcl_addons`

Filter. The one hook an add-on needs to plug in. Its main file adds a
declaration; the plugin registers it for licensing and calls its `boot`
callback just before [`dcl_running`](#dcl-running), so the add-on needs no
version or `class_exists()` checks. Add it at file load, not on a hook:

```php
add_filter( 'dcl_addons', function ( $addons ) {
    $addons[] = array(
        'id'         => 12345, // Freemius product ID.
        'slug'       => 'my-addon',
        'public_key' => 'pk_…',
        'file'       => __FILE__,
        'boot'       => 'my_addon_boot',
    );
    return $addons;
} );
```

| Key | Description |
| --- | --- |
| `id` | The Freemius product ID. |
| `slug` | The add-on's slug. |
| `public_key` | The Freemius public key. |
| `file` | The add-on's main plugin file. |
| `boot` | Optional. A callable, run with no arguments on every request once the plugin is up. |
| `is_premium` | Optional. Default `true`. |

A declaration missing `id`, `slug`, `public_key` or `file` is skipped.
Premium add-ons in the [Pro Bundle](/better-disqus-comments/addons/premium-bundle)
are licensed by it automatically.

### `dcl_register_addon`

Filter. The lower-level registration that [`dcl_addons`](#dcl-addons) builds
on: Freemius arguments keyed by product ID, with no `boot` callback. Also
added at file load:

```php
add_filter( 'dcl_register_addon', function ( $addons ) {
    $addons[ 12345 ] = array( // Freemius product ID.
        'slug'       => 'my-addon',
        'is_premium' => true,
        'main_file'  => __FILE__,
        'public_key' => 'pk_…',
    );
    return $addons;
} );
```

### `dcl_addons_catalog`

Filter. The add-on rows shown on the **Add-ons** page. Parameters:
`array $items`, the rows; `array $catalogue`, the raw rows from Freemius.

### `dcl_addons_bundle`

Filter. The data of the Pro Bundle card on the **Add-ons** page. Return an
empty array to hide the card.

## REST API

### Admin routes

All need the plugin's [capability](#capability) and a REST nonce.

| Route | Method | Does |
| --- | --- | --- |
| `dcl/v1/account` | `GET` | The shortname, public key and `has_secret_key`, `has_access_token`, `has_sync_token` flags. Secrets are never returned. |
| `dcl/v1/account` | `POST` | Update `shortname`, `public_key`, `secret_key`, `access_token`, `sync_token`. An empty string keeps a stored secret; `null` clears it. |
| `dcl/v1/sync` | `GET` | Sync status: `configured`, `allowed`, `subscribed`, `enabled`, `requires_update`, `subscription_id`, `webhook_url`, `last`. |
| `dcl/v1/sync/enable` | `POST` | Create or repair the Disqus webhook subscription. |
| `dcl/v1/sync/disable` | `POST` | Stop Disqus sending comments. |
| `dcl/v1/sync/manual` | `POST` | Import past comments. `start`, `end` (date or Unix timestamp; a date without a time zone is UTC), `cursor`. Returns `synced`, `failed`, `next`. |
| `dcl/v1/export` | `POST` | Export comments to Disqus, 10 posts per batch. `after`: the last post ID of the previous batch, `0` or left out for the first. Returns `log`, `after`, `remaining`, `done`. |
| `dcl/v1/addons` | `GET` | The add-on catalogue and bundle: `items`, `bundle`. |
| `dcl/v1/addons/refresh` | `POST` | Reload the catalogue from Freemius. |
| `dcl/v1/addons/<id>/license` | `POST`, `DELETE` | Activate (`key`) or deactivate an add-on's license. Refused for an add-on licensed through the Pro Bundle. |
| `dcl/v1/addons/bundle/license` | `POST`, `DELETE` | Activate (`key`) or deactivate the Pro Bundle. |

General settings use WordPress's settings endpoint, `/wp/v2/settings`, under
the `dcl_gnrl_options` key. It only accepts the keys listed under
[Options](#options).

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
characters) — or come from a logged-in user with `manage_options`. Anything
else gets `401`, and a request without a `verb` gets `400`. Handled verbs are
`verify` (the subscription handshake), and `create`, `update` and
`force_sync` for comments; others get `204`.

## Stored data

### Options

| Option | Holds |
| --- | --- |
| `dcl_gnrl_options` | All general settings — see below. |
| `dcl_disqus_account` | `shortname`, `public_key`, `secret_key`, `access_token`, `sync_token`. Not exposed through `/wp/v2/settings`. |
| `dcl_db_version` | Data version, for one-time migrations. |
| `dcl_sso_notice` | Set when an upgraded site used Disqus SSO; cleared when the notice is dismissed. |
| `dcl_sync_last_message` | The last sync event: `message`, `error`, `time`. |
| `dcl_bundle_license` | The Pro Bundle license key. |
| `dcl_bundle_sync_retry` | Transient. Limits activating the bundle key on newly installed add-ons to one try an hour. |
| `foxelabs_freemius_activation_data` | Add-on license activations, kept by the licensing library. Other plugins that use the library share it. |

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
| `dsq_parent_post_id` | Comments | The Disqus parent ID of a reply synced before its parent; removed once the parent arrives |

Synced comments also have the user agent `Disqus Sync Host`. `dsq_post_id`
and `dsq_thread_id` match the official Disqus plugin's keys.

## Uninstalling

Deleting the plugin removes `dcl_gnrl_options`, `dcl_disqus_account`,
`dcl_db_version`, `dcl_sso_notice`, `dcl_sync_last_message`,
`dcl_bundle_license`, the `dcl_bundle_sync_retry` transient, and the
`dcl_version_no` and `dcl_do_activation_redirect` options older versions
left behind. Synced comments, their meta, add-on license activations and
the official Disqus plugin's own settings are left in place.

Nothing is removed while the 11.x Pro plugin is active, as it shares
these options.
