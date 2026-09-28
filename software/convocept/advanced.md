---
title: Advanced
description: Trusted proxies and visitor IPs, stored IP addresses and personal data tools, structured data for search engines, and what happens on uninstall.
---

# Advanced

**Comments → Convocept → Advanced** has the settings most sites never need
to touch.

[[toc]]

## Visitor IP addresses

Rate limits and spam checks use the visitor's IP address. Behind a proxy,
CDN or load balancer, every visitor looks like the proxy, so one busy reader
could rate-limit everyone. Tell Convocept which proxies to trust, and it
reads the real address from the header they set.

### Trusted proxies

One IP address or CIDR range per line, for example:

```text
173.245.48.0/20
103.21.244.0/22
10.0.0.0/8
```

Leave it empty unless your site is behind a proxy. For Cloudflare, use
[their published IP ranges](https://www.cloudflare.com/ips/).

### Header with the visitor's IP

The header your proxy sets. Default: `X-Forwarded-For`.

| Header | Set by |
| --- | --- |
| `X-Forwarded-For` | Most proxies and load balancers |
| `CF-Connecting-IP` | Cloudflare |
| `X-Real-IP` | nginx |
| `True-Client-IP` | Akamai, Cloudflare Enterprise |

The header is read **only** on requests that come from a trusted proxy.
Anyone can send the header themselves, so it is ignored on every other
request.

## Privacy

**Tools → Export Personal Data** and **Tools → Erase Personal Data** include
a reader's comment subscriptions and the upvotes of registered users, next
to WordPress's own comment data. **Settings → Privacy** gets suggested text
for your privacy policy, describing what Convocept stores.

Convocept makes no requests to other sites, loads nothing from other
servers and sets no cookies of its own. WordPress's own "save my name"
comment cookies are set only when the reader ticks the box.

### IP address stored with new comments

| Option | Stored |
| --- | --- |
| **Full address** (WordPress default) | The whole address, as WordPress stores it. |
| **Anonymized** | The last part removed (`203.0.113.0`, or the last 80 bits of an IPv6 address). |
| **None** | No address at all. |

Every check still sees the full address when a comment arrives: Akismet,
Convocept's own checks, and WordPress's flood control and the IP entries in
its moderation and disallowed lists. Only what is saved changes. The setting also applies to
[imported comments](/convocept/import-from-disqus). Comments already stored
are not changed.

## Search engines

Comments are in the page's HTML either way, so search engines can read
them.

### Describe comments with structured data

On by default. Adds [schema.org](https://schema.org/Comment) data for the
comments on each page: author, date, text, upvotes and replies nested under
the comment they answer.

With **Yoast SEO** or **Rank Math**, the comments join their structured data
graph instead of adding a second one. Without an SEO plugin, Convocept adds
a small article node of its own to carry them.

## Uninstall

Comments always stay: they belong to WordPress. Deactivating the plugin
never deletes anything.

### Delete all Convocept data when the plugin is deleted

Off by default. When on, deleting the plugin from **Plugins** also removes
Convocept's settings, subscriptions, upvotes, pins and edit history. Leave
it off to keep them for a later reinstall.

It also removes the marks Convocept keeps on comments: which comments were
written in Markdown, and which came from a Disqus import. After a
reinstall, Markdown comments show as plain text, and importing the same
Disqus export again would add its comments a second time.

Either way, deleting the plugin clears its temporary data (caches, queued
emails, unfinished imports). On multisite, each site follows its own
setting.
