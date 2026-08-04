# WP Flash Notices — Overview

A small WordPress library that turns admin notices into *flash* notices: queue a notice during one request — typically right before a redirect — and it is printed on the next page load, then cleared. It borrows the idea from framework flash messages and implements it on the WordPress transient API.

## What it does

- Queues notices in memory and flushes them to storage **once**, on `shutdown`, so ten notices still cost a single database write.
- Prints them on the next page load using core's `notice notice-{type}` markup, then clears them automatically.
- Keeps multisite network notices in a separate queue from site notices.
- Namespaces every transient key and hook name under your prefix, so two plugins using the library on one site never collide.
- Sets an expiration on the stored queue, so a notice that is never read cannot linger in the options table.

## Architecture

Every collaborator is constructor-injectable, so tests (and unusual integrations) can swap any single piece without forking the library.

```
Notices (facade, DI container)
 ├── KeyPrefixer        — "{prefix}_flash_notices" key + hook namespacing
 ├── StoreInterface     — where the queue lives      (default: TransientStore)
 ├── RendererInterface  — emits the notice HTML      (default: AdminNoticeRenderer)
 └── Notice             — immutable value object for a single notice
```

`Notice` carries no WordPress calls, and its array form is exactly what lands in the transient — so a malformed stored row degrades to "skipped", never to a fatal on a page render.

Construction has no side effects. `register()` is what hooks `admin_notices`, `network_admin_notices`, `{prefix}_front_notices` and `shutdown`.
