# Foxe Labs Trading Docs

The trading half of [docs.foxelabs.com](https://docs.foxelabs.com) — published
at **[/trading](https://docs.foxelabs.com/trading)**. Covers our MetaTrader
expert advisors and trading tools.

This is one of three VitePress sites in this repo; see the
[root README](../README.md) for the overall setup.

There is no home page here — the landing page at
[`/`](https://docs.foxelabs.com) is the chooser, and it links straight to
`get-started` as this track's intro page. `/trading` redirects there too, via
[`vercel.json`](../vercel.json).

## What lives here

| Section | Directory |
| --- | --- |
| Getting started | [`get-started.md`](./get-started.md) |
| Gold Scalpel | [`expert-advisors/gold-scalpel/`](./expert-advisors/gold-scalpel) |

Each expert advisor gets its own directory under `expert-advisors/`, typically
with getting-started, how-it-works, performance, an inputs reference, and a
changelog. Images and favicons live in [`public/`](./public).

## Working on these docs

From the repo root:

```bash
npm run dev:trading
```

Build just this site with `npm run build:trading` — output lands in
`../dist/trading`.

## Adding a page

1. Create the Markdown file in the relevant product directory.
2. Add a sidebar entry in [`.vitepress/config.mjs`](./.vitepress/config.mjs).
   Pages without one are built but unreachable from the navigation.
3. Reference images as root-relative paths from `public/`, e.g.
   `/gold-scalpel/inputs.png`.

Search is VitePress's built-in local provider, so new pages are indexed
automatically on the next build — nothing external to update.

## Adding a new expert advisor

Create `expert-advisors/<name>/` and add a matching top-level sidebar group in
`.vitepress/config.mjs` using `base: '/expert-advisors/<name>'` so the child
links stay short. Mirror the Gold Scalpel page set as a starting point.

## License

Licensed under the **GPL-2.0-or-later**.
