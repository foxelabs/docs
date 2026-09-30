---
title: Subscriptions
description: Email comment subscriptions in Convocept — reply notifications, subscribing without commenting, double opt-in and background sending.
---

# Subscriptions

Convocept has comment subscriptions built in, so you don't need a separate
"subscribe to comments" plugin. **Comments → Convocept → Comment form**
turns them on and off.

[[toc]]

## What readers can do

- **Email me replies to my comment** — a checkbox in the comment form.
- **Email me all new comments** — every new comment on the post.
- **Subscribe without commenting** — "Get new comments on this post by
  email", a small form under the comment form while comments are open, or
  anywhere with the [block or shortcode](#block-and-shortcode).
- **Manage subscriptions** — every email links to a page listing the
  reader's subscriptions, where they can unsubscribe from one post or from
  everything.
- **Unsubscribe** — the link in each email opens that page with an
  **Unsubscribe** button. Mail apps that show their own **Unsubscribe**
  button (the `List-Unsubscribe` header) unsubscribe in one click.

Readers never get an email about their own comment, and only about approved
comments on published, public posts.

## Email subscriptions

### Readers can subscribe by email

On by default. Adds the subscription options to the comment form and the
"subscribe without commenting" form. Turning it off hides them and stops
sending; existing subscriptions are kept.

### Ask new subscribers to confirm their address

On by default, and recommended. New subscribers get an email with a
confirmation link first, which keeps anyone from signing up someone else's
address. The link is valid for 2 days, and one address gets at most one
confirmation email every 10 minutes. Logged-in readers subscribing with
their own account address skip this step.

The subscribe form gives the same answer for every address, so it can't be
used to find out who is subscribed.

## Sending

Notifications go out in the background through WP-Cron, a batch at a time,
so posting a comment never waits for email, even with thousands of
subscribers.

### Emails per batch

From 10 to 500. Default: **50**. Lower it if your email service limits how
fast you can send.

Convocept sends through `wp_mail()`, so an SMTP plugin you already use
applies to these emails too.

## Block and shortcode

Put a "get new comments by email" form anywhere:

- **Block:** add **Comment Subscription** (`convocept/subscribe`) in the
  editor, and choose this post or the whole site.
- **Shortcode:**

```text
[convocept_subscribe]                  this post
[convocept_subscribe scope="site"]     every post on the site
[convocept_subscribe post_id="123"]    a specific post
```

## Emails

The confirmation and notification emails are sent as HTML with a plain-text
version. They carry your site name, are written in the language the reader
subscribed in, and right-to-left languages are laid out correctly. To change them, override the templates in
`convocept/emails/`; see [Theming](/convocept/theming#overriding-templates).

## Privacy

Subscriptions are included in **Tools → Export Personal Data** and
**Tools → Erase Personal Data**. See [Advanced](/convocept/advanced#privacy).

## Moving from Subscribe to Comments Reloaded

Convocept replaces it. Deactivate it when you turn on Convocept's
subscriptions, or readers get two emails for each comment. See
[Switching Plugins](/convocept/switching-plugins#subscribe-to-comments-reloaded).
