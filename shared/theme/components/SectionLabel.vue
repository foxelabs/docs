<script setup>
/*
 * The micro-label above a page title, naming the sidebar group the page
 * belongs to — "Loggedin" above "General Settings".
 *
 * It is derived, not written: nothing goes in a page's frontmatter, so a page
 * moved to another group in config.mjs relabels itself and cannot disagree with
 * the sidebar. Nested groups (Add-ons) are searched too, with their `base`
 * joined on, but the label stays the top-level group. A page in no group
 * renders nothing rather than an empty line.
 */
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const { theme } = useData()
const route = useRoute()

/* Compare paths, not strings as written. A sidebar link is authored
   `/loggedin/wp-cli` while the route arrives as `/software/loggedin/wp-cli.html`. */
function normalise(path) {
  return path
    .replace(/\.html$/, '')
    .replace(/\/index$/, '/')
    .replace(/\/$/, '') || '/'
}

function contains(items, here, base = '') {
  return items.some((item) => {
    const itemBase = item.base ?? base
    if (item.link && normalise(withBase(itemBase + item.link)) === here) return true
    return item.items ? contains(item.items, here, itemBase) : false
  })
}

const label = computed(() => {
  const here = normalise(route.path)
  const groups = Array.isArray(theme.value.sidebar) ? theme.value.sidebar : []
  return groups.find((group) => contains(group.items ?? [], here))?.text ?? ''
})
</script>

<template>
  <div v-if="label" class="fx-section-label">{{ label }}</div>
</template>

<style scoped>
/* The kit's uppercase micro-label: mono, 11px, tracked, in the caps grey. */
.fx-section-label {
  margin-bottom: 12px;
  font-family: var(--fx-font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 16px;
  color: var(--fx-text-caps);
}
</style>
