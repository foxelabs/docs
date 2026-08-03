---
title: General Settings
---

# General Settings

The **General** tab on the Settings page controls site-wide behaviour that
applies to every 404 the plugin sees. None of these options touches the
list of redirects or the log table directly — they shape how requests reach
those subsystems in the first place.

The tab is a single **Behaviour** panel with four toggles. Path
exclusions and settings import/export live on the
[Tools tab](/404-to-301/tools-settings).

[[toc]]

## Behaviour

### WordPress URL guessing

**Setting key:** `disable_guessing` &middot; **Default:** `Light`

WordPress tries to be helpful: when a URL doesn't match any post, it scans
your content for the closest matching slug and silently 301-redirects the
visitor there. Same code path (`redirect_canonical()`) also handles
trailing-slash, case-folding, and attachment-fallback redirects.

Three modes — pick the level of interference you want from the plugin.

| Mode | What it does |
| --- | --- |
| **Off** | Leave WordPress alone. All canonical redirects (closest-post, trailing slash, case fix, attachment fallback) keep firing. |
| **Light** (default) | Block only the closest-post guess. Trailing-slash, case-fix, and attachment fallback still work. The right default for most sites — 404s become accurate without breaking commonly-relied-on URL canonicalisation. |
| **Strict** | Bypass `redirect_canonical()` entirely. Every kind of WordPress URL guessing is off; only literal-match URLs resolve. |

::: tip Why this exists
WordPress's guessing makes 404 reporting unreliable. With guessing on, broken
links to `/about-uss` silently land on `/about-us` and never appear in your
logs even though they are mistakes you'd want to fix at the source. **Light**
fixes that without breaking the trailing-slash redirect that most themes
quietly rely on. Choose **Strict** only when you really do want the URL to
match literally — typically headless / API-driven sites.
:::

The plugin always honours the `?p=ID` shortlink form — direct post-ID
links keep working regardless of the mode.

### Monitor post slug changes

**Setting key:** `monitor_post_slug` &middot; **Default:** `Off`

When on, the plugin watches for post/page slug renames and automatically
creates a redirect from the old URL to the new one. The created redirect
appears in the Redirects list and behaves exactly like a manual entry —
you can edit it, disable it, or delete it later.

This is the easiest way to avoid 404s when you rename existing content.

### Mask IP addresses

**Setting key:** `mask_ip` &middot; **Default:** `Off`

Drops the visitor IP before it reaches the database. Logs are still
created, but the `ip` column stays empty. Useful for GDPR-conscious
deployments where you want 404 telemetry without the personally identifying
data.

The mask happens inside `Request::ip()`, so any downstream code that reads
the IP (custom filters, the email body, exported CSV rows) sees the empty
value too — there is no second copy to forget about.

### Track admin 404s

**Setting key:** `track_admin_404` &middot; **Default:** `Off`

By default the plugin does nothing on wp-admin requests — admin 404s are
almost always uninteresting (deleted admin pages, deprecated query
parameters, etc.) and they shouldn't pollute the log table or trigger
redirects.

Turn this on if you specifically want to log and act on admin-side 404s
too. When off, the dispatcher skips any request bound for the admin area —
both genuine `is_admin()` requests and 404s for paths under `/wp-admin/`
that fall through to the front controller (a missing file under
`/wp-admin/` is served as a normal front-end 404, where `is_admin()`
would otherwise be `false`).

::: tip Browsers cache 301s
If you change this setting and an admin URL still redirects, clear your
browser cache or test in a private window — a `301` returned earlier is
cached by the browser and keeps redirecting client-side regardless of the
new setting.
:::

## Moved to the Tools tab

**Exclude paths** and **Import / Export** used to live at the bottom of
this tab. They've moved to the new
[Tools tab](/404-to-301/tools-settings) so the General tab can stay
focused on plugin-wide behaviour toggles.
