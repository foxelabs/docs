---
title: WP-CLI
description: Import comments into Convocept from the command line with wp convocept import — dry runs, batches, resume, status and cancel.
---

# WP-CLI

Convocept adds one [WP-CLI](https://wp-cli.org/) command, `wp convocept
import`, for importing comments from other comment systems. It is the
fastest way to import large exports, with no upload size limit and no
browser tab to keep open.

[[toc]]

## wp convocept import

```bash
wp convocept import <source> [<file>] [--dry-run] [--batch-size=<number>] [--yes]
```

Runs a dry run first and shows what will be imported, then asks before
importing. Spam and deleted comments are skipped, imported comments don't
notify subscribers, and running the same export again never creates
duplicates.

| Argument | Description |
| --- | --- |
| `<source>` | Importer ID: `disqus`. Or `resume`, `status`, `cancel` for the current import. |
| `<file>` | Export file (`.xml` or `.xml.gz`) for file-based sources. |
| `--dry-run` | Only analyse the export; import nothing. |
| `--batch-size=<number>` | Comments per batch. Default: `1000`. |
| `--yes` | Start without asking for confirmation after the dry run. |

### Examples

```bash
# Review what a Disqus export contains, without importing anything.
wp convocept import disqus export.xml.gz --dry-run

# Import it without the confirmation prompt.
wp convocept import disqus export.xml.gz --yes

# Continue an import that was interrupted.
wp convocept import resume

# Show the current import, or forget it.
wp convocept import status
wp convocept import cancel
```

## One import at a time

The command and the **Import** page share the same import job. An import
started in wp-admin can be resumed with `wp convocept import resume`, and
the other way round. `cancel` forgets the job and deletes its working
files; comments already imported stay. The command reads your export where
it is and never changes or deletes it.

A finished import stays as the current job so you can check its report
with `status`. Run `wp convocept import cancel` before starting the next
one, or the command stops with "Another import is in progress".

See [Import from Disqus](/convocept/import-from-disqus) for how comments
are matched to posts and what is imported.
