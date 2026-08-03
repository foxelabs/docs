# Installation

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Composer

## Composer

```console
composer require duckdev/wp-review-notice
```

Classes autoload under the `DuckDev\Reviews\` namespace via PSR-4.

## Bootstrapping

Register on `plugins_loaded`. `register()` is what hooks `admin_notices` + `admin_init` and seeds the show-time schedule. Calling `create()` without `register()` does nothing — useful for tests, or for configuring a notice you want to render manually.

```php
add_action( 'plugins_loaded', function () {
    \DuckDev\Reviews\Notice::create(
        'my-plugin', // wp.org plugin slug (e.g. "hello-dolly").
        'My Plugin', // Display name shown in the notice copy.
        array(
            'days'    => 7,
            'cap'     => 'manage_options',
            'screens' => array( 'dashboard', 'plugins' ),
        )
    )->register();
} );
```

## Options

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `days` | `int` | `7` | Days to wait before showing the notice for the first time. |
| `screens` | `array` | `[]` | Allowed admin screen IDs. Empty = every admin screen. |
| `cap` | `string` | `manage_options` | Capability required to see and act on the notice. |
| `classes` | `array` | `[]` | Extra CSS classes appended to the `notice notice-info` wrapper. |
| `domain` | `string` | `duckdev` | Text domain used for the bundled copy. |
| `message` | `string` | auto-generated | Custom HTML message. Not escaped — sanitise it yourself. |
| `action_labels` | `array` | bundled labels | Keys: `review`, `later`, `dismiss`. Set any to `''` to hide that link. |
| `prefix` | `string` | slug with `-` → `_` | Storage namespace. Keys are written as `{prefix}_review_{key}`. |
