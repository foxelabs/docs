---
title: Logs Cleaner
---

# Logs Cleaner

Auto-prune the 404 log table by age, by row count, or on a recurring
schedule — set it once and the table stays small on its own.

The core plugin records 404s forever; on a busy public site the log table
can balloon. Logs Cleaner adds a **Log cleanup** box to the
[Logs settings tab](/404-to-301/log-settings) with a single cleanup method
you choose.

[[toc]]

## Cleanup method

**Setting key:** `logs_cleaner_method` &middot; **Default:** `None`

Pick one strategy:

| Method | What it does |
| --- | --- |
| **None** | Cleaning is off. The default — nothing is deleted. |
| **By age** | Delete log rows older than a set number of days. |
| **By count** | Keep the table under a maximum number of rows, trimming the oldest first once the cap is exceeded. |
| **Periodic** | Run a cleanup on a recurring schedule (e.g. daily). |

### By age

**Setting key:** `logs_cleaner_age_days`

Rows whose last-hit timestamp is older than this many days are removed.

### By count

**Setting keys:** `logs_cleaner_count_threshold`, `logs_cleaner_count_strategy`,
`logs_cleaner_trim_percent`, `logs_cleaner_trim_count`

When the table exceeds `count_threshold` rows, the oldest are trimmed. How
much to trim is set by the strategy:

- **All over the limit** — delete just enough to get back to the threshold.
- **Percent** — trim a percentage of the table (`trim_percent`).
- **Count** — trim a fixed number of rows (`trim_count`).

### Periodic

**Setting key:** `logs_cleaner_periodic_schedule` &middot; **Default:** `Daily`

Runs the cleanup automatically on a WP-Cron schedule.

## Keep redirected logs

**Setting key:** `logs_cleaner_keep_redirects`

When on, log rows that have a linked custom redirect (any row with a
non-null `redirect_id`) are kept even if they'd otherwise be pruned —
they're the record of which broken URLs you've already fixed.

## How it runs

Cleanup runs on a WP-Cron event so it never blocks a page load. On a quiet
site WP-Cron only fires when there's traffic; if you need guaranteed timing,
wire a real system cron to WordPress.

::: tip Pair with Logs Exporter
Cleaning is destructive. If you want an archive before rows are pruned,
export the table first with the
[Logs Exporter](/404-to-301/addons/logs-exporter) add-on.
:::
