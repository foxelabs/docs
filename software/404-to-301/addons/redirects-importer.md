---
title: Redirects Importer
---

# Redirects Importer

Bulk-import custom redirects into 404 to 301 — from a CSV file, or migrated
in from another redirect plugin — so you never have to re-enter rules by
hand.

Once active, the add-on adds an **Import redirects** panel to the
[Tools settings tab](/404-to-301/tools-settings).

[[toc]]

## Import sources

- **CSV file** — upload a CSV of `source,destination` (plus optional
  columns for type and match mode). Ideal for migrating from a spreadsheet
  or a plugin that can export CSV.
- **Another redirect plugin** — migrate existing redirects directly from a
  plugin already installed on the site. Currently supported sources:
  **Redirection** (by John Godley) and **301 Redirects – Redirect Manager**
  (by WebFactory). The importer reads their stored redirects and recreates
  them as native 404 to 301 rules — no export step in between. More source
  plugins may be added in future releases.

## How it works

1. Open **404 to 301 → Settings → Tools → Import redirects**.
2. Choose a source (upload a CSV, or pick a detected plugin to migrate from).
3. Review and run the import.

Imported rules land in the [Redirects](/404-to-301/redirects/) list as
ordinary rows — you can edit, disable, or delete them exactly like
manually-created redirects. Source URLs are normalised on import (leading
slash added, host stripped) so they match incoming requests correctly,
including on subdirectory installs.

## CSV format

At minimum, each line needs a source and a destination:

```csv
source,destination
/old-product,/new-product
/legacy/page,https://example.com/landing
```

Optional columns let you set the HTTP status (`301`/`302`/`307`) and the
match mode (`exact`/`prefix`/`regex`) per row. Rows that collide with an
existing redirect for the same source are skipped or updated rather than
duplicated.

::: tip Test on staging
Migrating a large redirect set changes how live URLs resolve. Import on a
staging copy first, spot-check a few redirects, then repeat on production —
or use [Import / Export](/404-to-301/tools-settings#import-export) to move
the verified settings across.
:::
