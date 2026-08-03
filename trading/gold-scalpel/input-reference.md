# Inputs Reference

Gold Scalpel ships **pre-tuned**: the strategy's internal parameters are fixed and optimised at the factory, so the only settings you see are the ones that let you tailor **risk and behaviour to your own account**. This keeps configuration simple and safe — there's nothing to over-optimise.

Inputs are organised into the same four groups you see in the MT5 properties panel.

::: tip Quick reference
- The defaults are sensible for most accounts — you can run the EA as-is.
- The setting that matters most for *your* account is **`RiskPercent`**.
:::

## General

### `MagicNumber`

| | |
|---|---|
| **Type** | `ulong` |
| **Default** | `0` |

The magic number identifies which trades belong to this EA instance, so it only manages its own positions.

- **`0` (default)** — The EA derives a stable magic number automatically from the symbol.
- **Any non-zero value** — Used as the magic number verbatim.

Set distinct non-zero values when you want to run **multiple instances on the same symbol** (for example, two gold charts with different risk settings) without them managing each other's trades.

## Risk Management

Controls how big each trade is.

### `RiskPercent`

| | |
|---|---|
| **Type** | `double` |
| **Default** | `2.0` |

Risk per trade as a percentage of account equity. The EA sizes each position so that a full stop-out would cost approximately this percentage of the account. Position size is then automatically capped by `MaxLotCap` and snapped to your broker's minimum lot and lot step.

::: tip The default is a balanced setting
`2.0%` is a conservative, compounding-oriented default suitable for most live accounts. Remember that with more than one open position you can have a larger share of your account at risk at once — raise it only with capital you can afford to draw down hard.
:::

::: tip Recommended values
- **Balanced / compounding (default):** 2.0%
- **Conservative live trading:** 1.0%
- **Aggressive / compounding:** 3.0 – 5.0%
- **Prop firm challenges:** 0.25 – 1.0% (extra conservative)
:::

### `MaxLotCap`

| | |
|---|---|
| **Type** | `double` |
| **Default** | `100.0` |

Hard ceiling on lot size, regardless of what the risk calculation suggests. Acts as a safety cap — for example, if your account grows large enough that the risk percentage would call for 150 lots, this keeps it at 100. Lower it if you want a tighter bound on the largest position the EA can take.

::: tip Consider lowering it on live accounts
The `100.0` default is a high ceiling that mainly matters once an account has grown large. Combined with a higher `RiskPercent`, it allows a big maximum position — set it to a value you're genuinely comfortable holding on gold.
:::

## Losing-Streak Cooldown

An optional guardrail that pauses new entries after a run of consecutive losses. **Off by default** — enable it if you want the EA to step back and cool off during a rough patch.

### `UseDDGuards`

| | |
|---|---|
| **Type** | `bool` |
| **Default** | `false` |

Master switch for the losing-streak cooldown.

- **`false` (default)** — No cooldown; the EA keeps looking for setups continuously.
- **`true`** — After `MaxConsecLosses` losing trades in a row, the EA stops opening new trades for `ConsecLossCooldownHours`, then resumes automatically. Positions already open continue to be managed normally.

::: tip Reducing risk on a losing run
Turning this on is a simple way to take a forced break during adverse conditions instead of trading straight through them. Any winning trade resets the streak counter.
:::

### `MaxConsecLosses`

| | |
|---|---|
| **Type** | `int` |
| **Default** | `4` |

How many losses in a row trigger the cooldown. Only used when `UseDDGuards = true`. Lower it for a more cautious pause; raise it to tolerate longer streaks before stepping back.

### `ConsecLossCooldownHours`

| | |
|---|---|
| **Type** | `double` |
| **Default** | `12.0` |

How long to pause new entries once the cooldown triggers, in hours. Only used when `UseDDGuards = true`. After this time elapses, the EA resumes looking for setups.

## Display

Dashboard and logging.

### `ShowDashboard`

| | |
|---|---|
| **Type** | `bool` |
| **Default** | `true` |

Renders the on-chart status panel (see [How It Works → The On-Chart Dashboard](./how-it-works#the-on-chart-dashboard)). It shows account status, strategy state, and live counters, and refreshes on a one-second timer so it stays current even when the market is closed. Disable to keep the chart clean.

::: info Automatically off in backtests
During a non-visual Strategy Tester run, the dashboard is disabled automatically — there's no chart to draw on, and skipping it keeps backtests fast. It still renders in visual-mode backtests and on live charts.
:::

### `EnableLogging`

| | |
|---|---|
| **Type** | `bool` |
| **Default** | `true` |

Writes a trade journal to the **Experts** tab in MT5 — order placements, fills, expiries, closes with net profit/loss, and any risk notices. Safe to leave on in live trading; useful for reviewing what the EA has done and for support requests.

::: info Automatically off in headless backtests
Like the dashboard, logging is suppressed during non-visual tester runs so it doesn't slow backtests down.
:::

## Quick Reference Profiles

### Default — as shipped

Run the defaults (2% risk, cooldown off). A balanced, compounding-oriented setting for most live accounts.

### Balanced live trading

```
RiskPercent             = 1.5
MaxLotCap               = 50.0
UseDDGuards             = true
MaxConsecLosses         = 4
ConsecLossCooldownHours = 12.0
```

### Conservative — small account or prop challenge

```
RiskPercent             = 0.5
MaxLotCap               = 50.0
UseDDGuards             = true
MaxConsecLosses         = 3
ConsecLossCooldownHours = 24.0
```

::: warning Prop firm rules
Gold Scalpel does not enforce a prop firm's specific daily-loss or overall-drawdown limits. On a funded challenge, keep `RiskPercent` very low, enable the losing-streak cooldown, and rely on the firm's own risk rules as the hard boundary.
:::

## Next Steps

- 📘 **[How It Works](./how-it-works)** — Understand the approach
- 📊 **[Performance](./performance)** — What testing shows and how to read it
- 🚀 **[Getting Started](./getting-started)** — Installation guide
- 🗒️ **[Changelog](./changelog)** — Version history
- 💬 **[Get Support](mailto:support@foxelabs.com)** — Setup help and questions
