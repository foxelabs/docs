---
description: "Keep administrators out of the Loggedin session limit, set the blocked-login message, let blocked users sign out their other devices by email, and tell signed-out devices why."
title: Lockout & Recovery
---

# Lockout & Recovery

The **Lockout & recovery** page — **Users → Loggedin → Settings ›
Lockout & recovery** (`&tab=lockout`) — decides who the limit leaves
alone, what a blocked person sees and can do, and what a device signed
out by a newer login is told.

It has three cards:

- **Administrators** — leave the people who run the site out of the
  limit.
- **Blocked logins** — the message Block New shows, and self-unlock by
  email.
- **Signed out by a newer login** — where a device signed out by Logout
  Oldest or Logout All is sent.

Every setting here is saved with the page header's **Save**, like the
rest of the [settings screen](/loggedin/general-settings#saving).

[[toc]]

## Administrators

### Don't limit administrators

**Setting key:** `exempt_admins` &middot; **Default:** on for new
installs, off for sites updated from before 3.4.0

Users who can manage the site (the `manage_options` capability) can sign
in on any number of devices, and are never signed out by the limit. This
applies under every mode, so an administrator is never locked out of
their own site by Block New.

The exemption is the default value of the
[`loggedin_bypass`](/loggedin/developer-docs#loggedin-bypass) filter. Code
on that filter still has the last word, either way.

::: info Updated from an earlier version?
A site updating from before 3.4.0 keeps limiting administrators, so
nothing changes under it. Its administrators see a one-time notice on
the Loggedin screen, **Stop limiting administrators?**, with two
buttons:

- **Don't limit administrators** turns the setting on.
- **Keep limiting them** leaves it off.

Either answer removes the notice for good. So does turning the setting
on from this page.
:::

## Blocked logins

These settings are used by [Block New](/loggedin/general-settings#block-new).
While another mode is selected, the card says nobody is blocked right
now. You can still change them, ready for when you switch.

### Message

**Setting key:** `message` &middot; **Default:** empty (use the built-in
message)

The error shown on the login screen when Block New refuses a login.
Leave it empty to use the built-in message, which the empty field shows
as a placeholder:

> You've reached the maximum number of active logins for this account.
> Please log out from another device to continue.

A link, bold and italics are allowed (`<a href>`, `<strong>`, `<em>`).
Any other HTML is removed when you save.

::: tip The filter still wins
The [`loggedin_error_message`](/loggedin/developer-docs#loggedin-error-message)
filter runs after this setting. If you already change the message in
code, that code keeps working, and it overrides whatever is typed here.
:::

### Let blocked users sign out their other devices {#let-blocked-users-sign-out-their-other-devices}

**Setting key:** `unlock` &middot; **Default:** on for new installs, off
for sites updated from before 3.4.0

The biggest problem with Block New is the person who closed a browser
without logging out, then can't sign in anywhere else. With this on,
they can get themselves back in without an administrator.

The blocked-login error offers to email a link. Opening that link signs
the account out of every device, and the person logs in again.

#### How it works, step by step

1. **The login is refused.** The person types the right username and
   password, and Block New refuses the login. After your message, the
   error adds a link: **Email me a link to sign out my other devices.**
   The link only appears after the right password, and only when the
   account has a valid email address.
2. **They ask for the email.** Clicking the link sends an email to the
   account's address, and the login screen says:
   "Check your email. The link in it signs you out of your other
   devices, so you can log in here."
3. **The email arrives.** Its subject is
   **[Site title] Sign out of your other devices**. It names the
   account, explains that it is signed in on as many devices as the
   site allows, and gives a link to open within 15 minutes. It also
   says that if this wasn't them, nothing changes and they should change
   their password.
4. **They open the emailed link.** Every session the account has ends.
   The login screen says: "You were signed out of your other devices.
   Log in again."
5. **They log in.** With no other sessions left, the login goes through.

Other messages the login screen can show:

| When | Message |
| --- | --- |
| A link was emailed less than 5 minutes ago | We emailed you a link a few minutes ago. Check your email, or try again in a few minutes. |
| A link is expired or already used | That link has expired or was already used. Log in again to get a new one. |
| The site couldn't send the email | The email could not be sent. Ask the site's administrator to sign you out of your other devices. |

#### Why it's safe

- **Two proofs.** The person needs the password to see the first link,
  and access to the account's mailbox to get the second. A leaked
  password alone can't be used to sign the owner out everywhere.
- **Short-lived, single-use links.** Each link carries its own random
  key. A key works once and expires after **15 minutes**. A new key
  replaces the previous one of the same kind.
- **Stored as hashes.** Keys are kept only as SHA-256 hashes, in their
  own user meta rows (`loggedin_unlock_request` and `loggedin_unlock`),
  never in `session_tokens`. A wrong key doesn't use up the real one.
- **One email per 5 minutes.** At most one unlock email goes to a user
  in any five minutes (`loggedin_unlock_sent` holds the time of the
  last one).

::: warning Your site must be able to send email
The unlock email goes through `wp_mail()`. If your site's mail doesn't
reach inboxes, the link never arrives. Test it, or use an SMTP plugin.
:::

For developers: the email can be changed with
[`loggedin_unlock_email`](/loggedin/developer-docs#loggedin-unlock-email),
and the steps fire
[`loggedin_unlock_requested`](/loggedin/developer-docs#loggedin-unlock-requested)
and [`loggedin_unlocked`](/loggedin/developer-docs#loggedin-unlocked).

## Signed out by a newer login

Under [Logout Oldest](/loggedin/general-settings#logout-oldest) and
[Logout All](/loggedin/general-settings#logout-all), a new login signs
out an older device. The person on that device used to find themselves
signed out with no reason given. Since 3.4.0 they're told why.

On that device's next visit, the login screen says:

> You were signed out because your account signed in on another device.

Developers can change the text with the
[`loggedin_displaced_message`](/loggedin/developer-docs#loggedin-displaced-message)
filter.

### How it works

1. When Loggedin ends a session to make room for a new login, it notes
   that session in the user's `loggedin_displaced` user meta.
2. The next request from that device carries a cookie for a session that
   no longer exists. If it's one Loggedin noted, the device gets a
   short-lived marker cookie (10 minutes).
3. The login screen sees the marker and shows the message, once.

Only sessions ended by the limit get the message. Logging out, a
password change, an administrator signing the user out, or an idle
logout never shows it. Loggedin remembers up to 20 noted sessions per
user, for 14 days, so a device that comes back days later is still told.

This also covers logins that skip the login form, such as social login.
See [Compatibility](/loggedin/compatibility).

::: info Needs the default session storage
Loggedin finds the sessions it ended in the `session_tokens` user meta.
On a site that stores sessions elsewhere (Redis and the like), the
message isn't shown.
:::

### Send them to this page instead

**Setting key:** `displaced_redirect` &middot; **Default:** empty (no
redirect)

Optional. Instead of the login screen, send that device to a page of
your choice on its next page view, such as your membership account page
or a page explaining your one-device policy.

- Enter a full address, starting with `https://` or `http://`.
  Anything else shows "Enter a full address, starting with https:// or
  http://." under the field.
- It must be a page on this site. An address on another site shows
  "Use a page on this site.", and **Save** stays disabled until it's
  fixed. Set from [WP-CLI](/loggedin/wp-cli) or code instead, a host you
  allow with the
  [`allowed_redirect_hosts`](https://developer.wordpress.org/reference/hooks/allowed_redirect_hosts/)
  filter is accepted too.
- It happens once, on the device's next **front-end** page view. In
  wp-admin, the device goes to the login screen and sees the message
  instead.
- Leave it empty to keep the message on the login screen.

## Related

- [Login Limits](/loggedin/general-settings) — the limit and the three
  modes.
- [Force Logout](/loggedin/force-logout) — sign a user out from the
  admin.
- [User Sessions](/loggedin/user-sessions) — users can sign out their own
  devices from their profile.
- [Compatibility](/loggedin/compatibility) — logins that skip the login
  form.
