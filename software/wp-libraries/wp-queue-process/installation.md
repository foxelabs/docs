# Installation

## Requirements

- PHP 7.4+
- WordPress 6.0+
- Composer

## Composer

```console
composer require duckdev/wp-queue-process
```

Classes autoload under the `DuckDev\Queue\` namespace via PSR-4.

## Bootstrapping

Nothing to bootstrap globally — you extend `Async` or `Task` in your plugin and instantiate on demand. See [Usage](./usage) for the extend-and-dispatch pattern.

### Configuration properties

| Property | Type | Purpose |
| --- | --- | --- |
| `$action` | `string` | Unique action name used to namespace every filter, option key, cron hook, and lock transient. |

Batch behaviour (time / memory budget, lock duration, cron interval) is tuned via the filters listed in [Usage](./usage#filters).
