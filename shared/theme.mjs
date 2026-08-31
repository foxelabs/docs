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

// Fox mark shown beside the site title. One file for both themes, inverted by
// CSS in dark -- a light and a dark variant would both be fetched on every
// page, since VitePress renders both and hides one. Inverting is exact here
// because the mark is a single colour. The path is root-relative on purpose:
// unlike `head` entries, the logo is rendered through the theme and so it does
// get prefixed with each site's `base`.
// A PNG, not an SVG: the redrawn mark was delivered as a raster, so there is
// no vector to ship. It paints at 24px in the navbar, which 256 covers well
// past 3x.
export const logo = {
  src: '/mark.png',
  alt: 'Foxe Labs',
}

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

export const footer = {
  copyright: `Copyright © ${new Date().getFullYear()}, <a href="https://foxelabs.com">Foxe Labs</a>. All rights reserved.`,
}
