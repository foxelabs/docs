---
title: Match Modes & Query Handling
---

# Match Modes & Query Handling

Each redirect row decides **how** its source URL is compared to an incoming
request, and **what** to do with the query string. Both are set per row in
the redirect editor. This page covers the behaviour of every mode.

For the rest of the editor fields (destination, type, status) and the list
view, see [Redirects](/404-to-301/redirects/).

[[toc]]

## Match modes

How the source URL is compared to the incoming request.

| Mode | What it does | Example |
| --- | --- | --- |
| **Exact** | Only the literal source URL triggers the redirect. The default. URLs are normalised before matching — trailing slashes, query strings, percent-encoding, and casing don't fragment a match. `/old-product`, `/Old-Product/`, `/old-product?ref=x`, and `/old%2Dproduct` all hit the same row. (See [Query string](#query-string-handling) to opt out of the query strip.) | `/old-product` |
| **Prefix** | Any URL that starts with the source triggers the redirect, and the remainder of the path is preserved if the destination supports it. | `/blog/2018/` matches `/blog/2018/launch` and `/blog/2018/anything-else`. |
| **Regex** | The source is treated as a PHP regular expression (without delimiters). Most flexible, also the most expensive — use sparingly on busy sites. | `^/news/\d{4}/(.*)$` |

::: warning Test regex on staging first
A malformed regex is caught and the row is skipped at lookup time, but a
regex that matches more than you intended can silently redirect live
traffic. Always test regex sources on a staging site before going live.
:::

## URL normalisation

Before an **Exact** or **Prefix** source is compared (or hashed for
storage), both the stored source and the incoming request are run through
the same normalisation so the two always line up:

- The query string is stripped (unless the row uses **Require** — see below).
- The path is percent-decoded (`/old%20page` → `/old page`).
- A trailing slash is removed (except on the root).
- The result is lowercased.
- It's made relative to your site's home path, so on a subdirectory install
  a source typed as `/old-page` still matches the real request
  `/subdir/old-page`.
- A leading slash is guaranteed, and a pasted full URL is reduced to its
  path.

This is why `old-page`, `/old-page/`, `/Old-Page`, and
`https://example.com/old-page` all resolve to the same rule. Developers can
override the policy with the
[`404_to_301_normalize_url`](/404-to-301/developer-docs#404_to_301_normalize_url)
filter.

## Query string handling

Controls how the query string on the incoming request affects the rule.
Set per redirect, defaulting to **Ignore**.

| Mode | What it does |
| --- | --- |
| **Ignore** | Query is stripped before matching and not forwarded to the destination. `/old?utm=x` and `/old?utm=y` both match a row stored as `/old`. The default. |
| **Preserve** | Match like Ignore, but append the request's query string to the destination — useful for keeping `utm_*`, `gclid`, and other tracking params alive across the redirect. If the destination has its own query, the destination's keys win on collision. |
| **Require** | Query string is part of the match. The row's `source` includes `?…`, and only requests with exactly that query trigger the rule. Lets `/promo?code=summer` and `/promo?code=winter` coexist as two separate redirects. Only meaningful for **Exact** match. |

## Resolution order

When a request comes in, the plugin resolves a match in this order and
returns the first hit:

1. **Exact** — a single indexed lookup on the normalised source hash.
2. **Prefix** — the active prefix rules are scanned for one whose source is
   a prefix of the request.
3. **Regex** — the active regex rules are tested against the request.

Exact is effectively free; prefix and regex scan the active rule set in PHP,
so keep regex rules to a minimum on high-traffic sites.
