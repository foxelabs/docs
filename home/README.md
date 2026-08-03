# Foxe Labs Docs — Landing Page

The page served at the root of [docs.foxelabs.com](https://docs.foxelabs.com).
Its only job is to offer the two tracks and send visitors into one of them.

This is one of three VitePress sites in this repo; see the
[root README](../README.md) for the overall setup.

## Why it is a VitePress site

A hand-written `index.html` would have been simpler, but it would need its own
styling and would drift from the docs' look, including light and dark themes.
Building it with VitePress means it picks up the shared header, nav, social
icons and footer from [`shared/theme.mjs`](../shared/theme.mjs) for free.

It has no sidebar and no search — there is only one page.

## What to edit

Everything lives in [`index.md`](./index.md): the hero copy and the two cards.
The cards link to each track's intro page, **not** to a section root, since
neither track has a home page of its own:

| Card | Links to |
| --- | --- |
| Software | `/software/general/getting-help` |
| Trading | `/trading/get-started` |

If either intro page is ever renamed, update the card here, the nav in
`shared/theme.mjs`, and the redirect in [`vercel.json`](../vercel.json) — all
three point at it.

## Working on it

From the repo root:

```bash
npm run dev:home
```

Build just this site with `npm run build:home`. Unlike the other two, it builds
to its own `.vitepress/dist` and is then copied into `dist/` by the `copy:home`
script. Writing straight to `dist/` would let Vite empty the directory and take
the sibling `software/` and `trading/` output with it.

## License

Licensed under the **GPL-2.0-or-later**.
