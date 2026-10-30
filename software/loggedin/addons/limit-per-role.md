---
description: "Set a different concurrent session limit for each WordPress user role with the Loggedin Limit Per Role add-on."
title: Limit Per Role
---

# Limit Per Role

The **Limit Per Role** add-on lets you set a concurrent-session cap per
WordPress user role. Instead of applying one global number to every user
on the site, you can give administrators more headroom while keeping
subscribers and customers on a tighter cap — or vice versa.

The add-on adds a **Limits per role** card to the **Login limits** page:
**Users → Loggedin → Settings › Login limits**, below the core cards.
Once it's active, the "Need a different limit for some roles?" line under
**Maximum active sessions** goes away.

::: info Version 2.2.0 and later
Limit Per Role 2.2.0 is the first version built for the settings screen
in Loggedin 3.4.0. Older versions still work: their panel is shown as a
card on **Login limits**, and Loggedin lists the add-on in a notice asking
you to update it. With Loggedin older than 3.4.0, 2.2.0 keeps its old
**Limit Per Role** panel on the **Settings** tab, so you can update the
add-on and Loggedin in either order. This page describes 2.2.0.
:::

[[toc]]

## How it works

The card's description sums up the two rules:

> Roles not listed here use the maximum above, and a user with more than
> one listed role gets the highest of their limits.

Below it is a table with one row per role that has its own limit. Roles
not in the table use the global **Maximum active sessions**.

## Adding a role

Click **Add a role**. A new row appears with the first role not yet in
the table and a **Maximum active sessions** field, which starts at the
global maximum. Change the role in the picker if you need another one,
and set its limit. A role already in the table isn't offered again, and
**Add a role** goes away once every role has a row.

## Limit

**Setting key:** `loggedin_limit_per_role_limits[<role_slug>]` &middot;
**Default:** *unset (use the global limit)*

The number of sessions a user with that role may hold. The smallest value
is `1`; anything lower shows "Enter a whole number, 1 or more." and blocks
**Save** until it's fixed.

To send a role back to the global limit, remove its row with the **×**
button at its end. Removed roles
are dropped from the stored map entirely; they don't persist as `0`. The
full option (`loggedin_limit_per_role_limits`) is stored as a
`{ role_slug: int }` map.

## Multi-role users — "highest wins"

WordPress users can have more than one role at a time. When a multi-role
user logs in, this add-on collects every configured limit that applies to
any of their roles and takes the **highest** number as their cap. Code
can choose differently: see [Choosing a different rule](#choosing-a-different-rule).

| Roles held by user | Configured limits | Effective cap |
| --- | --- | --- |
| Subscriber | 2 | 2 |
| Editor + Shop Manager | 3, 5 | **5** (highest) |
| Editor only | 3 | 3 |
| Author (no custom limit configured) | — | Global limit |

The rule is intentionally permissive rather than restrictive: a user with
a more "open" role attached to their account isn't surprised by a tighter
cap inherited from a sibling role.

### Choosing a different rule

The `loggedin_limit_per_role_limit` filter picks the cap for a user who
holds at least one role with a configured limit.

```php
apply_filters( 'loggedin_limit_per_role_limit', int $limit, int $user_id, array $matched );
```

| Parameter | Type | Description |
| --- | --- | --- |
| `$limit` | int | The cap that applies: the highest value in `$matched`. |
| `$user_id` | int | User being checked. |
| `$matched` | array | Limits of the user's roles that have one, keyed by role slug. |

To apply the lowest limit instead:

```php
add_filter( 'loggedin_limit_per_role_limit', function ( $limit, $user_id, $matched ) {
    return min( $matched );
}, 10, 3 );
```

A value below `1` is ignored, and the highest limit applies. The filter
doesn't run for users with no configured role limit; they keep the
global limit.

Since 2.2.0.

## How the cap is enforced

The add-on hooks the parent plugin's
[`loggedin_reached_limit`](/loggedin/developer-docs#loggedin-reached-limit)
filter at priority `10`. It overrides the global verdict whenever the user
holds at least one role with a configured limit.

The selected [login logic](/loggedin/general-settings#login-logic) still
applies — only the numeric cap changes.

## Priority over other add-ons

If you run both this add-on and **Limit Per User**, per-user overrides
win:

| Source | Priority on `loggedin_reached_limit` |
| --- | --- |
| Limit Per Role | `10` |
| Limit Per User | `11` |

Per-user > per-role > global. The per-user filter runs later and can
override whatever this add-on decided.

## Saving

Edits don't persist until you click **Save** in the page header. It saves
every pending change on the screen, this card and the core settings
alike, in one request. See [Saving](/loggedin/general-settings#saving).

## Behaviour with custom roles

The role list is built from `wp_roles()->get_names()`, so any role
registered by another plugin or by your theme appears automatically. If
you delete a custom role after configuring a limit for it, its row stays
in the table, showing the role's slug, and the limit no longer applies to
anyone. The next time you save a change to this card, the orphaned entry is dropped
from the stored map (the sanitiser skips role slugs that aren't currently
registered).

## Related

- [Login Limits](/loggedin/general-settings) — global fallback limit.
- [Auto logout](/loggedin/auto-logout#timeouts-per-role) — idle timeouts
  per role, where the *shortest* wins.
- [Limit Per User](/loggedin/addons/limit-per-user) — per-user override
  (wins over this add-on).
- [`loggedin_reached_limit`](/loggedin/developer-docs#loggedin-reached-limit)
  — the underlying filter.
