---
title: Add-ons
---

# Add-ons

404 to 301 keeps the core plugin lean and ships extra capabilities as
separate, opt-in add-ons. Each one is a small standalone plugin that
extends the core — it hooks into the same settings, REST and event surface
documented in the [Developer docs](/404-to-301/developer-docs), so an
add-on's options live right alongside the core's on the relevant tab rather
than in a separate screen.

[[toc]]

## The Add-ons page

In **wp-admin → 404 to 301 → Add-ons** you'll find the catalog of
first-party add-ons. Each card shows what the add-on does and a button to
install/activate it (or manage its licence, for premium add-ons). Add-ons
require the core 404 to 301 plugin to be active.

## Available add-ons

| Add-on | What it does | Where it lives |
| --- | --- | --- |
| **[Logs Cleaner](/404-to-301/addons/logs-cleaner)** | Auto-prune the log table by age, row count, or on a schedule. | Logs settings tab |
| **[Logs Exporter](/404-to-301/addons/logs-exporter)** | Download the 404 log table as a CSV. | Logs page |
| **[Redirects Importer](/404-to-301/addons/redirects-importer)** | Bulk-import redirects from CSV or migrate from other plugins. | Tools settings tab |
| **[Email Reports](/404-to-301/addons/email-reports)** | Scheduled daily / weekly / monthly digests of 404 activity. | Notifications settings tab |
| **[Telegram Alerts](/404-to-301/addons/telegram-alerts)** | Real-time Telegram messages for 404s and redirects. | Notifications settings tab |

## Installing an add-on

1. Go to **404 to 301 → Add-ons**.
2. Find the add-on and click **Install** (free add-ons install from the
   WordPress.org repository) or **Buy / Activate licence** for premium ones.
3. Activate it. Its settings appear on the relevant tab automatically — no
   separate configuration screen to hunt for.

::: tip Settings travel together
Add-on options are stored inside the core plugin's settings envelope, so
the [Import / Export](/404-to-301/tools-settings#import-export) tool carries
them between sites automatically.
:::

## Uninstalling

Deactivating an add-on stops its behaviour and removes its box from the UI;
the core plugin keeps working. Deleting an add-on also strips its own keys
from the settings envelope, so it leaves nothing behind.
