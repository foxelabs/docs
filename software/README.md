# Foxe Labs Software Docs

The software half of [docs.foxelabs.com](https://docs.foxelabs.com) — published
at **[/software](https://docs.foxelabs.com/software)**. Covers our WordPress
plugins and PHP libraries.

This is one of three VitePress sites in this repo; see the
[root README](../README.md) for the overall setup.

There is no home page here — the landing page at
[`/`](https://docs.foxelabs.com) is the chooser, and it links straight to
`general/getting-help` as this track's intro page. `/software` redirects there
too, via [`vercel.json`](../vercel.json).

## What lives here

| Section | Directory |
| --- | --- |
| General guides (installing, updating, getting help) | [`general/`](./general) |
| Loggedin | [`loggedin/`](./loggedin) |
| 404 to 301 | [`404-to-301/`](./404-to-301) |
| Lazy Load for Comments | [`lazy-load-for-comments/`](./lazy-load-for-comments) |
| WordPress libraries | [`wp-libraries/`](./wp-libraries) |

Images and favicons live in [`public/`](./public), organised per product.

## Working on these docs

From the repo root:

```bash
npm run dev:software
```

Build just this site with `npm run build:software` — output lands in
`../dist/software`.

## Adding a page

1. Create the Markdown file in the relevant product directory.
2. Add a sidebar entry in [`.vitepress/config.mjs`](./.vitepress/config.mjs).
   Pages without one are built but unreachable from the navigation.
3. Reference images as root-relative paths from `public/`, e.g.
   `/loggedin/settings.png`.

Search is VitePress's built-in local provider, so new pages are indexed
automatically on the next build — nothing external to update.

Each product directory has an `index.md` that redirects to that product's
getting-started page. Those redirects live in frontmatter `head`, which
VitePress does **not** rewrite by `base`, so the URL must include the prefix:
`url=/software/loggedin/getting-started`.

## A note on naming

The prose here refers to **Foxe Labs**, but code identifiers still use the
original `DuckDev` namespace — `DuckDev\Loggedin\`, the `duckdev/*` Composer
packages, and `duckdev_*` filter and action names. That is intentional: those
are the real symbols in the shipped plugins and libraries. Renaming them in
the docs would document an API that does not exist. They should only change
here after the corresponding code migration ships.

## License

Licensed under the **GPL-2.0-or-later**.
