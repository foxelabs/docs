---
title: Telegram Alerts
---

# Telegram Alerts

Real-time Telegram messages when a 404 is logged or a redirect is served —
delivered in the background so your visitors never wait on the API call.

When active it adds a **Telegram Alerts** box to the
[Notifications settings tab](/404-to-301/notification-settings). It runs on
its own switch, independent of the core email notification.

[[toc]]

## Setup

1. In Telegram, open [@BotFather](https://t.me/BotFather), create a bot, and
   copy the **bot token** it gives you.
2. Send your new bot a message (a bot can't message you until you've started
   a chat with it), then message [@userinfobot](https://t.me/userinfobot) to
   get your numeric **chat ID**. For a channel, use its `@handle` and add the
   bot as an admin.
3. In **404 to 301 → Settings → Notifications → Telegram Alerts**, enable it,
   paste the token and chat ID, choose what to alert on, and save.

## Settings

### Send Telegram alerts

**Setting key:** `telegram_alerts_enabled` &middot; **Default:** `Off`

The master switch. Off keeps the add-on dormant.

### Bot token

**Setting key:** `telegram_alerts_bot_token`

The token from @BotFather, in the form `123456789:ABC…`.

### Chat ID

**Setting key:** `telegram_alerts_chat_id`

The destination: a **numeric** user/group ID, or an `@channelname` handle
for a public channel. A personal `@username` does **not** work as a chat ID.

### Alert on 404 errors

**Setting key:** `telegram_alerts_on_404` &middot; **Default:** `On`

Send a message whenever a new 404 is logged.

### Alert on redirects

**Setting key:** `telegram_alerts_on_redirect` &middot; **Default:** `Off`

Send a message whenever a redirect is served. Busy redirects can be chatty —
leave off unless you want the volume.

### 404 alert threshold

**Setting key:** `telegram_alerts_threshold` &middot; **Default:** `1`

Only alert once a URL has been hit this many times — the same anti-spam
mechanism as the core email threshold. Set to `1` to alert on every hit.

## Background delivery

Alerts are pushed onto a background queue and delivered out-of-band via a
non-blocking loopback request, so the visitor's request that triggered the
404 (or redirect) returns immediately — it never waits on the Telegram API.
A 5-minute health-check cron drains the queue if the immediate dispatch
can't run.

The box shows a status line with the **last successful delivery** time, or
the **last error** Telegram returned (for example `chat not found` when the
chat ID is wrong or you haven't messaged the bot yet) — that's how you
verify the integration end-to-end.

::: tip Works on localhost
Because alerts are *outbound* to Telegram (no incoming webhook), they work
on a local or firewalled site as long as it can reach `api.telegram.org`.
The only local caveat is the background loopback to `admin-ajax.php`; if
that's blocked, the 5-minute cron is the fallback.
:::
