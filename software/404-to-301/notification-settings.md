---
title: Notification Settings
---

# Notification Settings

The **Notifications** tab on the Settings page configures the email that
goes out when a 404 fires. Email is opt-in — the master switch is off by
default so a fresh install never surprises an admin's inbox.

[[toc]]

## Notify by email on 404 errors

**Setting key:** `email_enabled` &middot; **Default:** `Off`

The master switch. When off, the Email action becomes a no-op even if
recipient and threshold are populated. The other fields on this tab are
shown but visually marked as ignored.

When on, every 404 that reaches the Email action is evaluated against the
threshold and sent if it qualifies.

## Recipient emails

**Setting key:** `email_recipient` &middot; **Default:** the site's
`admin_email` option (as a single-entry list).

A list of addresses that receive the notification. The field uses a
chip-style input: type or paste an email, then press Enter, comma or
Tab to commit it. Invalid entries are rejected at save time, so a typo
won't break notifications for the addresses that did validate.

Pasting a comma- or newline-separated string also works — each address
becomes its own chip.

Stored as `string[]`. Clearing the field entirely silences notifications
without flipping the master toggle — there is no implicit fallback to
`admin_email` at send time, only at first-install when the defaults are
seeded.

## Hits threshold

**Setting key:** `email_threshold` &middot; **Default:** `1`

How many times the same URL must 404 before a notification is sent.

- **`1`** — email on the very first 404. Loud, but informative on a small
  site.
- **Higher values** — email only after the URL has been hit at least this
  many times. Useful on busy sites where one-off mistypes don't deserve a
  notification but a sustained 404 pattern does.

The threshold reads the per-URL `hits` counter on the matching log row,
which is why **logging has to be on** for notifications to fire — the
counter never advances without it.

::: tip One email per URL, not per hit
Once a URL crosses the threshold and an email is sent, the email action
remembers that and doesn't re-send for the same URL. Otherwise a URL set
to threshold `1` on a popular broken link would mean an email per visit.
:::

## Add-ons on this tab

The built-in email above is a single immediate alert. Two add-ons extend
this tab with their own boxes for richer notifications — they run on their
own switches and are **not** governed by the master toggle above:

- **[Telegram Alerts](/404-to-301/addons/telegram-alerts)** — real-time
  Telegram messages for 404s and redirects, delivered in the background.
- **[Email Reports](/404-to-301/addons/email-reports)** — scheduled daily,
  weekly, or monthly email digests of your 404 activity, with an optional
  CSV attachment.

When either add-on is active it adds its configuration box directly below
the built-in email settings. See the [Add-ons](/404-to-301/addons/) section
for the full list.
