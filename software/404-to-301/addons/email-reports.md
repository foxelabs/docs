---
title: Email Reports
---

# Email Reports

Scheduled email digests of your 404 activity — daily, weekly, or monthly —
with an optional CSV attachment of the new log rows. Set a frequency once
and the reports keep arriving on their own.

This is different from the core's built-in
[email notification](/404-to-301/notification-settings), which fires one
alert per qualifying 404. Email Reports sends a periodic *summary* instead,
on its own schedule and its own switch. When active it adds an **Email
Reports** box to the [Notifications settings tab](/404-to-301/notification-settings).

[[toc]]

## Send periodic email reports

**Setting key:** `email_reports_enabled` &middot; **Default:** `Off`

The master switch. Off keeps the add-on dormant; the schedule only runs
when this is on.

## Report frequency

**Setting key:** `email_reports_frequency` &middot; **Default:** `Weekly`

How often the digest is dispatched — **Daily**, **Weekly**, or **Monthly**.
The underlying WP-Cron event reschedules itself automatically when you
change this.

## Report recipients

**Setting key:** `email_reports_recipient` &middot; **Default:** the site
`admin_email`

Who receives the digest. A chip-style field — type or paste an address and
press Enter or comma to add it. Leave it empty to fall back to the site
admin email.

## Attach CSV of new 404 logs

**Setting key:** `email_reports_attach_csv` &middot; **Default:** `On`

When on, the report email includes a UTF-8 CSV attachment of the log rows
added since the previous report, so you have the raw data alongside the
summary.

## Delivery status

The box shows when the last report was sent. Reports are dispatched on a
WP-Cron tick, so — like all WP-Cron work — they fire on the next request
after the scheduled time on a low-traffic site.

::: warning Email must actually send
Reports go out through WordPress's `wp_mail()`. If your server has no mail
transport configured (common on local installs), no email — report or
otherwise — will arrive. Install an SMTP plugin to be sure delivery works.
:::
