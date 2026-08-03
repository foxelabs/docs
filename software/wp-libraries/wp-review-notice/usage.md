# Usage

## Basic

The default set-up shows the notice on the dashboard and plugins screen after 7 days of usage, and only to users who can `manage_options`.

```php
add_action( 'plugins_loaded', function () {
    \DuckDev\Reviews\Notice::create( 'my-plugin', 'My Plugin' )->register();
} );
```

## Custom copy

```php
add_filter( 'duckdev_reviews_notice_message', function ( $message, $days ) {
    return "We're glad you've been with us for {$days}+ days!";
}, 10, 2 );
```

## Custom storage / rendering

Every collaborator is constructor-injectable, so tests and unusual integrations can swap any single piece without forking the library:

```php
use DuckDev\Reviews\Notice;
use DuckDev\Reviews\Support\Config;

$notice = new Notice(
    Config::fromArray( 'my-plugin', 'My Plugin' ),
    new MyRedisTimerStore(),       // implements TimerStoreInterface
    null,                          // default user-meta dismissal
    null,                          // default admin-screen resolver
    null,                          // default capability checker
    new MyBlockEditorRenderer()    // implements RendererInterface
);
$notice->register();
```

## Available interfaces

- `TimerStoreInterface` — when the next show is due (default: `SiteOptionTimerStore`).
- `DismissalStoreInterface` — per-user dismissal flag (default: `UserMetaDismissalStore`).
- `ScreenResolverInterface` — current admin screen check.
- `CapabilityCheckerInterface` — capability gate.
- `RendererInterface` — emits the notice HTML (default: `DefaultRenderer`).

## Hooks

### Filters

| Filter | Arguments | Use |
| --- | --- | --- |
| `duckdev_reviews_notice_message` | `string $message, int $days` | Replace the default notice copy. |

### Actions

The library does not fire any WordPress actions of its own — user interactions (Review / Later / Dismiss) are handled internally through `admin_init`.
