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
    // Black fox on light tabs, white fox on dark tabs (via prefers-color-scheme).
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
        href: '/trading/favicon-black/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        media: '(prefers-color-scheme: light)',
        href: '/trading/favicon-black/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
        href: '/trading/favicon-white/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        media: '(prefers-color-scheme: dark)',
        href: '/trading/favicon-white/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/trading/favicon-white/apple-touch-icon.png',
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
        base: '/expert-advisors/gold-scalpel',
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
