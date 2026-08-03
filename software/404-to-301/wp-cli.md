---
title: WP-CLI
---

# WP-CLI

Every important operation in the UI is mirrored as a WP-CLI subcommand
under the `wp 404-to-301` namespace. The CLI is the recommended path for
scripted migrations, deployment pipelines, and one-off bulk fixes that
would be tedious through the admin UI.

```sh
wp 404-to-301 <subcommand> [args]
```

[[toc]]

## logs

Manage rows in the 404 log table.

```sh
wp 404-to-301 logs list [--status=<status>] [--search=<term>] [--per-page=<n>] [--page=<n>] [--format=<format>]
wp 404-to-301 logs get <id>
wp 404-to-301 logs update <id> --to=<status>
wp 404-to-301 logs delete <id|--all|--status=<status>>
wp 404-to-301 logs prune --older-than=<days>
```

### Examples

```sh
# Show the 50 most recent open 404s
wp 404-to-301 logs list --status=open --per-page=50

# Mark a log row as fixed
wp 404-to-301 logs update 1234 --to=fixed

# Delete everything older than 30 days
wp 404-to-301 logs prune --older-than=30

# Wipe the table
wp 404-to-301 logs delete --all
```

`--status` accepts `open`, `ignored`, `fixed` (numeric codes `0`, `1`, `2`
are also accepted by the underlying model).

## redirects

Manage rows on the Redirects page.

```sh
wp 404-to-301 redirects list [--search=<term>] [--per-page=<n>] [--page=<n>] [--format=<format>]
wp 404-to-301 redirects get <id>
wp 404-to-301 redirects create --source=<path> --target=<url> [--type=<301|302|307>] [--match=<exact|prefix|regex>] [--active]
wp 404-to-301 redirects update <id> [--field=<value> …]
wp 404-to-301 redirects delete <id|--all>
```

### Examples

```sh
# Create a 301 redirect
wp 404-to-301 redirects create --source=/old --target=https://example.com/new

# Create a regex redirect
wp 404-to-301 redirects create \
  --source='^/news/\d{4}/(.*)$' \
  --target=https://example.com/blog/$1 \
  --match=regex

# Disable a redirect without deleting it
wp 404-to-301 redirects update 42 --is-active=0

# Wipe every redirect
wp 404-to-301 redirects delete --all
```

## settings

Read and write the plugin's stored settings.

```sh
wp 404-to-301 settings get [<key>] [--format=<format>]
wp 404-to-301 settings update <key> <value>
wp 404-to-301 settings reset
```

### Examples

```sh
# Dump every setting as JSON
wp 404-to-301 settings get --format=json

# Read one value
wp 404-to-301 settings get redirect_type

# Turn off the redirect
wp 404-to-301 settings update redirect_enabled 0

# Reset everything to defaults
wp 404-to-301 settings reset
```

The setting keys match the field names documented on the
[General](/404-to-301/general-settings),
[Redirect](/404-to-301/redirect-settings),
[Log](/404-to-301/log-settings), and
[Notification](/404-to-301/notification-settings) settings pages.

## migrate

Drive the legacy-v3 → v4 migration from the command line — useful when
upgrading a site too large to migrate through the admin UI's progress bar.

```sh
wp 404-to-301 migrate status [--format=<format>]
wp 404-to-301 migrate run [--phase=<1|2|all>] [--limit=<chunks>]
wp 404-to-301 migrate abort
```

### Examples

```sh
# See what's left to migrate
wp 404-to-301 migrate status

# Migrate everything (phase 1 + phase 2)
wp 404-to-301 migrate run

# Only migrate the redirects (phase 1) — fast, runs in one go
wp 404-to-301 migrate run --phase=1

# Migrate at most 5 chunks of logs and stop
wp 404-to-301 migrate run --phase=2 --limit=5

# Stop a long-running phase-2 migration
wp 404-to-301 migrate abort
```

`run` is safe to re-run: already-migrated rows are skipped, so a second
pass after a partial run just continues from where the previous run
stopped.

::: tip CLI on a fresh install
A fresh install has no legacy `wp_404_to_301` table to read from.
`migrate run` detects that and exits with `Phase 1 complete — 0 custom
redirects migrated.` rather than erroring.
:::

## doctor

Run a health check across the plugin's cron schedule, settings, and
database. Prints grouped results and exits non-zero on any **FAIL**, so
it slots into deployment scripts and CI tripwires.

```sh
wp 404-to-301 doctor [--format=<report|table|csv|json|yaml>]
```

### Sample output

```text
Cron
  [PASS] Hook 404_to_301_run_migration_chunk next runs 2026-06-05 14:20:00 (in 5 minutes).

Settings
  [FAIL] Invalid email recipient(s): not-an-email.
  [PASS] Default redirect URL parses cleanly (https://example.com/sitemap).

Database
  [PASS] Table wp_404_to_301_logs exists.
  [PASS] Table wp_404_to_301_redirects exists.
  [WARN] 12 log row(s) reference a redirect that no longer exists.
  [PASS] Redirect source hashes are unique.

Summary: 5 pass, 1 warn, 1 fail.
```

### What it checks

- **Cron** — every scheduled event whose hook starts with `404_to_301_`,
  with the next-run timestamp. Other prefixes can be added via the
  `404_to_301_doctor_cron_prefixes` filter so addon-owned events show
  up too.
- **Settings** — when notifications are enabled: recipient list is
  non-empty and every entry passes `is_email()`. When the default
  redirect is enabled: the destination URL parses (link mode) or the
  destination page exists and is published (page mode).
- **Database** — both plugin tables exist; no log rows reference a
  deleted redirect; no duplicate `source_hash` values on the redirects
  table.

### Exit codes

`0` on a clean bill of health (including WARN), `1` if any check
reports FAIL. WARN is a heads-up, not a failure — the count surfaces in
the summary line but doesn't trip the exit code.

### Extending it

Addons can register their own group via the `404_to_301_doctor_checks`
filter — see the [developer docs](/404-to-301/developer-docs#404_to_301_doctor_checks).
