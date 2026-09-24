---
title: Disqus Account
description: Connect Better Disqus Comments to your Disqus site with a shortname, and add API keys for comment sync.
---

# Disqus Account

Better Disqus Comments talks to Disqus directly. Showing comments needs only
your site's **shortname**. The API keys are optional and only needed for
[Comment Sync](/better-disqus-comments/comment-sync) and a few addons.

[[toc]]

## Shortname

**Panel:** Disqus &middot; **Stored in:** `dcl_disqus_account.shortname`
&middot; **Default:** empty

The unique name of your site on Disqus — the *example* in
`example.disqus.com`. Disqus calls it the site's *shortname*; you chose it when
you created the site on Disqus.

To find it, log in to Disqus, open your site's admin, and look under
**Settings → General** — or see Disqus's guide,
[What's a shortname?](https://help.disqus.com/en/articles/1717111-what-s-a-shortname)

You can paste any of these; the plugin keeps only the name:

| You enter | Saved as |
| --- | --- |
| `example` | `example` |
| `example.disqus.com` | `example` |
| `https://example.disqus.com/admin/` | `example` |

The shortname isn't checked against Disqus when you save. If comments show a
Disqus error such as *"We were unable to load Disqus"*, check the spelling.

While no shortname is saved:

- no comments or comment counts are shown to visitors;
- the settings page shows *"Enter your Disqus shortname to start showing
  comments."*;
- every other admin screen shows a reminder linking to the settings;
- the toolbar **Disqus** menu only has **Configure Plugin**.

## API keys

**Panel:** Comment sync &middot; **Stored in:** `dcl_disqus_account`

| Field | Key | Needed for |
| --- | --- | --- |
| **Public key** | `public_key` | [Comment Sync](/better-disqus-comments/comment-sync), the [Latest Comments Widget](/better-disqus-comments/addons/latest-comments), the comment count on [Advanced Buttons](/better-disqus-comments/addons/advanced-buttons) |
| **Secret key** | `secret_key` | [Comment Sync](/better-disqus-comments/comment-sync) |
| **Admin access token** | `access_token` | [Comment Sync](/better-disqus-comments/comment-sync) |

All three come from a Disqus **API application**:

1. Go to [Disqus API applications](https://disqus.com/api/applications/) and
   log in with the account that owns your Disqus site.
2. Register a new application. The name and description are only for you.
3. Open the application. Its **Details** page shows the **API Key** (public
   key), the **API Secret** (secret key) and your **Access Token** (admin
   access token).
4. On the application's **Settings**, make sure the access level allows
   reading and writing to your forums, and add your site's domain.
5. Paste the three values into the **Comment sync** panel and click **Save
   Changes**.

### How secrets are stored

The secret key and access token are write-only:

- They are never sent back to the browser. After saving, the fields are empty
  with the placeholder *"Saved — leave blank to keep"*.
- Leaving a field blank when you save keeps the stored value.
- To replace one, type the new value and save.

The keys are stored in their own option, `dcl_disqus_account`, not with the
rest of the settings, so they are never exposed through the WordPress
settings REST endpoint.

### The sync token

There is a fourth credential with no field on the settings page: the **sync
token**, which Disqus uses to sign the comments it sends to your site. It is
generated for you — a random 64-character value — the first time you click
**Enable sync**. Sites upgrading from the official Disqus plugin keep their
existing token.

## Saving

Account fields save with the same **Save Changes** button as every other
setting. The button stays disabled until something has changed, and a message
at the bottom of the screen confirms the save: *"Settings saved."*

## Related

- [Comment Sync](/better-disqus-comments/comment-sync) — what the API keys
  unlock.
- [Upgrading](/better-disqus-comments/upgrading) — how the shortname and keys
  are carried over from the official Disqus plugin.
