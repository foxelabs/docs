---
title: Tools
---

# Tools

The **Tools** tab groups utilities that don't belong with the per-feature
configuration on the other tabs. Today it hosts three panels:

- **Exclude paths** — substrings to skip entirely (no log, no email, no redirect).
- **Import / Export** — move settings between sites as JSON.
- **Danger Zone** — destructive maintenance actions, currently the
  **Purge all logs** button.

[[toc]]

## Exclude paths

**Setting key:** `exclude_paths` &middot; **Default:** empty list

A repeater of substrings. Any 404 whose URL contains any of the listed
substrings is skipped entirely — no log row, no email, no redirect.

Use it for traffic you know you don't care about:

- `/wp-json/` — REST probes from bots and integrations.
- `/feed/` — defunct RSS endpoints.
- `.well-known/` — robots.txt-style discovery probes.
- `/xmlrpc.php` — legacy XML-RPC noise.

The match is a simple `strpos()` substring check (the URL is normalised
first), not a regex. Empty rows are dropped at save time, so adding a row
to type into and leaving it blank is safe.

::: info How matching works
The check runs in `Request::is_excluded()` and is called at the top of
every action in the chain — Log, Email and Redirect each ask the request
whether it's excluded before doing any work. That means an excluded URL
truly costs the plugin nothing past the substring scan.
:::

## Import / Export

Two buttons:

- **Download settings** — saves every user-facing setting to a JSON
  file. The filename includes the site host and the date so staging
  and production files don't collide in your Downloads folder.
- **Import settings…** — pick a previously-exported JSON file. The
  page reloads once the new values are applied so every tab on the
  Settings page reflects the imported state.

The exporter strips install-specific keys (database versions, migration
flags) before writing the file, and the importer ignores them on the
way in. That keeps the exchange safe between sites at different
upgrade points.

::: tip Staging to production sync
Edit on staging, export, import on production. Addon settings stored
inside the plugin's option are carried automatically — they share the
same envelope.
:::

For the REST surface behind these buttons (and for the
`404_to_301_settings_export` / `…_import` filters), see the
[Developer docs](/404-to-301/developer-docs#settings-import-export).

## Danger Zone

A separate panel at the bottom of the tab for destructive maintenance
actions. Today it has one button:

### Purge all logs

Deletes **every row** from the `wp_404_to_301_logs` table in one shot.
Clicking the button opens a confirmation modal so accidental clicks
don't immediately wipe data — you have to explicitly approve before the
purge runs.

What gets removed:

- Every recorded 404 log row, regardless of status (Open, Ignored,
  Fixed) or whether it has a linked custom redirect.

What is **not** touched:

- Your custom redirects. Those live in a separate table (`wp_404_to_301_redirects`)
  and are untouched by this action.
- Your settings — exclude paths, log/email/redirect settings, addons.

::: danger This is permanent
The action issues a `TRUNCATE` on the logs table. There is no undo and
no row-level deletion event for addons to listen to. If you want an
archive before clearing, run the
[Logs Exporter](/404-to-301/addons/logs-exporter) add-on first.
:::

::: tip For routine pruning, use Logs Cleaner instead
Purge all logs is a one-shot maintenance action. For ongoing automatic
pruning (delete rows older than N days, cap the table at N rows, run on
a schedule), the **[Logs Cleaner](/404-to-301/addons/logs-cleaner)**
add-on is the better fit.
:::

## Add-ons on this tab

When the **[Redirects Importer](/404-to-301/addons/redirects-importer)**
add-on is active it adds an **Import redirects** panel here — bulk-import
custom redirects from a CSV file, or migrate them in from another redirect
plugin (Redirection by John Godley, 301 Redirects – Redirect Manager by
WebFactory) without re-entering each rule by hand. See the
[Add-ons](/404-to-301/addons/) section for the full list.
