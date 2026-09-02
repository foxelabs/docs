import { defineConfig } from 'vitepress'
import { nav, logo, logoLink, socialLinks, footer, shareHead, shareTags } from '../../shared/theme.mjs'

export default defineConfig({
  title: 'Foxe Labs Docs',
  description: 'Official documentation for Foxe Labs software',
  lastUpdated: true,
  cleanUrls: true,
  base: '/software/',
  outDir: '../dist/software',
  // READMEs are for GitHub only — they link to directories, which are not pages.
  srcExclude: ['**/README.md'],
  head: [
    // One icon for every theme: white fox head in a rounded black tile, so it
    // reads on light and dark tabs alike. .ico is the fallback for browsers
    // without SVG icons — Safari never uses the SVG.
    ['link', { rel: 'icon', href: '/software/favicon.ico', sizes: '48x48 32x32 16x16' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/software/favicon-96x96.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
        href: '/software/favicon.svg',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/software/apple-touch-icon.png',
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
    ...shareHead,
  ],
  // Per-page title, description and canonical URL for share previews.
  transformHead: shareTags('/software/'),

  themeConfig: {
    logo,
    nav,
    logoLink,

    sidebar: [
      {
        text: 'Introduction',
        items: [{ text: 'Get Started', link: '/get-started' }],
      },
      {
        text: 'Loggedin',
        items: [
          { text: 'Getting Started', link: '/loggedin/getting-started' },
          { text: 'General Settings', link: '/loggedin/general-settings' },
          { text: 'Force Logout', link: '/loggedin/force-logout' },
          { text: 'WP-CLI', link: '/loggedin/wp-cli' },
          {
            text: 'Add-ons',
            base: '/loggedin/addons',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/' },
              { text: 'Active Sessions', link: '/active-sessions' },
              { text: 'Auto Logout', link: '/auto-logout' },
              { text: 'Real-time Logout', link: '/realtime-logout' },
              { text: 'Limit Per User', link: '/limit-per-user' },
              { text: 'Limit Per Role', link: '/limit-per-role' },
            ],
          },
          { text: 'Developer Docs', link: '/loggedin/developer-docs' },
          { text: 'Changelog', link: '/loggedin/changelog' },
        ],
      },
      {
        text: 'Lazy Load for Comments',
        items: [
          {
            text: 'Getting Started',
            link: '/lazy-load-for-comments/getting-started',
          },
          {
            text: 'Loading Behaviour',
            link: '/lazy-load-for-comments/loading-behaviour',
          },
          { text: 'Load Button', link: '/lazy-load-for-comments/load-button' },
          { text: 'Cache Management', link: '/lazy-load-for-comments/cache' },
          {
            text: 'Developer Docs',
            link: '/lazy-load-for-comments/developer-docs',
          },
        ],
      },
      {
        text: 'WordPress Libraries',
        items: [
          { text: 'Overview', link: '/wp-libraries/' },
          {
            text: 'WP Cache Helper',
            base: '/wp-libraries/wp-cache-helper',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/overview' },
              { text: 'Installation', link: '/installation' },
              { text: 'Usage', link: '/usage' },
              { text: 'Changelog', link: '/changelog' },
            ],
          },
          {
            text: 'WP Flash Notices',
            base: '/wp-libraries/wp-flash-notices',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/overview' },
              { text: 'Installation', link: '/installation' },
              { text: 'Usage', link: '/usage' },
              { text: 'Changelog', link: '/changelog' },
            ],
          },
          {
            text: 'WP Freemius Client',
            base: '/wp-libraries/wp-freemius-client',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/overview' },
              { text: 'Installation', link: '/installation' },
              { text: 'Usage', link: '/usage' },
              { text: 'Changelog', link: '/changelog' },
            ],
          },
          {
            text: 'WP Queue Process',
            base: '/wp-libraries/wp-queue-process',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/overview' },
              { text: 'Installation', link: '/installation' },
              { text: 'Usage', link: '/usage' },
              { text: 'Changelog', link: '/changelog' },
            ],
          },
          {
            text: 'WP Review Notice',
            base: '/wp-libraries/wp-review-notice',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/overview' },
              { text: 'Installation', link: '/installation' },
              { text: 'Usage', link: '/usage' },
              { text: 'Changelog', link: '/changelog' },
            ],
          },
        ],
      },
    ],

    socialLinks,

    editLink: {
      pattern: 'https://github.com/foxelabs/docs/edit/main/software/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    footer,
  },
})
