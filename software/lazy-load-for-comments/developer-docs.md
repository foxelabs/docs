---
title: Developer Docs
---

# Developer Docs

Lazy Load for Comments ships with a small, stable extension surface so you
can customise its behaviour without modifying its core files. Anything
documented on this page is part of the public API — it will keep working
across minor releases. Anything not documented here is internal and may
change without notice.

All examples below can be dropped into your theme's `functions.php` or a
small companion plugin.

[[toc]]

## Architecture overview

Lazy Load for Comments 2.x is built with namespaced PHP classes under
`DuckDev\LazyComments\…` and a Composer classmap autoloader. Every
subsystem lives in its own dedicated class so it can be reasoned about,
tested and replaced independently.

```
DuckDev\LazyComments\
├── Plugin                       Identity helpers (name, version, slug, URL)
├── Core                         Boot orchestrator + service locator
├── Settings                     Settings CRUD + REST registration
├── Setup\{Activator, Deactivator}
├── Admin\{Menu, Assets, Page, Links}
├── Front\{Controller, Detector, TemplateReplacer, BlockReplacer,
│         LinkRewriter, Assets, Renderer}
├── Api\{Endpoint, Comments, Cache}
├── Cache\BlockCache             Per-post transient cache for parsed blocks
├── Services\{CommentsRenderer, BlockResolver}
├── Compat\Manager               Third-party theme workarounds (Divi, …)
├── Utils\{Singleton, Permission, Assets}
└── Contracts\{Replacer, Routable}
```

The recommended way to extend the plugin is:

1. Hook into `lazy_load_for_comments_init` so your code only runs when
   the plugin is loaded.
2. Reach the long-lived services through the global helper
   `lazy_load_for_comments_settings()` or the service locator on
   `Core::instance()`.
3. Use the documented filters and actions for everything you can — they
   are guaranteed-stable.

## Actions

Actions let you run a custom function at a specific, predefined point
in the plugin's execution.

### `lazy_load_for_comments_init`

Fires once the plugin is fully booted and every subsystem (admin,
front-end, REST, compatibility) has registered its hooks. Addons should
use this action so they only initialise when Lazy Load for Comments is
active.

#### Parameters

* `$core` *(Core)* — the singleton instance of `DuckDev\LazyComments\Core`.

#### Example

```php
add_action( 'lazy_load_for_comments_init', 'my_addon_init' );

function my_addon_init( $core ) {
    // The plugin is loaded; the settings, REST routes and front-end
    // controller are all wired up. Safe to register your own hooks.
    $settings = $core->settings();
}
```

### `lazy_load_for_comments_activated`

Fires right after the plugin is activated (or reactivated). Use it to
run one-time setup tasks for your addon.

#### Example

```php
add_action( 'lazy_load_for_comments_activated', 'my_addon_on_activate' );

function my_addon_on_activate() {
    // First run — seed your addon's own options here.
}
```

### `lazy_load_for_comments_deactivated`

Fires right after the plugin is deactivated. Use it to undo whatever the
activation hook set up. **Do not delete user data here** — full cleanup
belongs in your addon's own `uninstall.php`.

#### Example

```php
add_action( 'lazy_load_for_comments_deactivated', 'my_addon_on_deactivate' );

function my_addon_on_deactivate() {
    // Pause cron jobs, clear caches, etc.
}
```

## Filters

Filters let you modify a value before the plugin uses it. A filter
callback receives the value, modifies it, and returns the modified
version.

### `lazy_load_for_comments_can_lazy_load`

Decides whether the comments should be lazy-loaded for the current
request. The plugin already runs its own eligibility checks (load
method, single post, minimum comment count, bot detection) — this
filter lets you add your own conditions on top.

#### Parameters

* `$can` *(bool)* — result of the built-in checks. Return `true` to
  lazy-load, `false` to render the comments inline as WordPress
  normally would.

#### Example

```php
add_filter( 'lazy_load_for_comments_can_lazy_load', 'my_disable_lazy_load' );

function my_disable_lazy_load( $can ) {
    // Never lazy load comments on the "contact" page.
    if ( is_page( 'contact' ) ) {
        return false;
    }

    return $can;
}
```

### `lazy_load_for_comments_rendered_html`

Modifies the comments HTML that the REST API returns to the browser
before it is injected into the page.

#### Parameters

* `$html` *(string)* — the rendered comments HTML.
* `$post` *(WP_Post)* — the post the comments belong to.

#### Example

```php
add_filter( 'lazy_load_for_comments_rendered_html', 'my_append_comment_notice', 10, 2 );

function my_append_comment_notice( $html, $post ) {
    return $html . '<p class="comment-policy">All comments are moderated before publishing.</p>';
}
```

### `lazy_load_for_comments_default_settings`

Modifies the plugin's default settings. Addons can use it to change the
fallback value of any existing key.

#### Parameters

* `$defaults` *(array)* — associative array of setting keys and their
  default values. The supported keys are:

  | Key | Type | Default | Description |
  |---|---|---|---|
  | `load_method` | string | `'scroll'` | One of `'scroll'`, `'click'`, `'off'`. |
  | `button_text` | string | `Load Comments` | Label rendered on the load button (click method). |
  | `button_style` | string | `'theme'` | `'theme'` to inherit the theme's button styling, `'custom'` for the plugin's own style. |
  | `button_class` | string | `''` | Extra CSS classes appended to the button. |
  | `show_loader` | bool | `true` | Whether to show the spinner while fetching. |
  | `minimum_count` | int | `1` | Minimum comments required before lazy loading kicks in. |
  | `disable_for_bots` | bool | `true` | Skip lazy loading for search-engine bots. |
  | `cache_enabled` | bool | `true` | Cache the parsed comments block in a transient for faster REST renders. |

#### Example

```php
add_filter( 'lazy_load_for_comments_default_settings', 'my_default_settings' );

function my_default_settings( $defaults ) {
    // Use "On button click" as the default load method.
    $defaults['load_method'] = 'click';

    return $defaults;
}
```

### `lazy_load_for_comments_capability`

Changes the user capability required to access and manage the plugin's
settings page. The default is `manage_options`.

#### Parameters

* `$capability` *(string)* — capability slug.

#### Example

```php
add_filter( 'lazy_load_for_comments_capability', 'my_custom_capability' );

function my_custom_capability( $capability ) {
    // Allow editors to manage the plugin settings.
    return 'edit_others_posts';
}
```

### `lazy_load_for_comments_has_access`

Gives fine-grained control over whether the current user can manage the
plugin and use its REST API. Runs after the capability check, so you
can override the result on a per-user basis.

#### Parameters

* `$has_access` *(bool)* — result of the default capability check.

#### Example

```php
add_filter( 'lazy_load_for_comments_has_access', 'my_restrict_access' );

function my_restrict_access( $has_access ) {
    // Only allow user ID 1 to manage the plugin.
    return get_current_user_id() === 1;
}
```

## Settings API

The settings live in a single WordPress option (`lazy_load_for_comments_settings`),
managed by `DuckDev\LazyComments\Settings`. The recommended way to read
and write them from PHP is the global helper:

```php
$settings = lazy_load_for_comments_settings();

// Read.
$method = $settings->get( 'load_method' );           // e.g. 'scroll'
$all    = $settings->all();                          // entire array (with defaults applied)
$button = $settings->get( 'button_text', 'Load' );   // optional fallback

// Write.
$settings->set( 'load_method', 'click' );            // single key
$settings->update( array(                            // bulk update
    'load_method'   => 'click',
    'minimum_count' => 5,
) );
```

Every write goes through the same sanitisation pipeline that the REST
API uses, so unsafe values are coerced or rejected automatically.

## Cache management API

When a block-theme renders the `core/comments` block, the parsed block
markup is cached per-post in a transient so the REST endpoint can
re-render it on demand without walking the active template tree again.

```php
use DuckDev\LazyComments\Cache\BlockCache;

// Read.
$key   = BlockCache::key( $post_id );   // transient key for a post
$block = BlockCache::get( $post_id );   // serialized block, or false

// Write.
BlockCache::set( $post_id, $serialized_block );

// Invalidate.
BlockCache::flush_all();                // every cached entry
```

`BlockCache::flush_all()` is automatically called on `switch_theme` —
a different theme renders the comments block differently, so any
cached markup is no longer trustworthy.

The settings UI exposes a "Clear cache" button that calls the
`DELETE /lazy-load-for-comments/v1/cache` REST endpoint, which in turn
calls `BlockCache::flush_all()`.

## REST API

The plugin registers two routes under the `lazy-load-for-comments/v1`
namespace.

### `GET /lazy-load-for-comments/v1/comments`

Returns the rendered comments HTML for a post. Used by the front-end
script to fetch the comments on click or scroll.

* **Query args:** `post_id` *(int, required)*
* **Permission:** public (no nonce, no capability check) — the response
  only contains markup WordPress would have served inline. The route is
  full-page-cache friendly.
* **Response (200):** `{ "html": "<ol class=\"commentlist\">…</ol>" }`
* **Response (404):** `{ "html": "" }` — post missing or not publicly
  viewable.

### `DELETE /lazy-load-for-comments/v1/cache`

Clears every cached comments-block transient.

* **Permission:** routed through `DuckDev\LazyComments\Utils\Permission::has_access()` — defaults to `manage_options`, filterable via [`lazy_load_for_comments_capability`](#lazy-load-for-comments-capability) and [`lazy_load_for_comments_has_access`](#lazy-load-for-comments-has-access).
* **Response (200):** `{ "success": true, "message": "Comments cache cleared." }`

## Placeholder helper

If you need the placeholder markup outside the normal classic /
block-theme render paths — for example, in a custom block or shortcode
— call the renderer directly:

```php
use DuckDev\LazyComments\Front\Renderer;

echo Renderer::placeholder();
```

The returned HTML contains the mount point the front-end script attaches
to. Make sure your custom output is reachable on a single-post view
where `lazy_load_for_comments_can_lazy_load` returns `true`, otherwise
the script will not enqueue.

## Translations

Lazy Load for Comments is hosted on WordPress.org, so its translations
are loaded automatically from
[translate.wordpress.org](https://translate.wordpress.org/projects/wp-plugins/lazy-load-for-comments/)
the first time a `__()`-style call uses the plugin's text domain. There
is no need to call `load_plugin_textdomain()` yourself.

If you want to ship custom strings for your addon, register them under
your own text domain rather than `lazy-load-for-comments`.

::: info Need help?
If you think something is missing or need help extending Lazy Load for
Comments, feel free to [contact us](https://foxelabs.com/contact/).
:::
