import { defineConfig } from 'vitepress'
import { nav, logo, logoLink, socialLinks, footer } from '../../shared/theme.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Foxe Labs Docs',
  description: 'Official documentation for Foxe Labs',
  base: '/trading/',
  outDir: '../dist/trading',
  // READMEs are for GitHub only — they link to directories, which are not pages.
  srcExclude: ['**/README.md'],
  lastUpdated: true,
  cleanUrls: true,
  head: [
    // One icon for every theme: white fox head in a rounded black tile, so it
    // reads on light and dark tabs alike. .ico is the fallback for browsers
    // without SVG icons — Safari never uses the SVG.
    ['link', { rel: 'icon', href: '/trading/favicon.ico', sizes: '48x48 32x32 16x16' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/trading/favicon-96x96.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
        href: '/trading/favicon.svg',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/trading/apple-touch-icon.png',
      },
    ],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Foxe Labs' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo,
    nav,
    logoLink,

    sidebar: [
      {
        text: 'Introduction',
        items: [{ text: 'Get Started', link: '/get-started' }],
      },
      {
        text: 'Gold Scalpel',
        base: '/gold-scalpel',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'How It Works', link: '/how-it-works' },
          { text: 'Performance', link: '/performance' },
          { text: 'Inputs Reference', link: '/input-reference' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],

    socialLinks,

    editLink: {
      pattern: 'https://github.com/foxelabs/docs/edit/main/trading/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    footer,
  },
})
