// Header, nav, social icons and footer shared by both docs sites, so the two
// halves of docs.foxelabs.com stay visually identical.
//
// Cross-site nav links must be absolute URLs, not root-relative paths:
// VitePress prefixes theme links with the site's `base`, so '/trading/' inside
// the software site would resolve to '/software/trading/'. The trade-off is
// that clicking across tracks in local dev jumps to production, since only one
// site runs at a time.

export const SITE_URL = 'https://docs.foxelabs.com'

// Each track links to its intro page rather than a section root: the two sites
// have no home page of their own, since the landing page at / is the chooser.
//
// `target`/`noIcon` stop VitePress treating these as outbound links — without
// them our own docs would open in a new tab with an external-link arrow.
export const nav = [
  {
    text: 'Software',
    link: `${SITE_URL}/software/get-started`,
    target: '_self',
    noIcon: true,
  },
  {
    text: 'Trading',
    link: `${SITE_URL}/trading/get-started`,
    target: '_self',
    noIcon: true,
  },
  {
    text: 'Support',
    link: 'https://foxelabs.com/contact/',
    target: '_self',
    noIcon: true,
  },
]

// The same mark the marketing site's navbar uses, painted at 26px. It is a
// single-colour silhouette on a transparent ground, so it needs one file per
// appearance: the marketing site recolours a single copy through a CSS mask,
// but a VitePress logo is an <img>, and a light/dark pair is what the theme
// understands.
//
// The paths are root-relative on purpose: unlike `head` entries, the logo is
// rendered through the theme and so it does get prefixed with each site's
// `base` — which is why all three sites keep their own copy in public/.
export const logo = {
  light: '/foxe-on-light.svg',
  dark: '/foxe-on-dark.svg',
  alt: '',
}

// The wordmark beside the logo. Every site shares it, so the three builds'
// own `title` values never leak into the navbar; the "Docs" pill after it is
// drawn by components.css.
export const siteTitle = 'Foxe Labs'

// The site title in the navbar. It would otherwise point at the site's own
// `base` — e.g. '/software/' — which has no index page, so client-side routing
// renders a 404 and only a hard refresh reaches the Vercel redirect. Sending it
// to the landing page instead makes it behave like a normal home link.
export const logoLink = {
  link: `${SITE_URL}/`,
  target: '_self',
  rel: '',
}

export const socialLinks = [
  { icon: 'github', link: 'https://github.com/foxelabs' },
  { icon: 'twitter', link: 'https://x.com/foxelabs' },
  { icon: 'facebook', link: 'https://facebook.com/foxelabs' },
  { icon: 'instagram', link: 'https://instagram.com/foxelabs' },
  { icon: 'youtube', link: 'https://youtube.com/@foxelabs' },
]

// Shown only on pages without a sidebar (the landing page); doc pages carry
// the same line through theme/components/DocFooter.vue.
export const footer = {
  message: '<a href="https://foxelabs.com/legal/terms/">Terms</a> · <a href="https://foxelabs.com/legal/privacy/">Privacy</a> · <a href="https://foxelabs.com/legal/refunds/">Refunds</a> · <a href="https://foxelabs.com/contact/">Support</a>',
  copyright: `Copyright © ${new Date().getFullYear()} Foxe Labs LLP · Kerala, India`,
}

// Share preview (Open Graph + Twitter card), shared by both docs sites.
//
// One banner serves every page: docs pages are a reference set, and a hundred
// generated cards would say the same thing a hundred times. The per-page part
// of the preview is the title and description, which transformHead fills in
// below, so a shared link still names the page it points at.
//
// The file lives in the landing site's public/, which the root build copies to
// dist/ — so it is served from the domain root for all three sites.
export const BANNER = `${SITE_URL}/social-banner.png`

/** Static share tags. Spread into a site's `head` after the icons. */
export const shareHead = [
  ['meta', { property: 'og:site_name', content: 'Foxe Labs Docs' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:image', content: BANNER }],
  ['meta', { property: 'og:image:type', content: 'image/png' }],
  ['meta', { property: 'og:image:width', content: '1200' }],
  ['meta', { property: 'og:image:height', content: '630' }],
  [
    'meta',
    {
      property: 'og:image:alt',
      content: 'Foxe Labs Docs — guides and reference for every Foxe Labs tool',
    },
  ],
  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:site', content: '@foxelabs' }],
  ['meta', { name: 'twitter:image', content: BANNER }],
]

// Product each docs section belongs to, keyed by path prefix within a site.
// Pages like "Changelog" or "Usage" exist once per product, so the product
// name goes into their titles to keep every title on the domain unique.
const PRODUCTS = {
  "better-disqus-comments/": "Better Disqus Comments",
  "loggedin/": "Loggedin",
  "lazy-load-for-comments/": "Lazy Load for Comments",
  "wp-libraries/wp-cache-helper/": "WP Cache Helper",
  "wp-libraries/wp-flash-notices/": "WP Flash Notices",
  "wp-libraries/wp-freemius-client/": "WP Freemius Client",
  "wp-libraries/wp-queue-process/": "WP Queue Process",
  "wp-libraries/wp-review-notice/": "WP Review Notice",
  "gold-scalpel/": "Gold Scalpel",
}

// Pages outside any product fall back to the track name.
const TRACKS = { "/software/": "Foxe Labs Software", "/trading/": "Foxe Labs Trading" }

/** Everything after the page heading in its title: product, then site. */
const titleSuffix = (base, pageData) => {
  const heading = pageHeading(pageData)
  if (heading.includes('Foxe Labs')) return ''
  const prefix = Object.keys(PRODUCTS).find((key) =>
    pageData.relativePath.startsWith(key)
  )
  const product = prefix ? PRODUCTS[prefix] : TRACKS[base]
  return product && !heading.includes(product)
    ? ` — ${product} | Foxe Labs Docs`
    : ' | Foxe Labs Docs'
}

// frontmatter wins, then the page's own H1, then the site title. `??` is no
// use here: VitePress fills both fields with '' rather than leaving them
// undefined, so the fallbacks have to be falsy-checked.
const pageHeading = (pageData) =>
  pageData.frontmatter.title || pageData.title || 'Foxe Labs Docs'

/**
 * Gives each page a title template carrying its product name. Returned as a
 * `transformPageData` for defineConfig.
 */
export const pageTitles = (base = '/') => (pageData) => {
  pageData.titleTemplate = ':title' + titleSuffix(base, pageData)
}

/**
 * Per-page share tags: the title, description and canonical URL of the page
 * being rendered. `base` is the site's VitePress base ('/' for the landing
 * site), which the page path has to be joined onto — pageData paths are
 * relative to each site's own root.
 *
 * Returned as a `transformHead` for defineConfig.
 */
export const shareTags = (base = '/') => ({ pageData }) => {
  const path = pageData.relativePath.replace(/(?:index)?\.md$/, '')
  const url = `${SITE_URL}${base}${path}`
  const title = pageHeading(pageData) + titleSuffix(base, pageData)
  const description =
    pageData.frontmatter.description ||
    pageData.description ||
    'Documentation for Foxe Labs software and trading products.'

  // Redirect stubs declare their own canonical (the redirect target) in
  // frontmatter; a second one here would contradict it.
  const hasCanonical = (pageData.frontmatter.head || []).some(
    ([tag, attrs]) => tag === 'link' && attrs?.rel === 'canonical'
  )

  return [
    ...(hasCanonical ? [] : [['link', { rel: 'canonical', href: url }]]),
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
  ]
}
