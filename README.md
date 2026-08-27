# Foxe Labs Docs

The source for [docs.foxelabs.com](https://docs.foxelabs.com). Three
[VitePress](https://vitepress.dev) sites live in this repo and are published
side by side under path prefixes:

| Path | Source | Covers |
| --- | --- | --- |
| [`/`](https://docs.foxelabs.com) | [`home/`](./home) | Landing page — sends visitors into one of the two tracks |
| [`/software`](https://docs.foxelabs.com/software) | [`software/`](./software) | WordPress plugins and PHP libraries |
| [`/trading`](https://docs.foxelabs.com/trading) | [`trading/`](./trading) | Expert advisors and trading tools |

The two docs sites keep their own config, sidebar, and `public/` assets, so the
product lines can be edited and released without stepping on each other. The
header, nav, social icons and footer are shared from
[`shared/theme.mjs`](./shared/theme.mjs) so the three sites stay consistent.

Neither track has a home page of its own — the landing page at `/` is the only
chooser, and its two cards link straight into each track's intro page.

## Getting started

Requires **Node 20+**.

```bash
npm install
```

That installs all three sites at once — they are npm workspaces, so a single
install at the root is all you need.

## Local development

```bash
npm run dev:home
npm run dev:software
npm run dev:trading
```

Each command starts a VitePress dev server for that site only. Run them in
separate terminals if you need more than one.

Note that only one site runs at a time, so the **Software** and **Trading** nav
links jump to production during local development. They have to be absolute
URLs — see the gotchas below.

## Building

```bash
npm run build
```

Builds all three sites into a single merged `dist/`:

```
dist/
├── index.html   → served at /
├── software/    → served at /software/*
└── trading/     → served at /trading/*
```

To build just one, use `npm run build:home`, `build:software` or
`build:trading`. Preview a finished build with `npm run preview:home` /
`preview:software` / `preview:trading`, and clear stale output and caches with
`npm run clean`.

## Deployment

Vercel builds this repo on every push. [`vercel.json`](./vercel.json) sets the
build command and points the output at `dist/`, so Vercel serves each
subdirectory at its matching path with no rewrites needed. `/software` and
`/trading` redirect to their intro pages, since neither has an index of its own.

When importing the project, leave **Root Directory** as the repo root and set
**Framework Preset** to *Other*. Pointing the root directory at a subdirectory
would build only one site and ignore `vercel.json` entirely.

Pull requests get a Vercel preview deployment covering **all three** sites, so
changes to any of them can be reviewed before merging.

## Repo layout

```
docs/
├── home/
│   ├── .vitepress/config.mjs    base: '/' (default), builds to its own dist
│   ├── public/                  favicons and the landing banner
│   └── index.md                 the landing page
├── software/
│   ├── .vitepress/config.mjs    base: '/software/', outDir: '../dist/software'
│   ├── public/                  favicons and per-plugin images
│   └── **/*.md                  the docs themselves
├── trading/
│   ├── .vitepress/config.mjs    base: '/trading/', outDir: '../dist/trading'
│   ├── public/
│   └── **/*.md
├── shared/theme.mjs             nav, social icons and footer, shared by all three
├── package.json                 workspace root, build scripts
└── vercel.json                  deploy config
```

### Gotchas worth knowing

Most of these are the same underlying issue: **VitePress rewrites some paths by
`base` and leaves others alone.**

- **`base` must match the path prefix.** It is what makes generated asset and
  route URLs resolve under `/software/` or `/trading/`.
- **`head` entries are not rewritten by `base`.** Favicon paths and the
  `http-equiv="refresh"` redirects on section pages must be written out in full
  (`/software/favicon.svg`), not as bare root paths, or they resolve
  against the domain root.
- **Theme links _are_ rewritten by `base`.** So cross-site nav links cannot be
  root-relative: `/trading/` inside the software site would become
  `/software/trading/`. They are absolute URLs in `shared/theme.mjs`, with
  `target: '_self'` and `noIcon: true` so VitePress does not treat our own docs
  as outbound links.
- **Markdown links _are_ rewritten by `base`**, so ordinary in-page links like
  `[Getting Started](/loggedin/getting-started)` need no prefix.
- **Any link that crosses between the three sites must be an absolute URL.**
  Each site is a separate build with its own client-side router, so a
  root-relative cross-site link is resolved as a route within the current site
  and renders a 404 — while a hard refresh works, since that reaches the
  server. This covers the nav, the landing page cards, and the site title.
- **`outDir` resolves from the site root**, i.e. `software/` — which is why it
  is `../dist/software` and not `../../dist/software`.
- **`home/` builds to its own `.vitepress/dist` and is copied into `dist/`** by
  the `copy:home` script, rather than writing there directly. Pointing its
  `outDir` at `dist/` would let Vite empty the directory and take the sibling
  `software/` and `trading/` output with it, leaving build order to decide
  whether a deploy was complete.
- **READMEs are excluded** from all three sites via `srcExclude`. They link to
  directories, which are not pages, and would fail the dead-link check.

## Contributing

Small fixes are easiest through the **Edit this page on GitHub** link at the
bottom of any published page — it opens the exact source file.

For new pages or structural changes:

1. Fork the repo.
2. Branch (`git checkout -b docs/your-change`).
3. Commit your changes.
4. Open a pull request against `main`.

New pages also need a sidebar entry in the relevant
`.vitepress/config.mjs`, or they will not be reachable from the navigation.

## License

Licensed under the **GPL-2.0-or-later**.
