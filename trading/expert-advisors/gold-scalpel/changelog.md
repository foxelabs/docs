# Changelog

All notable changes to **Gold Scalpel** are documented here. The version is shown in the `#property version` field and on the on-chart dashboard.

## v1.0

**Initial MQL5 Market release.**

The first public release of Gold Scalpel on the MQL5 Market — a pre-tuned, fully automated XAUUSD breakout scalper.

### Highlights

- **Pre-tuned strategy.** The breakout approach ships dialled in — no optimisation required. You only set risk and behaviour for your own account.
- **Automatic trade management.** Each trade is moved to breakeven early and then trailed, keeping losses small and letting winners run.
- **Percentage-risk sizing.** Position size is calculated from your chosen risk percentage, capped by a maximum-lot ceiling, and snapped to your broker's minimum lot and lot step.
- **Optional losing-streak cooldown.** Pauses new entries after a run of consecutive losses, then resumes automatically.
- **Automatic weekend pause.** Cancels resting orders and stops opening new trades into the weekend, then resumes when the market reopens.
- **Styled on-chart dashboard.** A clean, gold-themed panel shows account status, strategy state, and live counters, refreshing every second even when the market is closed.
- **Simple, focused settings.** Just eight inputs, grouped into General, Risk Management, Losing-Streak Cooldown, and Display.

::: tip New here?
Start with **[Getting Started](./getting-started)** to install from the MQL5 Market, then review the **[Inputs Reference](./input-reference)** to set your risk.
:::

## Next Steps

- 🚀 **[Getting Started](./getting-started)** — Installation and first-run guide
- 📘 **[How It Works](./how-it-works)** — The approach and what to expect
- 📊 **[Performance](./performance)** — What testing shows and how to read it
- ⚙️ **[Inputs Reference](./input-reference)** — Every available setting explained
