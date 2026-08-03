# Performance

This page summarises how Gold Scalpel behaves in testing and, just as importantly, how to read those results honestly. The goal is to set **realistic expectations** — not to sell a number.

::: warning Read this first
Every figure below comes from a **backtest**, not live trading. Past performance — including backtests on real tick data — does **not** guarantee future results. Results depend heavily on your broker's spread and execution, the test period, and your risk setting. Always validate on the free Demo and a demo account before committing real capital, and only risk what you can afford to lose.
:::

## Live tracking

Gold Scalpel's performance is tracked forward in real time on a public **MQL5 signal**:

- 🔗 **[Track the live signal on MQL5 →](https://www.mql5.com/en/signals/2382197?source=docs)**

Unlike the static backtest below, this runs forward on live market prices. Results still vary by broker, execution, period, and risk setting.

## What to look at (and what to ignore)

Gold Scalpel is built around **capital preservation first**. The metrics that actually describe the edge are the risk-adjusted ones — how consistent the wins are and how contained the drawdown is — not the headline return.

- **Focus on:** win consistency, profit factor, and maximum drawdown.
- **Be sceptical of:** raw percentage returns. Because sizing is percentage-of-equity and compounding, the return figure scales directly with your `RiskPercent`. A big number at 5% risk is not evidence of a "better" strategy than the same run at 1% — it's the same strategy taking more risk.

## Reference backtest

The figures below are from a single real-tick backtest of the shipping build. Your own results will differ.

| Test condition | Value |
|---|---|
| **Symbol** | XAUUSD |
| **Period** | 1 Jan 2025 – 10 Jul 2026 (~18 months) |
| **Modelling** | Every tick based on real ticks (100% quality) |
| **Initial deposit** | $1,000 |
| **Risk per trade** | 2.0% (conservative) |
| **Account** | Raw-spread, hedging |

::: tip 📈 Net result — $1,000 → ~$15,200
At the **2% default risk**, the account grew from **$1,000** to **~$15,232** over the ~18-month test — a **+1,423%** return. Because sizing is percentage-of-equity and **compounding**, the return scales directly with your `RiskPercent`: raising it above the default produces a much larger return *and* a proportionally larger drawdown (see [About the return figure](#about-the-return-figure)).
:::

### Risk-adjusted results

| Metric | Result | What it means |
|---|---|---|
| **Win rate** | ~78% | Most trades close at a small profit or breakeven. |
| **Profit factor** | ~3.9 | Gross profit was ~4× gross loss over the period. |
| **Max drawdown** | ~6.8% | The largest peak-to-trough dip in equity during the run. |
| **Total trades** | 319 | Selective — this is not a high-frequency churn strategy. |
| **Avg win : avg loss** | ~1.3 : 1 | Wins and losses are similar in size; the edge is in *frequency*, not big winners. |

::: tip Why the win rate is high but losses still happen
The high win rate is a by-product of early breakeven and trailing — many trades are protected before they can turn into losers. It is **not** a promise that ~78% of trades will always win. Expect losing trades, losing days, and losing weeks.
:::

### About the return figure

The **+1,423% return** above (a **~$14,232 net profit**) scales directly with your `RiskPercent`, because sizing is percentage-of-equity and **compounding**. This run used the **2% default**; raising the risk compounds far faster, lifting both the return **and** the drawdown proportionally. For live capital, most traders should stay at **1–2%** (see [`RiskPercent`](./input-reference#riskpercent)) for a smoother curve like the one shown here.

## How results vary

Your results will differ from any backtest — sometimes materially — because of:

- **Spread & commission.** Gold Scalpel is a scalper; it is sensitive to spread. Raw/zero-spread accounts fare best. A wide-spread account can turn marginal trades into losers.
- **Execution & slippage.** Live fills, requotes, and slippage are not fully reproducible in a tester.
- **Test period.** Gold's character changes across regimes. A calm trending stretch and a choppy range will not produce the same numbers.
- **Broker gold symbol & tick history.** Different brokers have different XAUUSD feeds and history quality.
- **Your risk setting.** `RiskPercent` scales both returns and drawdown.

::: warning Drawdown on small / young accounts
A percentage-risk, compounding strategy takes its sharpest *relative* drawdowns early, while the balance is small and every trade is a large share of equity. Give a live account room — a realistic starting balance (see [Getting Started](./getting-started#requirements)) and a conservative `RiskPercent` — rather than judging it by the first few weeks.
:::

## Validate it yourself

The most useful performance data is the run *you* produce, on *your* broker, over a period *you* choose. The free **Demo** runs in the MetaTrader Strategy Tester for exactly this purpose — see [Getting Started → Verifying with a Backtest](./getting-started#verifying-with-a-backtest).

1. Use **Every tick based on real ticks** for an accurate model.
2. Test at the **risk you actually intend to trade**, whether that's the default or something lower.
3. Test across **different market conditions**, not just one favourable stretch.
4. Then confirm on a **demo account** before going live.

## Next Steps

- 📘 **[How It Works](./how-it-works)** — The approach behind the numbers
- ⚙️ **[Inputs Reference](./input-reference)** — Set your risk sensibly
- 🚀 **[Getting Started](./getting-started)** — Install and run your own backtest
- 💬 **[Get Support](mailto:support@foxelabs.com)** — Questions about results
