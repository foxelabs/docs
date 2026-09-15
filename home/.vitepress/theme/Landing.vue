<script setup>
import { useData } from 'vitepress'

// Content lives in the page's frontmatter so the landing page stays editable
// as markdown rather than as a component.
const { frontmatter } = useData()

// Tracks take fixed, far-apart hues — blue for software, amber for trading —
// since blue and purple read as one colour side by side. Other rows use the
// accent quad, in the marketing site's order: a hue is taken from an item's
// position among its siblings, so a row never repeats a colour until it runs
// past four — the same rule accentFor() follows on foxelabs.com.
const QUAD = ['var(--fx-acc-1)', 'var(--fx-acc-2)', 'var(--fx-acc-3)', 'var(--fx-acc-4)']
const hue = (index) => QUAD[index % QUAD.length]
const TRACK_HUES = ['var(--fx-acc-1)', 'var(--fx-acc-3)']
const trackHue = (index) => TRACK_HUES[index % TRACK_HUES.length]
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
            v-for="(track, index) in frontmatter.tracks"
            :key="track.link"
            class="track"
            :style="{ '--hue': trackHue(index) }"
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
            v-for="(link, index) in frontmatter.popular.links"
            :key="link.link"
            class="link"
            :style="{ '--hue': hue(index) }"
            :href="link.link"
            target="_self"
          >
            <span class="link__title">
              <span class="link__dot" aria-hidden="true"></span>
              {{ link.title }}
            </span>
            <span class="link__desc">{{ link.desc }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* The marketing site's kit: page-ground bands, 16px bordered cards on a lighter
   fill, mono caps micro-labels, hues only as 12% / 38% tints and dots. */
.landing {
  padding-top: var(--vp-nav-height);
}

.band {
  padding-block: clamp(3.5rem, 6vw, 5rem);
  background: var(--fx-bg);
}

.band--alt {
  background: var(--fx-bg-subtle);
  border-block: 1px solid var(--fx-border);
}

.wrap {
  max-width: 1180px;
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 4vw, 3rem);
}

.eyebrow,
.track__label {
  margin: 0;
  font-family: var(--fx-font-mono);
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fx-text-caps);
}

.hero-title {
  margin: 14px 0 24px;
  max-width: 18ch;
  font-size: clamp(2.4rem, 1.4rem + 4.2vw, 4rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: var(--fx-text);
  text-wrap: balance;
}

.hero-lead {
  margin: 0;
  max-width: 60ch;
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--fx-text-subtle);
}

/* Two tracks, side by side on desktop and stacked below it. The whole card is
   the link — a small "read the docs" target would be the only hit area on a
   card that otherwise looks clickable. */
.tracks {
  display: grid;
  gap: 24px;
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
  padding: 32px;
  border: 1px solid var(--fx-border);
  border-radius: var(--fx-r-lg);
  background: var(--fx-bg-card);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.track:hover {
  border-color: var(--fx-border-strong);
}

/* The hue as a tint pill: 12% fill, 38% border, label in the hue. */
.track__label {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--fx-r-pill);
  background: color-mix(in srgb, var(--hue) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--hue) 38%, transparent);
  color: var(--hue);
}

.track__title {
  margin: 20px 0 8px;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--fx-text);
}

.track__body {
  margin: 0 0 20px;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--fx-text-subtle);
}

.track__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
  font-size: 0.9375rem;
  color: var(--fx-text-subtle);
}

.track__list li {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* The site's .dot-list: an 8px rounded square in the card's hue. */
.track__list li::before {
  content: '';
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--hue);
}

.track__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  font-family: var(--fx-font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--fx-text);
}

.track:hover .track__cta {
  color: var(--fx-text-strong);
}

.section-title {
  margin: 0 0 8px;
  font-size: clamp(1.6rem, 1.35rem + 1.1vw, 2rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--fx-text);
}

.section-lead {
  margin: 0 0 32px;
  max-width: 60ch;
  font-size: 1rem;
  color: var(--fx-text-subtle);
}

.links {
  display: grid;
  gap: 16px;
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
  gap: 4px;
  padding: 20px 24px;
  border: 1px solid var(--fx-border);
  border-radius: var(--fx-r-lg);
  background: var(--fx-bg-card);
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.link:hover {
  border-color: var(--fx-border-strong);
}

.link__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fx-text);
}

/* The card's hue as a fill rather than on the type, so six cards read as a set
   without six differently coloured headings. */
.link__dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--hue);
}

/* Indented past the dot and its gap so the two lines start on the same edge. */
.link__desc {
  padding-left: 18px;
  font-size: 0.875rem;
  color: var(--fx-text-faint);
}
</style>
