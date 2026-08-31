// Shared VitePress theme for every docs site. Each site's own
// .vitepress/theme/index.ts imports this and adds only what is specific to it,
// so the software, trading and landing builds cannot drift apart visually.
//
// Fonts are imported here rather than with a CSS @import so Vite resolves the
// package paths and bundles the woff2 files into each site's assets.
import DefaultTheme from 'vitepress/theme'

import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

import './tokens.css'
import './components.css'

export default DefaultTheme
