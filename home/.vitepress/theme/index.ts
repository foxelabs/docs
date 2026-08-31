// The landing page at the root is a custom component rather than VitePress's
// home layout, so it can use the marketing site's bands and cards. Registering
// it globally lets index.md drop <Landing /> into a plain page layout, which
// keeps the nav and footer without the stock hero.
import FoxeTheme from '../../../shared/theme/index.mjs'
import Landing from './Landing.vue'

export default {
  ...FoxeTheme,
  enhanceApp(ctx: { app: { component: (name: string, c: unknown) => void } }) {
    FoxeTheme.enhanceApp?.(ctx)
    ctx.app.component('Landing', Landing)
  },
}
