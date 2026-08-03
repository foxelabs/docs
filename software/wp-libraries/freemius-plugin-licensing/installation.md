# Installation

## Requirements

- PHP 7.4+
- WordPress 5.0+
- Composer

## Composer

```console
composer require duckdev/freemius-plugin-licensing
```

Classes autoload under the `DuckDev\Freemius\` namespace via PSR-4.

## Bootstrapping

Initialise the container by calling `Freemius::get_instance()` with your Freemius product ID and an arguments array. The first call creates the container and registers WordPress hooks; subsequent calls for the same plugin ID return the existing instance.

```php
$freemius = \DuckDev\Freemius\Freemius::get_instance(
    12345, // Freemius product ID.
    array(
        'slug'       => 'loggedin',
        'main_file'  => LOGGEDIN_FILE,
        'public_key' => 'pk_XXXXXXXXXXXXXXXXX',
        'is_premium' => true,
        'has_addons' => false,
    )
);
```

## Constructor options

| Key | Type | Description |
| --- | --- | --- |
| `slug` | `string` | Unique Freemius slug for the plugin. |
| `main_file` | `string` | Absolute path to the plugin's main file (used for `plugin_basename()` and `get_plugin_data()`). |
| `public_key` | `string` | Freemius public key (`pk_…`). Required for plugin-scoped endpoints (addons, info). |
| `is_premium` | `bool` | Whether this build is the premium edition. Update hooks only register when `true`. Default `false`. |
| `has_addons` | `bool` | Whether the product has addons to list. Default `false`. |
