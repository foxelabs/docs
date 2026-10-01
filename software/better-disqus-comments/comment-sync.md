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

Sync is optional and off until you turn it on. It's set up on the
**Comment sync** page. The **Import & export** page, under **Manage** in the
sidebar, has two one-off tools that use the same API keys:
[import past comments](#sync-past-comments) and
[export WordPress comments to Disqus](#export-comments-to-disqus).

[[toc]]

## Set up sync

You need a Disqus API application — see
[API keys](/better-disqus-comments/disqus-account#api-keys).

1. On the **Disqus → Comment sync** page, under **Disqus API**, enter the
   **Public key**, **Secret key** and **Admin access token**.
2. Click **Save** at the top of the page. A **Sync status** card appears
   below the keys.
3. Click **Turn on sync**.

**Sync** changes to **On**, and **Last event** reads *"Sync connection
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
| **Sync: On** with **Turn off sync** | Disqus sends new comments to your site. |
| **Sync: Off** with **Turn on sync** | Sync is set up but paused, or not turned on yet. |
| *"The webhook secret on Disqus is out of date"* with **Repair sync** | The token Disqus signs with no longer matches your site's — for example after moving the site. **Repair sync** fixes it. |
| *"Could not check the sync status"* with **Check again** | The status couldn't be loaded. The notice gives the reason, such as *"Could not reach Disqus."* or a Disqus error. Check the API keys, then click **Check again**. |
| *"Comment sync is paused while the official Disqus plugin is active"* | Deactivate the official plugin — see [below](#while-the-official-disqus-plugin-is-active). |

Below **Sync**, **Last event** shows the most recent sync event and when it
happened, for example *"Synced comment 6123456789 from Disqus."* or *"Could
not sync a comment from Disqus: …"*. It reads **None yet** until the first
event. Only the latest event is kept.

**Turn off sync** tells Disqus to stop sending comments. The connection on
Disqus's side is kept, so **Turn on sync** turns it back on with one click.
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

## Import past comments {#sync-past-comments}

Sync only catches comments posted after it's turned on. To pull in older
ones, open **Disqus → Import & export**:

1. Under **Import past comments**, choose a **From** and **To** date. They
   default to the last 30 days; the end date can't be in the future.
2. Click **Import comments**.

The tool works through your Disqus comments 100 at a time and counts them as
it goes, under **Importing…** (**Imported** once it's done) and **Failed**.
You can **Stop** at any time and run it again later — comments already in
WordPress are updated, not duplicated. You don't need to turn on sync first,
only to save the API keys.

Keep the tab open while it runs. For a site with years of comments, import a
year or so at a time.

::: tip No API keys yet?
Until the keys are saved on the **Comment sync** page, **Import & export**
shows *"Add your Disqus API keys first"* instead of the tools. Its **Add API
keys** button takes you there.
:::

A comment can fail when its thread can't be matched to a post — for example a
post that was deleted, or a thread created by a different site. Failures are
counted but don't stop the run.

## Export comments to Disqus

The other direction: send comments that exist only in WordPress — from before
you used Disqus, say — to Disqus, so they show up in the Disqus thread.

1. On **Disqus → Import & export**, under **Export comments to Disqus**,
   click **Export comments**.
2. Wait for *"Done."* A progress bar shows how far it got, as *"20 posts
   checked, 5 exported with 48 comments."* You can **Stop** it at any
   time.

What is exported:

- **Posts:** published posts of every public post type that supports
  comments, ten at a time.
- **Comments:** approved comments and replies. Pingbacks, trackbacks and
  comments that came from Disqus are skipped.
- **Data:** author name, email, URL and IP, date, content and reply structure,
  in the WordPress export (WXR) format Disqus imports.

The upload happens from your server, so your access token never reaches the
browser. Posts that fail are listed under *"Some posts could not be
exported"* with the reason.

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
- **Turn on sync**, **Turn off sync** and **Repair sync** are disabled, and
  the **Comment sync** page says *"Comment sync is paused while the official
  Disqus plugin is active"*;
- **Import comments** is disabled, and the **Import & export** page says
  *"Importing is paused while the official Disqus plugin is active"*;
- displaying comments keeps working.

Deactivate *Disqus Comment System* and sync picks up where it left off.

## Troubleshooting

**Sync stays Off after Turn on sync.** Check the three keys — the error
message comes from Disqus. The API application must allow writing to your
forum.

**Sync is on, but comments don't arrive.** Disqus must be able to reach
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
