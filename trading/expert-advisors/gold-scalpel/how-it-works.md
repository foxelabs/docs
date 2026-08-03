# How It Works

This page explains the **approach** behind Gold Scalpel and what to expect when you run it. Gold Scalpel ships pre-tuned, so this is a conceptual overview rather than a tuning guide — the strategy's internal parameters are fixed and optimised at the factory.

## The Core Idea

Markets respect levels. When price approaches a meaningful high or low, one of two things happens: it rejects, or it breaks through and keeps going.

Gold Scalpel is built to capture the **breakout**. Rather than predicting direction, it positions itself on **both sides** of the current range and lets the market decide. It only commits when price genuinely pushes through a boundary — not on a touch or a near-miss. The moment it's in a trade, the focus shifts immediately to protection.

This produces an asymmetric risk profile:

- **Most trades** end at scratch or with a small profit
- **A few trades** ride a clean breakout for a real win
- **Large losses are rare** because protection kicks in fast

You don't need a high win rate. You need the average loss kept tiny — and that's exactly what the EA is engineered to do.

## What Happens in a Trade

Every trade follows the same disciplined lifecycle:

1. **Wait for a real move.** The EA stays patient until price breaks out with conviction. No breakout, no trade.
2. **Enter on the break.** When price pushes through, the EA is already positioned to catch it.
3. **Protect quickly.** As soon as the trade moves in your favour, the stop is advanced to **breakeven**, so a winner rarely turns into a loser.
4. **Trail the move.** From there, the stop follows price, locking in more of the gain as the move extends — and exiting automatically when momentum fades.
5. **Stand aside briefly.** After a trade closes, the EA pauses before looking for the next opportunity, so it doesn't immediately re-enter on the same exhausted move.

The result is a hands-off rhythm of many small, tightly-managed trades throughout active market hours.

::: tip Why breakeven matters most
Moving the stop to breakeven early is the single most important risk control in the EA. It's what keeps the average loss small and makes the overall profile work — even when individual trades don't win.
:::

## Built-in Risk Management

Gold Scalpel is conservative by design. Several protections run automatically in the background to keep risk contained:

- **Early breakeven & trailing** — the primary safeguard. A trade is moved to breakeven as soon as it's onside, then trailed, so most losses stay small and winners are protected.
- **Position cap** — a limit on how many trades can be open at once keeps total exposure bounded.
- **Post-trade cooldown** — a short pause after each trade avoids over-trading the same move.
- **Optional losing-streak cooldown** — if you enable it, the EA pauses new entries for a while after a run of consecutive losses, then resumes automatically (see the [Inputs Reference](./input-reference#useddguards)).
- **Automatic weekend pause** — as the Friday session winds down, the EA cancels any resting orders and stops opening new trades, so nothing is left exposed over the weekend gap. It picks back up when the market reopens.
- **Maximum-lot ceiling** — a hard cap on position size, regardless of what the risk calculation suggests.

You control the settings that matter most for *your* account — risk per trade, the maximum lot, and the optional cooldown — and the EA handles the rest. See the [Inputs Reference](./input-reference) for everything you can adjust.

## Position Sizing

Gold Scalpel sizes each trade for you using **percentage-risk** sizing: it works out a lot size from your chosen risk percentage and the account equity, then automatically:

- Caps the result at your **maximum lot** ceiling
- Respects your broker's **minimum lot and lot step**
- Falls back to your broker's **minimum lot** if even that would exceed your risk budget — so a small account still trades rather than sitting idle. On an account too small for your chosen risk percentage, a single minimum-lot trade can risk slightly more than that percentage, since the minimum lot is the smallest position the broker allows.

There's no manual lot math to do — set your risk percentage and the EA does the rest.

## The On-Chart Dashboard

When enabled, Gold Scalpel draws a clean, styled status panel directly on the chart so you can see what it's doing at a glance:

![Gold Scalpel on-chart dashboard](/gold-scalpel/dashboard.png)

The panel is organised into four zones:

**Header** — the product name, the symbol / timeframe / version line (`XAUUSD · M15 · v1.0`), a status chip, and the current server time. The chip tells you the EA's overall state at a glance:

- `ACTIVE` — running and free to trade
- `PAUSED` — running but not opening new trades (e.g. the weekend pause, or a losing-streak cooldown)
- `STOP` — trading is halted (e.g. a daily drawdown limit was hit)

**Account** — your live account picture:

- **Balance** and **Equity** — closed balance vs. equity including open trades
- **Floating** — current open P&L, coloured green (profit) or red (loss)
- **Daily DD** — how far equity has drawn down today, used by the daily-loss guard

**Status** — what the market and risk engine currently see:

- **Trend** — the higher-timeframe direction filter (`Up` / `Down`)
- **ATR** — the current volatility reading the EA sizes stops and targets from
- **DD peak** — the largest drawdown reached this session
- **Risk** — the risk-per-trade percentage in force

**Strategy** — the trading state machine:

- **Signal** — the current entry state; `BLOCKED` means conditions aren't met yet, so no order is placed
- **Cooldown** — `WAIT` during the post-trade (or losing-streak) pause, otherwise ready
- **Trailing** — whether the breakeven/trailing stop manager is `ON`
- **Levels** — how many breakout levels are currently being tracked
- **Con. Losses** — the running count of consecutive losses (feeds the optional losing-streak cooldown)

**Footer** — live position counts: open trades with a buy/sell breakdown against the cap (`Open 0 (B0 S0)/2`), resting pending orders (`Pending 0 (BS0 SS0)`), the day's trade count, and the instance's **magic number** so you can tell multiple charts apart.

The panel refreshes on a one-second timer, so it stays current **even when the market is closed**, and it's removed cleanly when you detach the EA. This gives you a complete real-time view without digging through logs.

::: info Off automatically in headless backtests
During a non-visual Strategy Tester run, the dashboard (and logging) are skipped entirely — there's no chart to draw on, and skipping them keeps backtests fast. Both still work in visual-mode backtests and on live charts.
:::

## What to Expect

A typical session is a steady stream of small, quickly-managed trades during active market hours. Many close around breakeven or with a modest profit; a smaller number catch a cleaner run. The EA is doing its job when losses stay small and consistent — the edge comes from that discipline over many trades, not from any single big win.

::: warning Trading involves risk
No strategy wins every trade, and past performance — including backtests — does not guarantee future results. Always test on the free Demo and a demo account before committing real capital, and only risk what you can afford to lose.
:::

## Next Steps

- 📊 **[Performance](./performance)** — What testing shows and how to read it
- ⚙️ **[Inputs Reference](./input-reference)** — Every available setting explained
- 🚀 **[Getting Started](./getting-started)** — Installation and first-run guide
- 🗒️ **[Changelog](./changelog)** — Version history
- 💬 **[Get Support](mailto:support@foxelabs.com)** — Reach out if you have questions
