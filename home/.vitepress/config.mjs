import { defineConfig } from 'vitepress'
// No logoLink here: this site is already at the root, so the title's default
// link is correct.
import { nav, logo, socialLinks, footer } from '../../shared/theme.mjs'

// The landing page at the root of docs.foxelabs.com. It exists only to send
// visitors into one of the two tracks, so it has no sidebar and no search.
//
// Built into its own .vitepress/dist and copied into dist/ by the root build,
// rather than pointing outDir straight at dist/ — a build here would otherwise
// risk emptying the sibling software/ and trading/ output.
export default defineConfig({
  title: 'Foxe Labs Docs',
  description: 'Documentation for Foxe Labs software and trading products.',
  cleanUrls: true,
  srcExclude: ['**/README.md'],
  head: [
    // One icon for every theme: black fox in a rounded white tile, so it reads on
    // light and dark tabs alike. .ico is the fallback for browsers without SVG icons.
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
        href: '/favicon.svg',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Foxe Labs' }],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-5SN0WR5ETP',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'G-5SN0WR5ETP');`,
    ],
  ],
  themeConfig: {
    logo,
    nav,
    socialLinks,
    footer,
  },
})
