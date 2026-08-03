---
title: Logs Exporter
---

# Logs Exporter

Export the 404 error log table as a downloadable CSV file, straight from the
[Logs page](/404-to-301/logs/).

[[toc]]

## What it does

Once active, the add-on adds an **Export** control to the Logs page. Click
it to download the current log table as a UTF-8 CSV — one row per logged
404, with the same columns you see in the table (URL, referer, IP,
user-agent, hit count, status, first-seen and last-hit timestamps).

## Respecting filters

The export honours the **search and status filters** active on the Logs
page at the time you trigger it. Filter to, say, only `Open` rows matching
`/wp-json/`, and the CSV contains exactly that subset — not the whole table.
Clear the filters first to export everything.

## Typical uses

- **Archive before pruning** — grab a CSV before letting
  [Logs Cleaner](/404-to-301/addons/logs-cleaner) trim old rows.
- **Offline analysis** — open the CSV in a spreadsheet to pivot on top
  referers, most-hit URLs, or bot patterns.
- **Sharing** — hand a developer or client a concrete list of broken URLs
  to fix at the source.

::: tip Large tables
The export streams the rows that match your current filter. On very large
log tables, narrow the filter (or prune first) so the download stays
manageable.
:::
