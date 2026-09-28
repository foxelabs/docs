---
title: Appearance
description: Match Convocept's comments to your theme, or pick a light or dark palette and an accent colour.
---

# Appearance

**Comments → Convocept → Appearance** sets how the thread looks next to your
theme. For deeper changes, see [Theming](/convocept/theming).

[[toc]]

## Colour scheme

| Option | What readers see |
| --- | --- |
| **Match the theme** (default) | Your theme's text and background colours. Borders and muted text are mixed from the text colour, so it works on light and dark themes alike. |
| **Follow the reader's device** | Light or dark, from the reader's system setting (`prefers-color-scheme`). |
| **Always light** | Dark text on a light background of its own. |
| **Always dark** | Light text on a dark background of its own. |

**Match the theme** is the right choice for most sites: the thread picks up
your theme's fonts and colours and looks like part of the page. Pick one of
the fixed palettes when your theme's colours don't suit a comment section,
or the thread sits on a busy background.

## Accent colour

Used for links, buttons and focus rings in the thread. Default: **#2563eb**
(blue). Pick a colour or type a hex value; **Reset** goes back to the
default.

If the colour is too light to read as text on white (a contrast below
4.5:1), the screen warns you. Links are drawn slightly darker than the
accent anyway, mixed toward the text colour, so they stay readable on light
and dark backgrounds.

## Accessibility

Every palette is checked against **WCAG 2.2 AA** for text and control
contrast, in light and dark, and the thread respects the reader's
**reduced motion** setting. Keep contrast at 4.5:1 or more if you change
colours with CSS.
