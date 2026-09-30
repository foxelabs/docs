---
title: Moderation & Spam
description: How Convocept keeps spam out without CAPTCHAs, works with Akismet, and lets moderators act right in the thread.
---

# Moderation & Spam

**Comments → Convocept → Spam & moderation** shows how many comments are
waiting for review (the sidebar counts them too) and the protection in
place. There is nothing to set up: the checks are on for every site.

[[toc]]

## Spam protection

These checks run on every comment, without asking readers to solve anything:

| Check | What it does |
| --- | --- |
| **Hidden trap field for bots** | A field people never see. A comment that fills it in goes straight to spam. |
| **Minimum time to write a comment** | A comment sent within 3 seconds of the form appearing is held for review. The form carries a signed token, so the time can't be faked. |
| **Link limit** | A comment with as many links as the Discussion link limit (default 2) is held for review. |
| **Limits on how fast one visitor can post** | Per-visitor limits on posting, editing, previews, upvotes and subscriptions. |
| **Akismet** | Shows whether Akismet is active. |

On top of these, every comment goes through **WordPress's own rules** from
**Settings → Discussion**: the moderation list, the disallowed-words list,
the link limit and "hold for approval". Comments are posted through core's
comment handling, so **Akismet**, **Antispam Bee** and other anti-spam
plugins check them as usual.

A held comment is never lost: it waits in **Comments → Pending**. When one
of Convocept's own checks (trap field, timing or links) held or flagged it,
the core **Comments** screen says which in a **Convocept** column, next to
the comment's upvotes and pin.

### Rate limits

| Action | Per visitor |
| --- | --- |
| Posting a comment | 5 per minute, 30 per hour |
| Editing a comment | 10 per minute |
| Previewing | 30 per minute |
| Upvoting | 30 per minute |
| Subscribing without commenting | 5 per 10 minutes |

Developers can change or turn off any limit with
[`convocept_rate_limit`](/convocept/developer-docs#filters).

::: tip Behind Cloudflare or a load balancer?
Rate limits and spam checks use the visitor's IP address. Behind a proxy,
every visitor looks like the proxy until you add it under
[Advanced → Trusted proxies](/convocept/advanced#trusted-proxies).
:::

## Waiting for review

Shows how many comments are waiting for approval, with a **Review comments**
button that opens **Comments → Pending**.

## Moderating in the thread

Users who can moderate comments get extra actions on every comment, right
in the thread:

| Action | Does |
| --- | --- |
| **Approve** | Publish a comment that is waiting for approval. |
| **Pin** / **Unpin** | Keep an approved top-level comment at the top of the thread. |
| **Spam** | Mark as spam (and teach Akismet). |
| **Trash** | Move to the trash. |
| **Edit in dashboard** | Open the comment in the WordPress editor. |

Moderators also see the post's comments waiting for approval in the thread,
marked as pending: new top-level comments at the top, and replies under
their comment when it is on the current page.

The core **Comments** screen works as before, with Convocept's comments in
it like any other.

## For developers

- [`convocept_moderation_checks`](/convocept/developer-docs#filters) — add,
  replace or remove a check.
- [`convocept_before_submit`](/convocept/developer-docs#filters) — reject a
  submission with your own message.
- [`convocept_min_submit_seconds`](/convocept/developer-docs#filters) —
  change the 3-second minimum, or `0` to turn it off.
- [`convocept_rate_limit`](/convocept/developer-docs#filters) — adjust or
  disable a rate limit.
