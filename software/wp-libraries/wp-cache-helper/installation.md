# Installation

## Requirements

- PHP 7.4+
- WordPress 6.1+
- Composer

## Composer

```console
composer require duckdev/wp-cache-helper
```

Classes autoload under the `DuckDev\Cache\` namespace via PSR-4.

## Bootstrapping

Each container instance is scoped to a single prefix. Pass any non-empty string the first time you ask for it; the same prefix returns the same instance on subsequent calls:

```php
$cache = \DuckDev\Cache\Cache::get_instance( 'my_plugin' );
```

You can also instantiate directly (useful for tests where you want to inject custom drivers):

```php
$cache = new \DuckDev\Cache\Cache( 'my_plugin' );
```

Every key, group, and the `{prefix}_can_cache` toggle filter are namespaced under the supplied prefix.
