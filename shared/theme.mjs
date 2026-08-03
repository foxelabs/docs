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
    link: `${SITE_URL}/software/general/getting-help`,
    target: '_self',
    noIcon: true,
  },
  {
    text: 'Trading',
    link: `${SITE_URL}/trading/get-started`,
    target: '_self',
    noIcon: true,
  },
  { text: 'Support', link: 'mailto:support@foxelabs.com', noIcon: true },
]

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
