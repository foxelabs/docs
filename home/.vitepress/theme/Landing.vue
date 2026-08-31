<script setup>
import { useData } from 'vitepress'

// Content lives in the page's frontmatter so the landing page stays editable
// as markdown rather than as a component.
const { frontmatter } = useData()
</script>

<template>
  <div class="landing">
    <section class="band">
      <div class="wrap">
        <p class="eyebrow">{{ frontmatter.eyebrow }}</p>
        <h1 class="hero-title">{{ frontmatter.title }}</h1>
        <p class="hero-lead">{{ frontmatter.lead }}</p>
      </div>
    </section>

    <section class="band band--alt">
      <div class="wrap">
        <div class="tracks">
          <a
            v-for="track in frontmatter.tracks"
            :key="track.link"
            class="track"
            :href="track.link"
            target="_self"
          >
            <span class="track__label">{{ track.label }}</span>
            <h2 class="track__title">{{ track.title }}</h2>
            <p class="track__body">{{ track.body }}</p>
            <ul class="track__list">
              <li v-for="item in track.covers" :key="item">{{ item }}</li>
            </ul>
            <span class="track__cta">
              {{ track.cta }}
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>

    <section v-if="frontmatter.popular" class="band">
      <div class="wrap">
        <h2 class="section-title">{{ frontmatter.popular.title }}</h2>
        <p class="section-lead">{{ frontmatter.popular.lead }}</p>
        <div class="links">
          <a
            v-for="link in frontmatter.popular.links"
            :key="link.link"
            class="link"
            :href="link.link"
            target="_self"
          >
            <span class="link__title">{{ link.title }}</span>
            <span class="link__desc">{{ link.desc }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing {
  padding-top: var(--vp-nav-height);
}

.band {
  padding-block: clamp(3.5rem, 6vw, 5rem);
  background: var(--vp-c-bg);
}

.band--alt {
  background: var(--vp-c-bg-alt);
}

.wrap {
  max-width: 1152px;
  margin-inline: auto;
  padding-inline: 24px;
}

.eyebrow {
  margin: 0 0 var(--fx-space-150);
  font-size: var(--fx-text-ui);
  font-weight: var(--fx-fw-bold);
  color: var(--vp-c-brand-1);
}

.hero-title {
  margin: 0 0 var(--fx-space-300);
  max-width: 18ch;
  font-family: var(--fx-font-display);
  font-size: clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem);
  font-weight: var(--fx-fw-display);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  text-wrap: balance;
}

.hero-lead {
  margin: 0;
  max-width: 60ch;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Two tracks, side by side on desktop and stacked below it. The whole card is
   the link — a small "read the docs" target would be the only hit area on a
   card that otherwise looks clickable. */
.tracks {
  display: grid;
  gap: var(--fx-space-300);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .tracks {
    grid-template-columns: repeat(2, 1fr);
  }
}

.track {
  display: flex;
  flex-direction: column;
  padding: var(--fx-space-400);
  border-radius: var(--fx-r-md);
  background: var(--vp-c-bg);
  box-shadow: var(--fx-shadow-raised);
  color: inherit;
  text-decoration: none;
  transition: background-color 0.1s ease, box-shadow 0.1s ease;
}

.track:hover {
  background: var(--vp-c-bg-soft);
  box-shadow: var(--fx-shadow-overlay);
}

.track__label {
  font-size: 11px;
  font-weight: var(--fx-fw-bold);
  line-height: 16px;
  text-transform: uppercase;
  color: var(--fx-b500);
  background: var(--fx-b50);
  border-radius: 3px;
  padding: 2px var(--fx-space-050);
  align-self: flex-start;
}

.track__title {
  margin: var(--fx-space-200) 0 var(--fx-space-100);
  font-family: var(--fx-font-display);
  font-size: var(--fx-text-h3);
  font-weight: var(--fx-fw-display);
  line-height: 1.18;
  letter-spacing: -0.018em;
  color: var(--vp-c-text-1);
}

.track__body {
  margin: 0 0 var(--fx-space-200);
  font-size: var(--fx-text-ui);
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.track__list {
  margin: 0 0 var(--fx-space-300);
  padding: 0;
  list-style: none;
  font-size: var(--fx-text-ui);
  color: var(--vp-c-text-2);
}

.track__list li {
  padding-left: 18px;
  margin-bottom: var(--fx-space-050);
  position: relative;
}

.track__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.track__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--fx-space-100);
  margin-top: auto;
  font-size: var(--fx-text-ui);
  font-weight: var(--fx-fw-medium);
  color: var(--vp-c-brand-1);
}

.section-title {
  margin: 0 0 var(--fx-space-100);
  font-family: var(--fx-font-display);
  font-size: var(--fx-text-h2);
  font-weight: var(--fx-fw-display);
  line-height: 1.12;
  letter-spacing: -0.022em;
  color: var(--vp-c-text-1);
}

.section-lead {
  margin: 0 0 var(--fx-space-400);
  max-width: 60ch;
  font-size: var(--fx-text-body);
  color: var(--vp-c-text-2);
}

.links {
  display: grid;
  gap: var(--fx-space-200);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .links {
    grid-template-columns: repeat(3, 1fr);
  }
}

.link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--fx-space-200);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--fx-r-md);
  text-decoration: none;
  transition: background-color 0.1s ease, border-color 0.1s ease;
}

.link:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.link__title {
  font-family: var(--fx-font-display);
  font-size: var(--fx-text-ui);
  font-weight: var(--fx-fw-subhead);
  color: var(--vp-c-text-1);
}

.link__desc {
  font-size: var(--fx-text-small);
  color: var(--vp-c-text-3);
}
</style>
