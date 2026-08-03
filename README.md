# Foxe Labs Docs

The source for [docs.foxelabs.com](https://docs.foxelabs.com). Two independent
[VitePress](https://vitepress.dev) sites live in this repo and are published
side by side under path prefixes:

| Path | Source | Covers |
| --- | --- | --- |
| [`/software`](https://docs.foxelabs.com/software) | [`software/`](./software) | WordPress plugins and PHP libraries |
| [`/trading`](https://docs.foxelabs.com/trading) | [`trading/`](./trading) | Expert advisors and trading tools |

Each site keeps its own config, sidebar, and `public/` assets, so the two
product lines can be edited and released without stepping on each other.

## Getting started

Requires **Node 20+**.

```bash
npm install
```

That installs both sites at once — they are npm workspaces, so a single
install at the root is all you need.

## Local development

```bash
npm run dev:software
npm run dev:trading
```

Each command starts a VitePress dev server for that site only. Run them in
separate terminals if you need both.

## Building

```bash
npm run build
```

Builds both sites into a single merged `dist/`:

```
dist/
├── software/   → served at /software/*
└── trading/    → served at /trading/*
```

To build just one, use `npm run build:software` or `npm run build:trading`.
Preview a finished build with `npm run preview:software` / `preview:trading`,
and clear stale output and caches with `npm run clean`.

## Deployment

Vercel builds this repo on every push. [`vercel.json`](./vercel.json) sets the
build command and points the output at `dist/`, so Vercel serves each
subdirectory at its matching path with no rewrites needed. `/` redirects to
`/software/`.

Pull requests get a Vercel preview deployment covering **both** sites, so
changes to either can be reviewed before merging.

## Repo layout

```
docs/
├── software/
│   ├── .vitepress/config.mjs    base: '/software/', outDir: '../dist/software'
│   ├── public/                  favicons and per-plugin images
│   └── **/*.md                  the docs themselves
├── trading/
│   ├── .vitepress/config.mjs    base: '/trading/', outDir: '../dist/trading'
│   ├── public/
│   └── **/*.md
├── package.json                 workspace root, build scripts
└── vercel.json                  deploy config
```

### Gotchas worth knowing

- **`base` must match the path prefix.** It is what makes generated asset and
  route URLs resolve under `/software/` or `/trading/`.
- **`head` links are not rewritten by `base`.** VitePress leaves `head`
  entries alone, so favicon and icon paths must be written out in full
  (`/software/favicon-white/...`), not as bare root paths.
- **`outDir` resolves from the site root**, i.e. `software/` — which is why it
  is `../dist/software` and not `../../dist/software`.

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
