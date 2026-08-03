---
title: Active Sessions
---

# Active Sessions

The **Active Sessions** add-on adds a new tab to the Loggedin admin that
lists every user with at least one live WordPress session — one row per
user, sortable and searchable — and a per-row modal that shows each of
their individual sessions (IP address, device, login time) with sign-out
buttons for one session at a time, or all at once.

Where the core plugin's
[Force Logout](/loggedin/force-logout) panel needs you to know the user
upfront and is all-or-nothing, this add-on gives you a discoverable list
and per-device control. Useful for membership sites, LMS courses, and any
install where an admin needs operational visibility into who is signed in
right now.

When active, the add-on adds a **Sessions** tab to
**Users → Loggedin**, sitting between **Settings** and **Addons**.

[[toc]]

::: warning Default session storage only
This add-on reads sessions from WordPress's default
`WP_User_Meta_Session_Tokens` storage backend (the one that ships with
core). Sites that replace the session manager via the
`session_token_manager` filter — uncommon, mostly large enterprise hosts
that use Redis or a custom store — will see a yellow notice at the top of
the tab and an empty or partial list. Custom-backend support may come in
a future release.
:::

## The Sessions tab

The tab renders a [DataViews](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dataviews/)
table with one row per user. Each row shows:

| Column | What it shows |
| --- | --- |
| **User** | Display name (with avatar). Falls back to the username when there's no display name. |
| **Username** | `user_login` value. |
| **Email** | `user_email` value. |
| **Role** | Translated role labels — comma-separated for multi-role users. |
| **Active sessions** | Count of live (non-expired) session tokens. |
| **Last login** | Date / time of the newest active session, in the site's date format. |
| **Last IP** | IP address recorded against the newest active session. |

Hide or reorder columns from the DataViews **View options** menu in the
top-right of the table. The view (sort, columns, page size, density) is
persisted to `localStorage` under `loggedin_active_sessions_view`, so
your preferences survive a reload.

### Search and sort

Type into the search box at the top of the table to free-text match
against username, email, and display name. Sortable columns:

- Username
- Email
- Active sessions
- Last login

The default sort is **Last login, newest first** — admins most often
arrive on this screen looking for "who's signed in right now," and
newest-first puts the freshest activity at the top.

### Pagination

The page size selector offers 10 / 25 / 50 / 100. The list endpoint
returns `X-WP-Total` and `X-WP-TotalPages` headers so DataViews drives
the pager directly from the response — no count query running on every
page change.

::: info Empty state
If nobody is signed in, the table shows an "No active sessions" empty
state — users appear here as soon as they log in. If your search /
filters hide every row, the empty state offers a **Clear filters**
button instead.
:::

## Viewing one user's sessions

Click the **⋮** menu on any row and pick **View sessions**. A modal opens
listing every active session that user holds, one section per session:

| Field | What it shows |
| --- | --- |
| **Device** | The user-agent string WordPress recorded at login. |
| **IP address** | The IP the session was started from. |
| **Signed in** | When the session was created. |
| **Expires** | When WordPress will stop honouring this token, with a "in X days/hours/minutes" hint. |

Sessions are listed newest-first.

### Sign out a single session

Click **Sign out** on a session section. The button flips to an inline
**Yes, sign out** / **Cancel** confirmation — click **Yes, sign out** to
destroy that single session token. The modal refreshes in place; the
list, the row's session count, and the row's "Last login" all update on
close.

::: info What the user sees
The user's other open tabs keep rendering the cached page until they make
their next request — at which point WordPress sees no matching token and
redirects them to wp-login. Pair this add-on with
[Real-time Logout](/loggedin/addons/realtime-logout) to shrink that
window to whatever polling interval you've configured.
:::

### Sign out every session for the user

The modal's footer has a **Sign out all sessions** button. Click it, then
confirm — every session token for that user is destroyed in one call,
same as the core plugin's Force Logout panel. The
[`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin_destroy_all_sessions)
action fires on success, so any audit-logging or webhook code you've
hooked already covers this path too.

## Bulk sign-out from the list

The table supports row selection. Tick one or more rows and use the
**Sign out all** bulk action in the action bar above the list. A
confirmation modal lists every user you're about to sign out; click the
destructive primary button to confirm.

Behind the scenes:

- Single-user selection → calls
  [`DELETE /loggedin/v1/active-sessions/{user}`](#delete-active-sessions-user).
- Multi-user selection → calls
  [`DELETE /loggedin/v1/active-sessions`](#delete-active-sessions) with
  a `user_ids` body.

Both paths fire `loggedin_destroy_all_sessions` once per user cleared.

## REST endpoints

The add-on registers its routes inside the parent plugin's
`loggedin/v1` namespace, so they share the same `manage_options`
capability gate and the same `X-WP-Nonce` requirement as every other
[Loggedin REST endpoint](/loggedin/developer-docs#rest-api).

### `GET /loggedin/v1/active-sessions`

List users with at least one live session. Paginated; the response
carries `X-WP-Total` and `X-WP-TotalPages` headers.

| Query param | Type | Default | Notes |
| --- | --- | --- | --- |
| `search` | string | _empty_ | Free-text match against login / email / display name. |
| `orderby` | string | `last_login` | One of `user_login`, `display_name`, `user_email`, `session_count`, `last_login`. Anything else is ignored. |
| `order` | string | `desc` | `asc` or `desc`. |
| `page` | integer | `1` | 1-indexed. |
| `per_page` | integer | `25` | Clamped 1–100. |

Each row carries `user_id`, `user_login`, `user_email`, `display_name`,
`roles`, `avatar_url`, `session_count`, `last_login`, `last_ip`.

### `GET /loggedin/v1/active-sessions/{user}`

Return every active session for a single user. The response shape:

```json
{
  "user": {
    "id": 7,
    "login": "jdoe",
    "display_name": "Jane Doe",
    "email": "jane@example.com",
    "avatar_url": "https://…"
  },
  "sessions": [
    {
      "token_hash": "abc123…",
      "login": 1719420000,
      "expiration": 1720629600,
      "ip": "203.0.113.4",
      "ua": "Mozilla/5.0 …"
    }
  ]
}
```

`token_hash` is the verifier WordPress keys the token by. The raw token
is never returned. Use the hash as the `{hash}` segment of the per-session
destroy endpoint below.

### `DELETE /loggedin/v1/active-sessions/{user}/{hash}`

Destroy one specific session for a user. The hash must be a 64-char
hex string (the route regex enforces this).

Response on success carries the user's refreshed `sessions` array so the
caller can re-render without an extra GET.

| Status | Code | Cause |
| --- | --- | --- |
| `404` | `loggedin_as_user_not_found` | No user with that id. |
| `404` | `loggedin_as_session_not_found` | The hash didn't match any active token for the user. |

### `DELETE /loggedin/v1/active-sessions/{user}`

Destroy every session for one user. Same effect as the core plugin's
Force Logout panel. Fires
[`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin_destroy_all_sessions).

### `DELETE /loggedin/v1/active-sessions`

Bulk-destroy every session for many users. Body:

```json
{ "user_ids": [7, 12, 88] }
```

Invalid / unknown ids are dropped silently; the response's `cleared`
array lists the user ids that were processed. Fires
`loggedin_destroy_all_sessions` once per successful clear.

## Hooks

### `loggedin_active_sessions_destroyed`

Fires after one single session is destroyed via the
`DELETE /loggedin/v1/active-sessions/{user}/{hash}` endpoint. Use it for
audit logging where the "all sessions" action is too coarse.

```php
do_action(
    'loggedin_active_sessions_destroyed',
    int $user_id,
    string $token_hash
);
```

```php
add_action(
    'loggedin_active_sessions_destroyed',
    function ( $user_id, $token_hash ) {
        error_log(
            sprintf(
                'Loggedin: admin destroyed session %s for user #%d',
                $token_hash,
                $user_id
            )
        );
    },
    10,
    2
);
```

::: info "Sign out all" reuses the parent's hook
The destroy-all paths (both single-user and bulk) fire the parent's
[`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin_destroy_all_sessions)
action, not a new add-on-specific one. Anything you've already hooked to
the core action automatically covers this add-on too.
:::

## Permissions

Every route is gated on `manage_options` — the same capability that
guards the parent's settings screen. There's no per-role override; if you
need a custom capability check, hook
[`user_has_cap`](https://developer.wordpress.org/reference/hooks/user_has_cap/)
and remove `manage_options` from the user before the request hits.

## Performance notes

The list view runs a single `SELECT user_id, meta_value FROM wp_usermeta
WHERE meta_key = 'session_tokens'` query, unserialises each row in PHP,
drops expired tokens, and applies search / sort / pagination on the
result. The row count is bounded by "users who have ever logged in" —
typically far fewer than total registered users on a site.

For installs past tens of thousands of users with active sessions this
becomes the bottleneck; a dedicated index table would replace the
unserialise-in-PHP path. It hasn't been needed yet — let us know if your
install is feeling it.

## Related

- [Force Logout](/loggedin/force-logout) — the core plugin's
  Force Logout panel. Single-user, all-or-nothing; this add-on is the
  discoverable / per-device counterpart.
- [Real-time Logout](/loggedin/addons/realtime-logout) — make a forced
  sign-out feel instant on the user's open tabs.
- [`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin_destroy_all_sessions)
  — the parent action this add-on fires on every destroy-all path.
- [`loggedin.admin.tabs`](/loggedin/developer-docs#loggedin-admin-tabs)
  — the JS filter the add-on uses to inject its tab into the admin.
