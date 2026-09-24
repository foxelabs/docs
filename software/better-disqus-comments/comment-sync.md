---
title: Comment Sync
description: Copy Disqus comments into WordPress as they are posted, pull in older comments, and export WordPress comments to Disqus.
---

# Comment Sync

Disqus keeps your comments on its servers. **Comment sync** keeps a copy in
your WordPress database too, as regular WordPress comments:

- **Your data stays yours.** If you ever leave Disqus, the comments are
  already in WordPress.
- **Search engines can read them.** [SEO mode](/better-disqus-comments/seo-mode)
  shows the synced comments to crawlers.
- **It's instant.** Disqus pushes each new comment to your site as it's
  posted. There's no scheduled job and no polling, so it doesn't use up your
  Disqus API limit.

Sync is optional and off until you turn it on. The **Comment sync** panel also
has two one-off tools: [pull in past comments](#sync-past-comments) and
[export WordPress comments to Disqus](#export-comments-to-disqus).

[[toc]]

## Set up sync

You need a Disqus API application — see
[API keys](/better-disqus-comments/disqus-account#api-keys).

1. In **Disqus → Settings → Comment sync**, enter the **Public key**,
   **Secret key** and **Admin access token**.
2. Click **Save Changes**. The panel now shows **Sync status**.
3. Click **Enable sync**.

The status changes to **Active**, and the last event reads *"Sync connection
established with Disqus."* once Disqus has confirmed your site. New comments
posted on Disqus now appear under **Comments** in WordPress within seconds.

::: tip Upgrading from the official Disqus plugin?
If sync was already set up there, it keeps working — the webhook address and
signing token are carried over. See
[Upgrading](/better-disqus-comments/upgrading#from-the-official-disqus-plugin).
:::

## Sync status

| You see | Meaning |
| --- | --- |
| **Status: Active** with **Disable sync** | Disqus sends new comments to your site. |
| **Status: Off** with **Enable sync** | Sync is set up but paused, or not turned on yet. |
| *"The webhook secret on Disqus is out of date. Click “Enable sync” to repair it."* | The token Disqus signs with no longer matches your site's — for example after moving the site. **Enable sync** fixes it. |
| *"Could not reach Disqus."* or a Disqus error | The status couldn't be loaded. Check the API keys, then reload the page. |
| *"Comment sync is paused while the official Disqus plugin is active."* | Deactivate the official plugin — see [below](#while-the-official-disqus-plugin-is-active). |

Under the status, **Last event** shows the most recent sync event and when it
happened, for example *"Synced comment 6123456789 from Disqus."* or *"Could
not sync a comment from Disqus: …"*. Only the latest event is kept.

**Disable sync** tells Disqus to stop sending comments. The connection on
Disqus's side is kept, so **Enable sync** turns it back on with one click.
Comments already synced stay in WordPress.

## How comments are saved

Each Disqus comment becomes a normal WordPress comment on the matching post:

| WordPress field | Comes from |
| --- | --- |
| Post | The Disqus thread — matched by the thread ID saved on the post, or by the identifier the embed uses (`<post ID> <guid>`) |
| Author name | The Disqus author, or *Anonymous* |
| Author email | A placeholder — `user-<id>@disqus.com`, or `anonymized-…@disqus.com` for guests. Disqus only shares real addresses with specially approved applications. |
| Author URL, IP | From Disqus, when available |
| Content | The comment text, with unsafe HTML removed |
| Date | The Disqus post time |
| Parent | The Disqus parent comment, if it has already been synced — otherwise the reply is saved as a top-level comment |
| Status | Approved → approved, spam → spam, deleted or pending → pending |

A comment that is edited or moderated on Disqus is updated in WordPress, not
duplicated. Synced comments are marked with the user agent
`Disqus Sync Host` and the comment meta `dsq_post_id` (the Disqus comment
ID); posts get the meta `dsq_thread_id`. These are the same keys the official
plugin used, so its synced comments are recognised.

::: info Disqus remains the source
Sync copies from Disqus to WordPress. Editing or deleting a synced comment in
WordPress doesn't change it on Disqus — moderate on Disqus, and the change
syncs back.
:::

## Sync past comments

Sync only catches comments posted after it's turned on. To pull in older
ones:

1. Under **Sync past comments**, choose a **From** and **To** date. They
   default to the last 30 days; the end date can't be in the future.
2. Click **Sync past comments**.

The tool works through your Disqus comments 100 at a time and shows progress:
*"250 comments synced, 0 failed."* You can **Stop** at any time and run it
again later — comments already in WordPress are updated, not duplicated.

Keep the tab open while it runs. For a site with years of comments, sync a
year or so at a time.

A comment can fail when its thread can't be matched to a post — for example a
post that was deleted, or a thread created by a different site. Failures are
counted but don't stop the run.

## Export comments to Disqus

The other direction: send comments that exist only in WordPress — from before
you used Disqus, say — to Disqus, so they show up in the Disqus thread.

1. Under **Export comments to Disqus**, click **Export comments**.
2. Wait for *"Done."* Progress shows as *"20 posts checked, 5 exported with
   48 comments."*

What is exported:

- **Posts:** published posts of every public post type that supports
  comments, ten at a time.
- **Comments:** approved comments and replies. Pingbacks, trackbacks and
  comments that came from Disqus are skipped.
- **Data:** author name, email, URL and IP, date, content and reply structure,
  in the WordPress export (WXR) format Disqus imports.

The upload happens from your server, so your access token never reaches the
browser. Posts that fail are listed under *"Some posts could not be
exported:"* with the reason.

::: warning Run it once
Disqus processes imports in the background, and it can take a while before
comments appear — don't export again in the meantime. Exporting the same
comments twice may create duplicates on Disqus. See Disqus's guide
[About imports](https://help.disqus.com/en/articles/1717131-importing-comments-from-wordpress).
:::

## While the official Disqus plugin is active

The official plugin and this one use the same webhook address, so only one
can receive comments. While the official plugin is active:

- a warning asks you to deactivate it, on every admin screen;
- **Enable sync**, **Disable sync** and **Sync past comments** are disabled;
- displaying comments keeps working.

Deactivate *Disqus Comment System* and sync picks up where it left off.

## Troubleshooting

**Status stays Off after Enable sync.** Check the three keys — the error
message comes from Disqus. The API application must allow writing to your
forum.

**Enabled, but comments don't arrive.** Disqus must be able to reach
`https://your-site.com/wp-json/disqus/v1/sync/webhook`:

- Your site must be public — Disqus can't reach `localhost` or a site behind a
  password.
- Security plugins and firewalls that block REST API requests or unknown POST
  requests can stop it. Allow that address.
- A caching or CDN layer must not cache POST requests to `/wp-json/`.

**Last event says the forum doesn't match.** The comment came from a Disqus
site with a different shortname than the one saved. Check the
[shortname](/better-disqus-comments/disqus-account#shortname).

**"No post found for Disqus thread".** The Disqus thread doesn't belong to a
post on this site — usually a post that was deleted, or a thread created on a
staging copy.

## Related

- [Disqus Account](/better-disqus-comments/disqus-account) — getting the API
  keys.
- [SEO Mode](/better-disqus-comments/seo-mode) — showing synced comments to
  search engines.
- [Developer Docs](/better-disqus-comments/developer-docs#sync) — the
  webhook endpoint and the `dcl_comment_synced` action.
