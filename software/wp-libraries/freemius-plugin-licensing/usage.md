# Usage

## License activation

```php
$result = $freemius->license()->activate( 'XXXX-XXXX-XXXX' );

if ( is_wp_error( $result ) ) {
    echo esc_html( $result->get_error_message() );
}
```

`activate()` returns `true` / `false` from the option update on success, or a `WP_Error` when the key is empty, the plugin is not the premium build, the API call fails, or the response does not include an install ID.

## License deactivation

```php
$result = $freemius->license()->deactivate();
```

`deactivate()` refuses to proceed when the stored UID does not match the current site — that means the activation was moved elsewhere, and the new host correctly appears unlicensed rather than silently freeing the original seat.

## Reading the current activation

```php
$activation = $freemius->license()->get_activation();

if ( $activation->is_active() ) {
    $key     = $activation->license_key();
    $install = $activation->install_id();
}
```

`get_activation()` always returns an `Activation` value object — use `is_empty()` to detect the no-activation case.

## Updates

Update hooks are registered automatically during `boot()` for premium builds — WordPress will check for, display, and apply updates through its standard pipeline.

To force a refresh from the host plugin's UI:

```php
$freemius->update()->get_update_data( true );
```

## Addons

```php
$addons = $freemius->addon()->get_addons();       // Cached for 24h.
$addons = $freemius->addon()->get_addons( true ); // Force refresh.
```

Each entry is enriched with a `link` field (Freemius checkout URL) and an `is_premium` boolean. Use the `duckdev_freemius_format_addon_data` filter to rewrite fields per addon.

## Hooks

### Actions

| Hook | Arguments | When |
| --- | --- | --- |
| `duckdev_freemius_license_activated` | `array $activation, bool $success` | After a successful activation. |
| `duckdev_freemius_license_deactivated` | `array $activation, bool $success` | After a successful deactivation. |

### Filters

| Hook | Arguments | Use |
| --- | --- | --- |
| `duckdev_freemius_api_request_args` | `array $args, string $method, string $url, array $data, array $headers` | Tweak request arguments before they reach `wp_remote_request()`. |
| `duckdev_freemius_api_request_verify_ssl` | `bool $verify, Client $client` | Disable SSL verification (typically only in local dev). |
| `duckdev_freemius_format_addon_data` | `array $addon, Addon $service` | Rewrite or augment each addon entry before it is returned. |

## Security notes

- The library does **not** verify nonces or capabilities. Host plugins MUST do that before forwarding form input to `License::activate()` / `License::deactivate()`.
- The license key is stored in the `duckdev_freemius_activation_data` option, keyed by plugin ID. It is blanked from storage on deactivation.
