---
# Card links must be absolute URLs, not root-relative paths. Each site is a
# separate VitePress build with its own client-side router, so '/software/...'
# would be resolved as a route within this site and render a 404. `target`
# keeps them opening in the same tab.
layout: home

hero:
  name: "Foxe Labs"
  text: "Documentation"
  tagline: Guides, references and changelogs for everything we build — open-source WordPress plugins and PHP libraries, and algorithmic trading tools for MetaTrader 5.
  image:
    src: /documentation.svg
    alt: Foxe Labs

features:
  - title: Software
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 24 24" fill="none" stroke="#3aa0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    details: WordPress plugins and PHP libraries — Loggedin, Lazy Load for Comments, and our reusable WordPress libraries. Installation, settings, WP-CLI, developer reference and changelogs.
    link: https://docs.foxelabs.com/software/get-started
    linkText: Read the software docs
    target: _self
  - title: Trading
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 24 24" fill="none" stroke="#d4a017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>
    details: Expert advisors and trading tools for MetaTrader 5, starting with Gold Scalpel. Setup, how each strategy works, performance notes, full inputs reference and changelogs.
    link: https://docs.foxelabs.com/trading/get-started
    linkText: Read the trading docs
    target: _self
---
