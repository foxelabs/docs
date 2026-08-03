---
title: WP-CLI
---

# WP-CLI

Loggedin ships a set of [WP-CLI](https://wp-cli.org/) commands so you can
inspect and clear user sessions, and read or change plugin settings,
without opening wp-admin. Useful for bulk operations, deploy scripts,
support workflows and headless installs.

Available since **3.1.0**. No configuration or extra install is needed —
the commands register themselves when the plugin is active. They are
wired only on WP-CLI requests, so they add nothing to the cost of a
normal page load.

[[toc]]

## Command overview

```bash
wp loggedin sessions list <user>      # Active sessions for a user
wp loggedin sessions count <user>     # Number of active sessions
wp loggedin sessions destroy <user>   # Sign a user out

wp loggedin settings list             # Every setting and its value
wp loggedin settings get <key>        # Read one setting
wp loggedin settings set <key> <value># Write one setting
```

Run `wp help loggedin`, or `wp help loggedin sessions list` for any
individual command, to see the same reference from your terminal.

## Identifying a user

Every `sessions` command takes a `<user>` argument that accepts three
forms — the same ones the [Force Logout](/loggedin/force-logout) panel
accepts:

| Input looks like | Looked up as |
| --- | --- |
| Digits only (e.g. `42`) | User ID |
| Contains an `@` (e.g. `user@example.com`) | Email address |
| Anything else (e.g. `jdoe`) | `user_login` |

If nothing matches, the command exits with an error and changes nothing.

## `wp loggedin sessions list`

Lists the user's active sessions, newest first.

```bash
wp loggedin sessions list <user> [--field=<field>] [--fields=<fields>] [--format=<format>]
```

| Option | Description |
| --- | --- |
| `--field=<field>` | Print only this field's value for each session. |
| `--fields=<fields>` | Comma-separated columns to show. Default: `token,login,expiration,ip,ua` |
| `--format=<format>` | `table` (default), `csv`, `json`, `yaml`, `count`, `ids` |

Columns:

| Column | Description |
| --- | --- |
| `token` | Hashed session token. Identifies the session for a single-session destroy. The raw token is never exposed. |
| `login` | When the session was created, in your site's timezone. |
| `expiration` | When WordPress will consider the session expired. |
| `ip` | IP address recorded at login. |
| `ua` | User-agent string recorded at login. |

```bash
$ wp loggedin sessions list editor@example.com
+------------------+---------------------+---------------------+-----------+------------------+
| token            | login               | expiration          | ip        | ua               |
+------------------+---------------------+---------------------+-----------+------------------+
| a69662435664c6.. | 2026-07-29 09:01:18 | 2026-07-31 09:01:18 | 203.0.113.9 | Mozilla/5.0 ... |
+------------------+---------------------+---------------------+-----------+------------------+
```

Expired-but-not-yet-deleted tokens are filtered out. WordPress only
prunes those when the user next signs in, so the raw database row is not
a reliable "currently logged in" list — this command is.

::: tip Scripting
`--field=token` prints one token hash per line, ready to feed into a
follow-up `destroy --token=` call.
:::

## `wp loggedin sessions count`

Prints just the number of active sessions — handy in conditionals.

```bash
$ wp loggedin sessions count 42
3
```

Unlike `list`, this reads through the `WP_Session_Tokens` API, so it
stays accurate on sites using a custom session backend.

## `wp loggedin sessions destroy`

Destroys sessions, signing the user out. Without `--token`, **every**
session for the user is destroyed — the CLI equivalent of the
[Force Logout](/loggedin/force-logout) panel.

```bash
wp loggedin sessions destroy <user> [--token=<hash>] [--yes]
```

| Option | Description |
| --- | --- |
| `--token=<hash>` | Destroy only this one session. Take the value from the `token` column of `sessions list`. |
| `--yes` | Skip the confirmation prompt. Required in unattended scripts. |

```bash
# Sign a user out everywhere.
$ wp loggedin sessions destroy editor@example.com --yes
Success: Destroyed 3 session(s) for editor.

# Sign a user out of one device only.
$ wp loggedin sessions destroy 42 --token=a69662435664c6... --yes
Success: Destroyed 1 session for editor.
```

Destroying all sessions fires
[`loggedin_destroy_all_sessions`](/loggedin/developer-docs#loggedin_destroy_all_sessions),
the same action the admin panel fires, so add-ons and custom code see
both paths. A single-session destroy fires
[`loggedin_destroy_session`](/loggedin/developer-docs#loggedin_destroy_session)
instead.

::: warning `--token` with an empty value is rejected
`wp loggedin sessions destroy 42 --token=$TOKEN` where `$TOKEN` is unset
would otherwise silently destroy *all* of the user's sessions. The
command errors out instead. Drop the flag entirely when you mean "all".
:::

## `wp loggedin settings list`

Prints every setting and its current value.

```bash
$ wp loggedin settings list
+---------+-------+
| key     | value |
+---------+-------+
| maximum | 3     |
| logic   | block |
+---------+-------+
```

Supports `--format=table|csv|json|yaml`. Settings registered by add-ons
through
[`loggedin_settings_defaults`](/loggedin/developer-docs#loggedin_settings_defaults)
appear here automatically.

## `wp loggedin settings get`

```bash
$ wp loggedin settings get maximum
3
```

An unknown key errors out and lists the valid keys.

## `wp loggedin settings set`

```bash
$ wp loggedin settings set maximum 3
Success: Updated maximum to 3.

$ wp loggedin settings set logic block
Success: Updated logic to block.
```

Valid values for `logic` are `allow` (Logout All), `logout_oldest`
(Logout Oldest) and `block` (Block New) — see
[General Settings](/loggedin/general-settings) for what each mode does.

Writes go through the same sanitizer as the REST API and the admin UI,
and a value the sanitizer would reject or alter is refused **before**
anything is written:

```bash
$ wp loggedin settings set logic nonsense
Error: "nonsense" is not a valid value for logic. Nothing was changed.
```

This matters more than it looks: without the check, a typo would store
the *default* mode instead, quietly loosening the limit on a site that
was deliberately set to Block New.

## Session storage support

Two commands read the session store directly, because the WordPress API
has no way to address one specific session:

| Command | Custom session backend (Redis, Memcached, …) |
| --- | --- |
| `sessions count` | ✅ Works |
| `sessions destroy` (all) | ✅ Works |
| `sessions list` | ⚠️ Needs the default user-meta storage |
| `sessions destroy --token=` | ⚠️ Needs the default user-meta storage |

On a site with a custom backend, `sessions list` prints a warning
explaining that the list may be empty or incomplete, and
`destroy --token=` errors out and points you at the destroy-all form.
This mirrors the [Logout Oldest](/loggedin/general-settings) mode's
constraint.

## Recipes

**Sign out everyone in a role** — e.g. after revoking access:

```bash
wp user list --role=subscriber --field=ID | while read -r id; do
  wp loggedin sessions destroy "$id" --yes
done
```

**Tighten the limit during an incident, then restore it:**

```bash
wp loggedin settings set logic block
wp loggedin settings set maximum 1
# ... later ...
wp loggedin settings set maximum 3
```

**Find accounts that look shared** — more sessions than your cap:

```bash
wp user list --field=ID | while read -r id; do
  count=$(wp loggedin sessions count "$id")
  [ "$count" -gt 3 ] && echo "user $id has $count sessions"
done
```

::: tip Doing this in the browser instead
The [Active Sessions](/loggedin/addons/active-sessions) add-on gives you
the same cross-user view as a sortable admin screen, including per-device
detail and one-click sign-out.
:::

## Extending

Add-ons can register their own subcommands under the `wp loggedin`
namespace on the
[`loggedin_cli_init`](/loggedin/developer-docs#loggedin_cli_init) action,
which fires after the core commands are registered.

```php
add_action( 'loggedin_cli_init', function () {
    WP_CLI::add_command( 'loggedin my-addon', My_Addon_Command::class );
} );
```
