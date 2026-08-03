---
title: Redirects
---

# Redirects

The **Redirects** page in wp-admin manages the list of per-URL redirects.
Each row tells the plugin: "when a request comes in for this source URL,
send the visitor to this destination using this HTTP status."

Custom redirects always win over the
[global fallback](/404-to-301/redirect-settings), and they fire for any
matching URL — including a page that still exists but you've chosen to
retire. Only logging and the global fallback are reserved for genuine 404s.

- **This page** — the list view, adding/editing rows, bulk actions, and the
  audit trail.
- **[Match modes & query handling](/404-to-301/redirects/matching)** — how a
  source is compared to the incoming request (Exact / Prefix / Regex) and
  how query strings are handled.

[[toc]]

## Summary cards

A strip of cards above the table shows the aggregate state at a glance:
**Total**, **Active**, **Inactive**, and **Total hits** (the sum of the
`Hits` column across every row). They refresh whenever you create, edit
or delete a redirect.

## The list view

Each row in the table shows:

| Column | What it means |
| --- | --- |
| **Source URL** | The URL (path) that triggers the redirect. |
| **Destination** | Where matching requests are sent. |
| **Type** | HTTP status code (`301`, `302`, `307`). |
| **Match** | How `Source URL` is compared to the request (`Exact`, `Prefix`, or `Regex`). |
| **Status** | Whether the row is `Active` or `Disabled`. Disabled rows are skipped during the lookup. |
| **Hits** | Number of times this redirect has fired. |
| **Last hit** | When it last fired. |
| **Created** | When the row was created. |

Use the search bar above the table to filter by source URL. The list
paginates once you have more than a screen's worth of rows.

## Adding a redirect

Click **Add new** to open the editor.

### Source URL

The URL (or pattern) the plugin looks for. A site-relative path beginning
with `/` — the host is implicit. A leading slash is added automatically if
you omit it, and a pasted full URL is reduced to its path, so `old-page`,
`/old-page`, and `https://example.com/old-page` all store the same rule.

Examples:

- `/old-product` — single-URL redirect.
- `/blog/2018/` — a prefix or regex when paired with the matching mode.

### Destination

Where matching requests are sent. Three forms are accepted:

- **An absolute URL** — `https://example.com/landing` — external or
  internal, scheme required. External hosts are honoured.
- **A site-relative path** — `/new-product` — resolved against your site URL.
- **A page** — set the target type to `page` and choose a page; the plugin
  resolves the permalink at redirect time, so the destination follows the
  page even if its slug changes later.

### Type

HTTP status code used for the redirect.

- **`301` Moved Permanently** — the default, and the right SEO answer for
  pages that have moved or been removed.
- **`302` Found** — temporary move, search engines keep the source URL.
- **`307` Temporary Redirect** — like 302 but the request method is
  preserved. Rarely needed for content redirects.

You can also use the **terminal** status codes **`410` Gone** and **`451`
Unavailable for Legal Reasons**: these don't send the visitor anywhere —
they return the status with an empty body, telling clients (and search
engines) the URL is intentionally dead.

### Match

How the source is compared to the request — `Exact` (default), `Prefix`, or
`Regex`. See **[Match modes & query handling](/404-to-301/redirects/matching)**
for the full behaviour of each mode and the query-string options.

### Status

`Active` rows are evaluated on every request. `Disabled` rows are skipped —
use this to take a redirect out of rotation without deleting it.

## Editing and deleting

Click the row's overflow menu (the three dots) to edit, disable, or delete
it.

When you edit a redirect that is **linked to a 404 log**, the **Source
URL** field is locked — changing it would break the link between the
redirect and the log. A small info notice under the field explains why.
Every other field stays editable. If you really need to change the
source, unlink the log first (delete the log, or delete the redirect and
recreate it).

Deleting is permanent — the row is removed from the database, and any
log rows that referenced it are **automatically unlinked**: their
`redirect_id` is cleared and the workflow status is reset to **Open** so
the broken URL surfaces again for review.

## Audit trail

Every create / update / delete on a redirect records the WordPress user
who made the change. To see it in the table, open the DataViews **Fields**
picker (the column toggle in the table header) and enable **Last edited
by** — it's hidden by default so single-author sites don't see an empty
column. CLI and cron writes leave the field blank, which is rendered as
a dash.

## Promoting a log entry to a redirect

The fastest way to fix a known broken URL is to redirect it directly from
the Logs page. Open the log row's menu and choose **Custom redirect** —
the source URL is pre-filled (and locked) and you only need to enter the
destination. If the log already has a linked redirect, the same action
opens it in edit mode instead. See the
[Logs actions](/404-to-301/logs/actions) for the full action list.

::: info Linking and the workflow status
When you save the redirect, the linked log's status is set to **Fixed**
only if the redirect is **Active**. If the redirect is **Inactive** at
save time, or if you later toggle it off, the linked log(s) flip back to
**Open** automatically so the broken URL resurfaces. Re-activating syncs
them back to Fixed.
:::

## Bulk actions

Select rows with the checkboxes in the leftmost column and a bulk-actions
toolbar appears at the bottom of the table. Apply one of these to every
selected row in a single round-trip:

- **Activate** — turn the selected redirects on.
- **Deactivate** — turn the selected redirects off without deleting them.
- **Delete** — remove the selected rows permanently.

Activate / Deactivate are useful for staging cutovers — pre-create a batch
of redirects in the deactivated state, then flip them all on at go-live.

## Bulk importing

To create many redirects at once — from a CSV file or migrated from another
redirect plugin (Redirection by John Godley, 301 Redirects – Redirect
Manager by WebFactory) — install the
**[Redirects Importer](/404-to-301/addons/redirects-importer)** add-on,
which adds an import panel to the [Tools tab](/404-to-301/tools-settings).

## REST API

Every action available in the UI maps to a REST endpoint under
`/wp-json/d404/v1/redirects`. The endpoints require the capability returned
by the [`404_to_301_capability`](/404-to-301/developer-docs#404_to_301_capability)
filter (defaults to `manage_options`).
