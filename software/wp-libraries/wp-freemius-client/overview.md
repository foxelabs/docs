# WP Freemius Client — Overview

A lite, UI-free Freemius SDK for Foxe Labs WordPress plugins. It handles license activation, deactivation, update delivery, and addon listing by talking to the Freemius API directly.

The library deliberately ships **no admin screens** — host plugins build their own UI and call into this library for the underlying logic.

## What it does

- **License activation / deactivation** against the Freemius API.
- **Update delivery** — hooks into WordPress' standard update pipeline for premium builds.
- **Addon listing** with 24-hour caching and a checkout URL per addon.
- **Signed API requests** using the FS / FSP header-signing scheme.

## What it does not do

- No admin notices, settings screens, activation modals, or opt-in flows.
- No nonce / capability checks — host plugins MUST do that before forwarding form input to `activate()` / `deactivate()`.

## Architecture

Small dependency-injection container wired up by `FoxeLabs\Freemius\Freemius`:

```
src/
├── Freemius.php              # Container + entry point
├── Api/                      # HTTP client, signing, factory
├── Contracts/                # ServiceInterface, ApiClientInterface, CacheInterface
├── Data/                     # Plugin, Activation, ApiKeys value objects
├── Storage/                  # ActivationRepository, TransientCache
├── Services/                 # License, Update, Addon
├── Support/                  # SiteIdentity
└── Exceptions/               # FreemiusException
```

Each service receives its collaborators by constructor injection, so they can be unit-tested without WordPress in the loop. Hook registration happens inside `boot()` — instantiating the container has no side effects.
