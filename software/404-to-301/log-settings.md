---
title: Log Settings
---

# Log Settings

The **Logs** tab on the Settings page controls what the Log action records
when a 404 fires. These toggles don't affect already-saved logs — they
decide what gets written from this point forward.

[[toc]]

## Log 404 errors

**Setting key:** `logs_enabled` &middot; **Default:** `On`

The master switch. When off, the Log action becomes a no-op: nothing is
written, the hit counter doesn't increment, and the
[Logs page](/404-to-301/logs/) stops gaining new rows.

The Redirect action still runs even with logging off. Disable this when you
care about redirecting broken URLs but not about archiving the misses.

::: warning Hit counter and notifications
The Notifications subsystem reads the per-URL `hits` counter to decide
whether to send an email. With logging disabled the counter never
advances, so notifications effectively stop too.
:::

## Skip search engine bots

**Setting key:** `logs_skip_bots` &middot; **Default:** `On`

Crawlers issue an unusual amount of 404 traffic — abandoned URLs from
years ago, fuzzed paths, third-party link probes. Most of it is noise.

When this toggle is on, requests whose `User-Agent` matches the plugin's
crawler heuristic (the usual `bot`, `spider`, `slurp`, etc. tokens) are
skipped before the log row is written. The classification runs through the
`404_to_301_is_human` filter, so custom UA rules can override it — see the
[developer docs](/404-to-301/developer-docs#404_to_301_is_human).

Keeping this on is the easiest way to stop the log table ballooning on
public sites.

## Skip duplicate URLs

**Setting key:** `logs_skip_duplicates` &middot; **Default:** `Off`

Changes how repeat hits on the same URL behave.

- **Off** (default) — the first 404 on a URL creates a row; every later
  404 on the same URL bumps that row's `hits` counter and updates
  `last_hit`. This is the most informative mode: you can see which broken
  URLs are popular.
- **On** — only the first 404 on a URL is recorded. Subsequent hits are
  ignored entirely.

Turn this on when you only need a checklist of distinct broken URLs and
don't care which is hit most often.

## What about pruning old logs?

The core plugin records logs but doesn't delete them automatically. For
that, install the free **Logs Cleaner** add-on (advertised at the bottom
of this tab when not active): it adds size-based, age-based and scheduled
pruning so the log table stays small on its own. See the
[Logs Cleaner add-on docs](/404-to-301/addons/logs-cleaner).
