---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Foxe Labs"
  text: "Trading Documentation"
  tagline: Open-source software development, algorithmic trading systems, and custom Expert Advisors (EAs).
  actions:
    - theme: brand
      text: Get Started
      link: /get-started
    - theme: alt
      text: Get Support
      link: mailto:support@foxelabs.com
  image:
    src: /banner.svg
    alt: Foxe Labs

features:
  - title: Gold Scalpel EA
    icon:
      src: /coins.svg
      width: 30
      height: 30
      wrap: true
    details: A precision breakout scalper for MetaTrader 5, pre-tuned for XAUUSD (Gold). Automatic breakeven and trailing, percentage-risk position sizing, an optional losing-streak cooldown, and an automatic weekend pause. Read the docs to install, understand the approach, and set your risk.
    link: ./expert-advisors/gold-scalpel/getting-started
    linkText: Read the docs
  - title: TickerLog
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 24 24" fill="none" stroke="#3aa0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><line x1="4" y1="7" x2="1.5" y2="7"/><line x1="4" y1="12" x2="1.5" y2="12"/><line x1="4" y1="17" x2="1.5" y2="17"/><polyline points="8 13 10.5 10.5 13 12.5 16 8.5"/></svg>
    details: Our upcoming trading journal — a globally supported journal with auto-sync for all popular brokers and built-in AI integration to analyze and improve your trading. Documentation will land here when it ships.
  - title: Custom EA Development
    icon: <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 24 24" fill="none" stroke="#a06bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="13" y1="4" x2="11" y2="20"/></svg>
    details: Need a strategy automated or an existing EA refined? Foxe Labs builds custom Expert Advisors and algorithmic trading tools for MetaTrader 5. Tell us what you're after and we'll take it from there.
    link: mailto:support@foxelabs.com
    linkText: Get in touch
---

