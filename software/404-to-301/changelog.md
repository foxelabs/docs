---
title: Changelog
---

# Changelog

Full release history for **404 to 301**. The plugin's bundled
`readme.txt` keeps only the latest couple of releases; the complete
history lives here.

## 4.0.3

### Added

* Rich per-column filtering on the Logs and Redirects tables, built on `@wordpress/dataviews` v16. Text columns support `is`, `isNot`, `isAny`, `isNone`, `contains`, `notContains` and `startsWith`; numeric columns add `lessThan`, `greaterThan`, `lessThanOrEqual`, `greaterThanOrEqual` and `between`.
* Filterable log fields: URL, referrer, IP, hits and status. Filterable redirect fields: source, target URL, redirect type, match type, active state and hits.
* IP filtering works against the packed `VARBINARY` column — values are packed with `inet_pton()` at the mapper, so only the equality and membership operators are offered.

### Improved

* Table columns are center-aligned except long-text and primary columns, which stay left-aligned for readability.
* Licensed add-on badges are green, Premium badges purple.
* `bin/pack.sh` prunes development files from the staged vendor tree before building the release zip.

### Fixed

* Center-aligned table columns are no longer clipped by the truncation styles.

### Developer

* **Breaking (REST):** the `status`, `date_from` and `date_to` query params on `GET /404-to-301/v1/logs`, and `match_type` / `redirect_type` on `GET /404-to-301/v1/redirects`, have been removed. All filtering now goes through a single `filters` param taking the DataViews v16 shape: `[ { field, operator, value }, … ]`.
* New `Filter_Mapper` class validates each filter against a per-field operator allowlist and translates it into BerlinDB query args. The allowlists are passed in by the caller, so the same mapper drives both endpoints.
* Upgraded `@wordpress/dataviews` to 16.0.1 and `@wordpress/scripts` to 32.4.1.

## 4.0.2

### Improved

* Add-ons catalogue now pulls each free add-on's icon and banner from the WordPress.org asset CDN and links to its WordPress.org plugin page.
* Clearer Redirects Importer description in the add-ons catalogue.

### Fixed

* Migration banner no longer shows on fresh installs running on SQLite (such as WordPress Playground), where legacy-table detection returned a false positive.
* Restored the spacing below the migration banner so it no longer touches the logs summary cards.

## 4.0.1

### Added

* Summary card strip above the Logs and Redirects tables for an at-a-glance overview (total / open / ignored / fixed / has custom redirect; total / active / inactive / total hits).
* **Purge all logs** action in Settings → Tools → Danger Zone with a confirmation modal. Custom redirects are not touched.
* Custom redirect modal on the Logs page now also lets you edit an already-linked redirect — no need to bounce to the Redirects page.
* One-time 4.0.0 → 4.0.1 data migration converts legacy `Custom redirect` log rows to the new status model (active link → Fixed, inactive or missing link → Open).

### Improved

* Redesigned log **View details** modal with a cleaner table layout and the 404 path shown prominently.
* Log status is decoupled from custom redirect linkage. The redirect link is now shown as a small badge next to the status icon, so the workflow status (Open / Ignored / Fixed) stays meaningful.
* Linking a custom redirect now sets the log to **Fixed** only when the redirect is active. Toggling a redirect's active state syncs every linked log automatically.
* Deleting a custom redirect now unlinks any logs that referenced it (the rows reopen so the broken URL surfaces again).
* When editing a redirect that is linked to a 404 log, the **Source URL** field is locked to keep the link intact. A small info notice explains why.

### Fixed

* Stale per-row cache on log rows after bulk status syncs.

## 4.0.0

### Added

* Custom redirect manager with exact, prefix and regex matching and per-redirect redirect type.
* Active/inactive toggle, hit counter and last-hit timestamp on every redirect.
* Dedicated, indexed database tables for 404 logs and custom redirects.
* Modern React-powered admin with full-featured Logs and Redirects tables (search, filters, bulk actions, pagination).
* Per-log lifecycle status (open / ignored / fixed) and date filters.
* Email notifications with a configurable hit threshold.
* REST API at `/404-to-301/v1/`.
* WP-CLI command set — `wp 404-to-301 logs|redirects|settings`.
* Add-ons catalogue for free and premium extensions.

### Improved

* IP masking and path exclusions for GDPR-friendly logging.

## 3.1.5

### Improved

* Row action link.

### Fixed

* Unable to delete logs.

## 3.1.4

### Improved

* Sanitize variables.

## 3.1.3

### Improved

* Security checks and improvements.

## 3.1.2

### Improved

* Security checks and improvements.

## 3.1.1

### Improved

* Security checks and improvements.

## 3.1.0

### Improved

* Tested with WP 5.8.
* Added sanitization.

## 3.0.9

### Improved

* Added nonce verification for bulk actions.

## 3.0.8

### Improved

* Tested with WP 5.7.
* Add capability checks for ajax actions - Thanks [Jerome](https://secure.nintechnet.com/).
* Improve query preparations - Thanks [Jerome](https://secure.nintechnet.com/).

## 3.0.7

### Fixed

* Activation hook was not being executed.
* Table creation failed in new installations.

## 3.0.6

### Improved

* Tested with WP 5.6.
* Small improvements.
* Temporarily disabled Freemius SDK.

## 3.0.5

### Improved

* Updated Freemius SDK.
* Tested with WP 5.2.

## 3.0.4

### Added

* Option to disable URL guessing.
* Review notice.

## 3.0.3

### Fixed

* Opt-in is disabled temporarily to debug the issues.

## 3.0.2

### Improved

* Minor performance improvements.

### Fixed

* Security fix.

## 3.0.1

### Improved

* Make release automated.

### Fixed

* Do not include exclude path items.

## 3.0.0.1

### Fixed

* Using template_redirect hook for redirect instead of wp hook.
* Fixed an issue with do_action in Freemius SDK.

## 3.0.0

### Added

* Individual optional settings for each error log item (individual redirect, log, email alert can be set).
* Clear error logs without removing custom redirects.
* Added error logs grouping with count.
* [WPML compatible](https://wpml.org/plugin/404-to-301/).
* Integrated Freemius for addon, support and analytics (optional).

### Improved

* Complete code revamp. More improved structure.
* Set custom options from previous logs if same item exists.
* Made 3rd party integration easier.

## 2.3.3

### Fixed

* Using `esc_url()` for Ref and Url fields.
* Fixed Cross Site Scripting vulnerability in "From" column - Thanks to [Plugin Vulnerabilities](https://www.pluginvulnerabilities.com/).

## 2.3.1

### Improved

* Tested with WordPress 4.6.

### Fixed

* Fixed Cross Site Scripting vulnerability - Thanks to [Summer of Pwnage](https://www.sumofpwn.nl/) & Louis Dion-Marcil.
* Fixed sorting issue in error log (changed default order to date descending).
* Fixed issues when trailing slash found at the end of custom redirect.

## 2.3.0

### Fixed

* Removed unused UAN button from help page.
* Completely safe to use.
* Tracking completely removed from the plugin since it was detected as spam. Read more [here](https://foxelabs.com/blog/404-to-301-plugin-detected-by-wordfence-here-is-what-actually-happened/).

## 2.2.9

### Fixed

* Serious issue fixed - usage tracking script was being detected as spam.
* Removed tracking completely.

## 2.2.8

### Fixed

* Fixed a minor bug on TOC button.

## 2.2.7

### Improved

* Improved condition checking.
* Speed improvements.
* Made error log link to new tab.

### Fixed

* Fixed issue with PHP 5.4 - empty error log data.

## 2.2.6

### Improved

* Improved condition checking.

### Fixed

* Fixed issue - undefined index when accessed directly.

## 2.2.5

### Fixed

* Fixed issue - front end was slow.

## 2.2.4

### Fixed

* Fixed custom redirect issue.
* Fixed issues when activating.

## 2.2.2

### Added

* Now you can set custom redirects for each error path.
* Go to error logs list and set custom redirect.

### Improved

* Improved code.

### Fixed

* Fixed issues with BuddyPress.

## 2.1.7

### Added

* New [Log Manager](https://foxelabs.com/products/404-to-301-log-manager/) add-on available now.
* Get periodic email alerts instead of instant email alerts for every error (add-on).
* Automatically clear error logs (add-on).

### Improved

* Removed inactive filter - `i4t3_before_404_redirect`.

## 2.1.6

### Improved

* Fixed broken plugin website links.
* Tested with WordPress 4.5.

## 2.1.5

### Improved

* Translated missing strings.
* Tested with WordPress 4.4.2.

### Fixed

* Fixed issues with deprecated functions - Thanks to [Pedro Mendonça](https://github.com/pedro-mendonca).

## 2.1.4

### Improved

* Tested with WordPress 4.4.1.

### Fixed

* Fixed issues when clearing logs (header already sent).

## 2.1.3

### Fixed

* Fixed issues with older versions of WordPress.
* Fixed issues with older versions of PHP.

## 2.1.0

### Added

* New option to set items per page from error log listing page.
* New option to show or hide items from listing table (screen option).

### Improved

* Improved error listing page table structure.

### Fixed

* Fixed issue - null value issue when no Referrer or User Agent found.
* Fixed issue - clearing errors and redirecting.

## 2.0.9

### Fixed

* Fixed issue - empty needle issue after 2.0.8 update.

## 2.0.8

### Added

* New option to exclude paths from error logs and redirect.

### Fixed

* Fixed issue - email notifications are being sent even after disabling it.
* Fixed issue - settings reset after reactivation of plugin.

## 2.0.7

### Added

* New option to change error notification email address.
* Now 100% translation ready.

### Improved

* Minor code improvements.

## 2.0.6

### Improved

* Introduced new website for the plugin.
* Fixed a few dead link issues.

## 2.0.5

### Improved

* Added option to avoid search engine crawlers/bots from logging errors.

### Fixed

* Fixed error log per page issue.

## 2.0.4

### Fixed

* Fixed an issue where error log table is not being created.

## 2.0.3

### Fixed

* Fixed a serious issue which may cause SQL injection attack.

## 2.0.2

### Fixed

* Fixed an issue with https redirect.
* Fixed an issue with url `preg_match`.

## 2.0.1

### Added

* Now you can log/monitor all 404 errors (optional).
* You can get email notifications on 404 errors (optional).
* You can select existing pages from dropdown to set as redirect page.
* New plugin home page.

### Improved

* Upgraded to WordPress plugin coding standard.
* Documented all functions.

## 1.0.8

### Improved

* Tested for WP 4.2.

### Fixed

* Very minor bug fix.

## 1.0.7

### Improved

* Improved performance.

### Fixed

* Fixed options saving issue in admin page.

## 1.0.6

### Improved

* Tested with latest version.
* Improved structure.

## 1.0.5

### Fixed

* Fixed permission issue on redirect link on plugin activation.

## 1.0.4

### Fixed

* Fixed permission issue on activating along with some security plugins like WordFence.

## 1.0.3

### Added

* Official support forum.

## 1.0.1

### Added

* Official website details.

## 1.0.0

### Added

* First version with basic options.
