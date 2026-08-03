import { defineConfig } from 'vitepress'
import { nav, logoLink, socialLinks, footer } from '../../shared/theme.mjs'

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
    // Black fox on light tabs, white fox on dark tabs (via prefers-color-scheme).
    // Paths are base-prefixed: VitePress does not rewrite head hrefs by `base`.
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
        href: '/software/favicon-black/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        media: '(prefers-color-scheme: light)',
        href: '/software/favicon-black/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
        href: '/software/favicon-white/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        media: '(prefers-color-scheme: dark)',
        href: '/software/favicon-white/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/software/favicon-white/apple-touch-icon.png',
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
        text: '404 to 301',
        items: [
          { text: 'Getting Started', link: '/404-to-301/getting-started' },
          {
            text: 'Settings',
            collapsed: true,
            items: [
              { text: 'General', link: '/404-to-301/general-settings' },
              { text: 'Redirects', link: '/404-to-301/redirect-settings' },
              { text: 'Logs', link: '/404-to-301/log-settings' },
              {
                text: 'Notifications',
                link: '/404-to-301/notification-settings',
              },
              { text: 'Tools', link: '/404-to-301/tools-settings' },
            ],
          },
          {
            text: 'Redirects',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/404-to-301/redirects/' },
              {
                text: 'Match Modes & Query Handling',
                link: '/404-to-301/redirects/matching',
              },
            ],
          },
          {
            text: 'Logs',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/404-to-301/logs/' },
              { text: 'Log Actions', link: '/404-to-301/logs/actions' },
            ],
          },
          {
            text: 'Add-ons',
            base: '/404-to-301/addons',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/' },
              { text: 'Logs Cleaner', link: '/logs-cleaner' },
              { text: 'Logs Exporter', link: '/logs-exporter' },
              { text: 'Redirects Importer', link: '/redirects-importer' },
              { text: 'Email Reports', link: '/email-reports' },
              { text: 'Telegram Alerts', link: '/telegram-alerts' },
            ],
          },
          { text: 'WP-CLI', link: '/404-to-301/wp-cli' },
          { text: 'Developer Docs', link: '/404-to-301/developer-docs' },
          { text: 'Changelog', link: '/404-to-301/changelog' },
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
            text: 'Freemius Plugin Licensing',
            base: '/wp-libraries/freemius-plugin-licensing',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/overview' },
              { text: 'Installation', link: '/installation' },
              { text: 'Usage', link: '/usage' },
              { text: 'Changelog', link: '/changelog' },
            ],
          },
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
