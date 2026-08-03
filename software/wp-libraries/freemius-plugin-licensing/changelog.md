# Changelog

## 2.0.2

- Tests: gate `ReflectionProperty::setAccessible` on PHP < 8.1.
- CI: consolidate `phpcs`, `phpunit`, and release into a single workflow.
- Fix tests: read the response code from the array and drop the deprecated `setAccessible` call.

## 2.0.0

- Rewritten as a lite, UI-free Freemius SDK — no admin screens, host plugins own the UI.
- Modular architecture: DI container (`Freemius`), `Api/`, `Services/` (`License`, `Update`, `Addon`), `Storage/`, `Data/`, `Contracts/`.
- License activation / deactivation, update delivery, and addon listing against the Freemius API.
- Signed API requests using the FS / FSP header-signing scheme.
- Full unit-test suite.
