# WP Review Notice — Overview

A small, opinionated WordPress library that gently asks for a wp.org plugin review after a few days of usage. Built around a tiny set of focused, swappable collaborators so it stays trivially testable and easy to extend.

## What it does

- Waits a configurable number of days after activation before showing anything.
- Shows a dismissable admin notice with **Review** / **Later** / **Dismiss** actions.
- Restricts visibility to specific admin screens and capability levels.
- Persists per-user dismissal so a dismiss doesn't nag another admin.

## Architecture

Every collaborator is constructor-injectable, so tests (and unusual integrations) can swap any single piece without forking the library.

```
Notice (facade, DI container)
 ├── KeyPrefixer             — "{prefix}_review_{key}" namespacing
 ├── TimerStoreInterface     — when the next show is due  (default: SiteOptionTimerStore)
 ├── DismissalStoreInterface — per-user dismissal flag    (default: UserMetaDismissalStore)
 ├── ScreenResolverInterface — current admin screen check
 ├── CapabilityCheckerInterface — capability gate
 ├── ActionRouter            — handles later/dismiss GET dispatch
 └── RendererInterface       — emits the notice HTML       (default: DefaultRenderer)
```
