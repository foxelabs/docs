# WordPress Libraries

A collection of small, focused PHP libraries we maintain and reuse across our WordPress plugins. Each one solves a single problem well, ships with a full test suite, and is built around small, injectable collaborators so it stays easy to test and extend.

| Library | Purpose |
| --- | --- |
| [Freemius Plugin Licensing](/wp-libraries/freemius-plugin-licensing/overview) | UI-free Freemius SDK: license activation, updates, and addon listing. |
| [WP Cache Helper](/wp-libraries/wp-cache-helper/overview) | Callback-style `remember()` wrapper around the object cache and transients, with group flushing. |
| [WP Queue Process](/wp-libraries/wp-queue-process/overview) | Non-blocking async requests and a self-healing background queue for long jobs. |
| [WP Review Notice](/wp-libraries/wp-review-notice/overview) | A gentle, dismissable admin notice asking for a wp.org review after a few days of usage. |

All libraries require **PHP 7.4+**, ship on Composer under the `duckdev/*` namespace, and are released under **GPL-2.0-or-later**.
