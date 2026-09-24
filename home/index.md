---
# A plain page layout, not VitePress's home layout: the landing content is a
# custom component styled with the marketing site's bands and cards.
#
# Track and link URLs must be absolute, not root-relative. Each site is a
# separate VitePress build with its own client-side router, so '/software/...'
# would resolve as a route within this site and render a 404. `target: _self`
# on the anchors keeps them opening in the same tab.
layout: page
sidebar: false
aside: false

title: Foxe Labs documentation
eyebrow: Guides, references and changelogs
lead: Everything we build, documented in one place — open-source WordPress plugins and PHP libraries, and tools for algorithmic traders.

tracks:
  - label: Software
    title: WordPress plugins and PHP libraries
    body: Loggedin and its add-ons, Better Disqus Comments, Lazy Load for Comments, and the reusable libraries behind them.
    covers:
      - Installation and settings
      - WP-CLI commands
      - Developer reference and hooks
      - Changelogs
    cta: Read the software docs
    link: https://docs.foxelabs.com/software/get-started

  - label: Trading
    title: Tools for algorithmic trading
    body: Gold Scalpel and the other tools we build for prop firm and algorithmic traders.
    covers:
      - Setup and installation
      - How each strategy works
      - Full inputs reference
      - Changelogs
    cta: Read the trading docs
    link: https://docs.foxelabs.com/trading/get-started

popular:
  title: Start here
  lead: The pages people open first.
  links:
    - title: Loggedin
      desc: Limit concurrent WordPress logins
      link: https://docs.foxelabs.com/software/loggedin/getting-started
    - title: Better Disqus Comments
      desc: Lazy-loaded Disqus, comment sync and SEO
      link: https://docs.foxelabs.com/software/disqus-conditional-load/getting-started
    - title: Lazy Load for Comments
      desc: Defer comment loading until asked
      link: https://docs.foxelabs.com/software/lazy-load-for-comments/getting-started
    - title: Gold Scalpel
      desc: XAUUSD expert advisor for MetaTrader 5
      link: https://docs.foxelabs.com/trading/gold-scalpel/getting-started
    - title: WP Freemius Client
      desc: Lite Freemius SDK for licensing and updates
      link: https://docs.foxelabs.com/software/wp-libraries/wp-freemius-client/overview
    - title: WP Review Notice
      desc: Ask for a wp.org review after a few days
      link: https://docs.foxelabs.com/software/wp-libraries/wp-review-notice/overview
    - title: WP Queue Process
      desc: Async requests and background job queues
      link: https://docs.foxelabs.com/software/wp-libraries/wp-queue-process/overview
---

<Landing />
