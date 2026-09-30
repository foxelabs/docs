---
title: Appearance
description: Pick Convocept's light or dark palette and an accent colour. The thread uses your theme's font.
---

# Appearance

**Comments → Convocept → Appearance** sets how the thread looks. For deeper
changes, see [Theming](/convocept/theming).

The thread has its own simple design: a card with its own background, text
sizes, spacing, fields and buttons, so it looks the same and stays readable
in every theme. Only the font family comes from your theme. Theme styles for
comment sections (buttons, inputs, lists, headings) don't reach it.

[[toc]]

## Colour scheme

| Option | What readers see |
| --- | --- |
| **Light** (default) | Dark text on a white card. Fits light, tinted and dark themes alike. |
| **Dark** | Light text on a dark card, for dark themes. |
| **Follow the reader's device** | Light or dark, from the reader's system setting (`prefers-color-scheme`). |

The thread is at most 720px wide (or your block theme's content width, if
narrower) and centred, so it stays readable in themes that give comments the
full page width.

## Accent colour

Used for links, buttons and focus rings in the thread. Default: **#2563eb**
(blue). Click the colour to open the picker: pick any colour, type a hex
value, or choose one of your theme's colours or the suggested ones.
**Reset** goes back to the default. The **Preview** under it shows a
comment and the form in the colours you picked.

If the colour is too light to read as text on white (a contrast below
4.5:1), the screen warns you. Links are drawn slightly darker than the
accent anyway, mixed toward the text colour, so they stay readable on light
and dark backgrounds.

## Accessibility

Every palette is checked against **WCAG 2.2 AA** for text and control
contrast, in light and dark, and the thread respects the reader's
**reduced motion** setting. Keep contrast at 4.5:1 or more if you change
colours with CSS.
