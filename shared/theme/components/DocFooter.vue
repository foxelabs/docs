<script setup>
/*
 * The credit line under every doc page, matching the marketing site's footer
 * bar. VitePress's own `footer` is not rendered on pages with a sidebar, so
 * this sits in the `doc-after` slot instead. The year is stamped at build time.
 */
const year = new Date().getFullYear()
</script>

<template>
  <footer class="fx-doc-footer">
    <p>
      Copyright © {{ year }} Foxe Labs LLP · Kerala, India
    </p>
    <p>
      <a href="https://foxelabs.com/legal/terms/" target="_blank" rel="noopener">Terms</a>
      ·
      <a href="https://foxelabs.com/legal/privacy/" target="_blank" rel="noopener">Privacy</a>
      ·
      <a href="https://foxelabs.com/legal/refunds/" target="_blank" rel="noopener">Refunds</a>
      ·
      <a href="https://foxelabs.com/contact/" target="_blank" rel="noopener">Support</a>
    </p>
  </footer>
</template>

<style scoped>
.fx-doc-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--fx-border);
  font-family: var(--fx-font-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--fx-text-faint);
}
.fx-doc-footer p { margin: 0; }
.fx-doc-footer a {
  color: var(--fx-text);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;
}
.fx-doc-footer a:hover { color: var(--fx-text-strong); }
</style>
