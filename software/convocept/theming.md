---
title: Theming
description: Restyle Convocept with CSS custom properties, replace its stylesheet or override its templates from your theme.
---

# Theming

Convocept draws its own design and takes only the font family from your theme, so it looks
the same in every theme without changes. When you want more control, restyle it with CSS custom
properties first, and override templates only for changes to the markup.

[[toc]]

## Colour schemes

[Appearance](/convocept/appearance) sets the scheme. The thread wrapper carries it as
`data-convocept-theme`:

| Setting | `data-convocept-theme` | Colours |
|---|---|---|
| Light (default) | `light` | Built-in light palette on a white card. |
| Dark | `dark` | Built-in dark palette on a dark card. |
| Follow the reader's device | `system` | Light or dark palette from the reader's `prefers-color-scheme`. |

The accent colour (links, buttons, focus rings) is set on the same page.

## CSS custom properties

Everything is scoped under `#comments.convocept`. Inside it, theme styles are reset to the
browser's defaults, and Convocept's rules use that ID so theme rules for comment sections
(`#respond input`, `.entry-content button`) don't reach the thread. Override tokens, not
selectors. The token defaults have no specificity, so any rule in your theme's stylesheet
wins:

```css
.convocept {
	--convocept-radius: 4px;
	--convocept-font: Georgia, serif;
}

/* Only the dark palette. */
.convocept[data-convocept-theme="dark"] {
	--convocept-bg: #000;
}
```

Set the accent colour on the [Appearance](/convocept/appearance#accent-colour)
page rather than in CSS: it is applied to the thread itself, so it wins over
stylesheet rules.

| Property | Used for |
|---|---|
| `--convocept-accent` | Buttons, focus rings, selected states. |
| `--convocept-on-accent` | Text on accent-coloured buttons. |
| `--convocept-link` | Links and other accent-coloured text (by default the accent mixed toward the text colour, for contrast). |
| `--convocept-danger` | Spam/Trash actions and error messages. |
| `--convocept-text` | Main text. |
| `--convocept-bg` | The thread's card background. |
| `--convocept-muted` | Dates, counts, secondary actions. |
| `--convocept-border` | The card border and dividers. |
| `--convocept-border-strong` | Form fields and the reply thread line. |
| `--convocept-surface` | Tabs, the sort switch, badges, the follow panel. |
| `--convocept-field-bg` | Form fields. |
| `--convocept-warning`, `--convocept-warning-line` | A moderator's view of comments waiting for approval. |
| `--convocept-radius` | Corner radius of the card. |
| `--convocept-max-width` | Widest the thread gets (default 720px). |
| `--convocept-gap` | Spacing between comments. |
| `--convocept-avatar` | Avatar size of top-level comments (replies use 28px). |
| `--convocept-font`, `--convocept-font-size` | Typeface (default: the theme's) and base size (default 15px). |

Sizes are in pixels, so themes that change the page's root font size don't
shrink or grow the thread.

Keep text contrast at 4.5:1 or more when you change colours; the built-in values are checked
against WCAG 2.2 AA.

## Replacing the stylesheet

Convocept inlines its small stylesheet right before the thread (no extra request). A theme that
styles the thread completely can remove it:

```php
add_filter( 'convocept_inline_css', '__return_empty_string' );
```

## Overriding templates

Copy a file from `wp-content/plugins/convocept/templates/` to `your-theme/convocept/` and edit
the copy. Convocept uses the theme's copy from then on (child themes first, then the parent).

| Template | Renders |
|---|---|
| `thread.php` | The whole section: header, form, list, pagination. |
| `thread-header.php` | Comment count and the sort links. |
| `comment.php` | One comment (and, recursively, its replies). |
| `composer.php` | The comment form. It works without JavaScript; keep its `data-convocept-*` attributes, the script relies on them. |
| `pagination.php` | Page links and "Load more comments". |
| `subscribe-form.php` | "Get new comments by email". |
| `subscription-manage.php` | The page where readers manage subscriptions. |
| `emails/*.php` | Confirmation and notification emails (HTML and plain text). |

Each template starts with a comment listing the `$args` it receives. After updating Convocept,
compare your copies with the new originals.

The `convocept_locate_template` filter changes where a template is loaded from.

## Small changes without templates

- `convocept_thread_classes`: add classes to the thread wrapper.
- `convocept_comment_badges`: add badges next to an author name (for example "Member").
- `convocept_comment_view`: change any value a comment template receives.

See the [Developer Docs](/convocept/developer-docs#filters) for every filter.
