---
title: Import from Disqus
description: Move from Disqus to native WordPress comments with Convocept — export, dry run, resumable import and WP-CLI for large sites.
---

# Import from Disqus

Convocept imports a Disqus export into native WordPress comments: authors,
dates, replies and all. Nothing is imported until you have reviewed a dry
run, and importing the same export again never creates duplicates.

[[toc]]

## 1. Export from Disqus

1. Sign in to Disqus and open your site's **Admin**.
2. Go to **Moderation → Export** (on some accounts **Community → Export**)
   and start an export.
3. Disqus emails you a link to a `.xml.gz` file, usually within minutes.
   Large sites can take longer.

You can upload the `.xml.gz` file as it is; there's no need to unpack it.

## 2. Import in WordPress

1. Go to **Comments → Convocept → Import**, or **Tools → Import → Disqus
   (Convocept)**.
2. Choose the export file and click **Upload and review**.
3. Review the **dry run**:
   - how many comments will be imported;
   - how many belong to pages found on your site;
   - how many are spam or deleted, which are skipped;
   - a sample of the first comments as they will be imported.
4. Click **Start import**. A progress bar shows each batch.

You can close the page at any time. Come back and click **Continue**, and
the import picks up where it stopped. When it finishes, you get a report of
what was imported and what was skipped, and why.

An uploaded export is stored in a private folder while the import runs and
deleted when it is finished or cancelled. To import another export
afterwards, click **Start another import**.

## Large exports: WP-CLI

The upload size is limited by your server; the Import page shows the limit.
For bigger exports, or to import 100,000+ comments quickly, use
[WP-CLI](/convocept/wp-cli):

```bash
wp convocept import disqus disqus-export.xml.gz
```

It shows the dry run first and asks before importing. On a test machine,
98,000 comments imported in about two minutes, and running the same export
again took 11 seconds and added nothing.

## How comments are matched to posts

Each Disqus thread is matched to a post by, in order:

1. **The Disqus identifier**, when it holds a WordPress post ID. The Disqus
   WordPress plugin sets identifiers like `123 https://example.com/?p=123`.
2. **The thread's address**, also when your site has moved to a new domain
   or to HTTPS since. The path must still match: after a change of
   permalink structure, threads are matched by identifier only.

Threads that match no post are skipped and counted in the report.
Developers can decide the post themselves with the
[`convocept_disqus_thread_post_id`](/convocept/developer-docs#filters)
filter.

## What is imported

- Author name and email, the comment, the date, and the author's IP address
  (following your [IP address setting](/convocept/advanced#ip-address-stored-with-new-comments)).
- Replies stay under their parent. A reply to a deleted or spam comment
  moves up to the nearest comment that was kept.
- Comments are approved or held as they were in Disqus.
- Spam and deleted comments are skipped.
- Imported comments **don't email your subscribers**.
- Comments are not linked to WordPress users, even when the email address
  matches an account. Developers can set `user_id` with the
  [`convocept_disqus_comment_data`](/convocept/developer-docs#filters)
  filter.

## Comments already on your site

Comments the Disqus WordPress plugin already synced into WordPress, and
comments from an earlier import, are recognised and skipped. You can run the
import again after new comments arrive in Disqus; only the new ones are
added.

## After the import

Deactivate the Disqus plugin (or
[Better Disqus Comments](/better-disqus-comments/getting-started)), so your
theme stops loading Disqus. Your comments are now served from your own
database, with no Disqus scripts, ads or tracking.
