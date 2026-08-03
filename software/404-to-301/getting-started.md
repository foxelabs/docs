---
title: Getting Started
---

# Getting Started

**404 to 301** turns the WordPress 404 page into something actionable. Every
missing URL is logged, optionally redirected to a destination you control, and
optionally emailed to you so the broken link doesn't sit unnoticed.

The plugin ships with four built-in subsystems, each backed by its own page
inside **wp-admin → 404 to 301**:

| Page | What it does |
| --- | --- |
| **Settings** | The four tabs — General, Redirects, Logs, Notifications — that control how 404s are handled site-wide. |
| **Redirects** | A managed list of source → target redirects with per-row match modes and HTTP status codes. |
| **Logs** | The recorded 404 hits. Filter, search, mark as fixed/ignored, or promote a single log into a custom redirect. |
| **Add-ons** | Discover and activate first-party extensions (Logs Cleaner, Logs Exporter, etc.). |

A WP-CLI namespace (`wp 404-to-301 …`) mirrors most of the UI so the same
operations are available from a terminal or a deployment script.

## How a 404 is processed

When WordPress decides the current request is a 404, the plugin runs an
ordered chain of three actions on the `template_redirect` hook:

1. **Log** — records the hit, increments the per-URL hit counter, and writes
   the request context (IP, user-agent, referer, method) so you can review it
   later.
2. **Email** — checks the per-URL hit count against the configured threshold
   and sends a notification if it has been reached.
3. **Redirect** — looks up a custom redirect for the URL, falls back to the
   global redirect if one is configured, then calls `wp_redirect()` and
   exits.

The order matters: Log runs first so every 404 is captured even when the
Redirect step would `exit` the request a few microseconds later.

Custom (per-URL) redirects also fire for URLs that *aren't* 404s — if you
deliberately redirect a page that still exists, the rule is honoured. Only
logging and the global fallback are reserved for genuine 404s.

## What's next

- [General settings](/404-to-301/general-settings) — site-wide behaviour
  (URL guessing, slug monitoring, IP masking, admin 404 tracking).
- [Redirect settings](/404-to-301/redirect-settings) — the global
  fallback destination and HTTP status.
- [Log settings](/404-to-301/log-settings) — what gets recorded and what
  gets skipped.
- [Notification settings](/404-to-301/notification-settings) — when and where
  to email.
- [Tools](/404-to-301/tools-settings) — exclude paths and
  settings import / export.
- [Redirects](/404-to-301/redirects/) — managing per-URL redirects.
- [Logs](/404-to-301/logs/) — reviewing recorded 404 hits.
- [Add-ons](/404-to-301/addons/) — first-party extensions (Logs Cleaner,
  Logs Exporter, Redirects Importer, Email Reports, Telegram Alerts).
- [WP-CLI](/404-to-301/wp-cli) — every CLI command, flag for flag.
- [Developer docs](/404-to-301/developer-docs) — every filter and action the
  plugin exposes.
