---
title: Limit Per Role
---

# Limit Per Role

The **Limit Per Role** add-on lets you set a concurrent-session cap per
WordPress user role. Instead of applying one global number to every user
on the site, you can give administrators more headroom while keeping
subscribers and customers on a tighter cap — or vice versa.

The add-on adds its own panel to the parent plugin's settings screen.
Open **Users → Loggedin → Settings** — the **Limit Per Role** panel sits
between the General Settings and the Force Logout panels.

[[toc]]

## How it works

A short notice at the top of the panel surfaces the two rules to keep in
mind:

> Roles without a custom limit use the global setting above. If a user
> has multiple roles with custom limits, the highest one applies.

Below the notice is the role list itself — each registered WordPress role
on your site (built-in or custom) gets one row with two controls.

## Enable checkbox

**Input:** Checkbox per role

Toggles whether a role has a custom limit at all.

- **Unchecked** — no override; users with this role use the global limit.
- **Checked** — the number input becomes editable and the role uses the
  custom limit.

## Limit input

**Setting key:** `loggedin_limit_per_role_limits[<role_slug>]` &middot;
**Default:** *unset (use the global limit)*

A number input visible (or active) once the role's checkbox is enabled.
Minimum is `1`; non-positive values are stripped at save.

Roles you've unchecked are removed from the stored map entirely — they
don't persist as `0`. The full option (`loggedin_limit_per_role_limits`)
is stored as a `{ role_slug: int }` map.

## Multi-role users — "highest wins"

WordPress users can have more than one role at a time. When a multi-role
user logs in, this add-on collects every configured limit that applies to
any of their roles and takes the **highest** number as their cap.

| Roles held by user | Configured limits | Effective cap |
| --- | --- | --- |
| Subscriber | 2 | 2 |
| Editor + Shop Manager | 3, 5 | **5** (highest) |
| Editor only | 3 | 3 |
| Author (no custom limit configured) | — | Global limit |

The rule is intentionally permissive rather than restrictive: a user with
a more "open" role attached to their account isn't surprised by a tighter
cap inherited from a sibling role.

## How the cap is enforced

The add-on hooks the parent plugin's
[`loggedin_reached_limit`](/loggedin/developer-docs#loggedin_reached_limit)
filter at priority `10`. It overrides the global verdict whenever the user
holds at least one role with a configured limit.

The selected [Login Logic](/loggedin/general-settings#login-logic) still
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

Edits don't persist until you click **Save Changes** at the bottom of the
Settings tab. The Save button flushes every pending edit on the page —
both this panel and the General Settings — in a single REST round-trip.

## Behaviour with custom roles

The role list is built from `wp_roles()->get_names()`, so any role
registered by another plugin or by your theme appears automatically. If
you delete a custom role after configuring a limit for it, the next save
drops the orphaned entry from the stored map (the sanitiser skips role
slugs that aren't currently registered).

## Related

- [General Settings](/loggedin/general-settings) — global fallback limit.
- [Limit Per User](/loggedin/addons/limit-per-user) — per-user override
  (wins over this add-on).
- [`loggedin_reached_limit`](/loggedin/developer-docs#loggedin_reached_limit)
  — the underlying filter.
