// Shared VitePress theme for every docs site. Each site's own
// .vitepress/theme/index.ts imports this and adds only what is specific to it,
// so the software, trading and landing builds cannot drift apart visually.
//
// Fonts are imported here rather than with a CSS @import so Vite resolves the
// package paths and bundles the woff2 files into each site's assets — the docs
// make no third-party font request.
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import DocFooter from './components/DocFooter.vue'
import SectionLabel from './components/SectionLabel.vue'

import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inconsolata'

import './tokens.css'
import './components.css'

export default {
  extends: DefaultTheme,

  // The `doc-before` slot is the only seam above a page's h1 that does not mean
  // forking the default Layout, which would need re-reconciling with every
  // VitePress release.
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(SectionLabel),
      // VitePress hides its own footer on sidebar pages, which is all of them.
      'doc-after': () => h(DocFooter),
    })
  },
}
