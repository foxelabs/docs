# Getting Started

Welcome to **Gold Scalpel** — a precision breakout scalper for MetaTrader 5, available on the **MQL5 Market**.

This guide covers what the EA does, what you need to run it, and how to install it on your MT5 terminal in a few minutes.

## What is Gold Scalpel?

Gold Scalpel is a fully automated Expert Advisor (EA) for MetaTrader 5, built and tuned for **XAUUSD (Gold)**. It comes **pre-configured** — the strategy is dialled in at the factory, so there's nothing to optimise. You set your risk, attach it to a chart, and let it run.

In short, the EA:

- Identifies meaningful support and resistance levels around price
- Positions itself to catch a genuine **breakout** in either direction
- Once in a trade, protects it quickly by moving the stop to **breakeven**
- Then **trails** the stop behind the move to lock in gains

Most trades end at scratch or with a small profit. The occasional clean breakout runs for a real win. Losses are kept small by design.

::: tip Philosophy
Capital preservation first, edge second. The strategy doesn't need a high win rate — it needs the loss size kept near zero.
:::

## Who is it for?

Gold Scalpel is designed for traders who:

- Want a fully automated, hands-off gold scalper
- Prefer a **pre-tuned** product with a handful of simple, safe settings rather than dozens of parameters to configure
- Value automatic trade protection (early breakeven and trailing) over manual management
- Prefer **many small trades** over a few large ones

It's **not** ideal for:

- Set-and-forget swing trading (it's a scalper — trades are short-lived)
- Accounts with very wide spreads (works best on raw/zero-spread accounts)
- Traders who can't tolerate frequent breakeven exits

## Requirements

| Requirement | Details |
|---|---|
| **Platform** | MetaTrader 5 (MT5) |
| **Account type** | Hedging or Netting (both supported) |
| **Recommended broker** | Raw-spread or zero-spread account for tight scalping |
| **Symbol** | XAUUSD (or your broker's gold symbol) |
| **Chart timeframe** | Any — the EA runs its own analysis independently of the chart period |
| **VPS** | Recommended for 24/5 operation, but not required |

::: warning Recommended balance
The EA can run on a starting balance as low as **$100**, but for live capital we recommend **$1,000 or above** — combined with a lower risk percentage, more balance gives the account room to ride drawdowns (the default risk is a balanced 2%; see the [Inputs Reference](./input-reference#riskpercent)). Position size automatically respects your broker's minimum lot and lot step, and is capped by your maximum-lot setting.
:::

## Recommended Accounts & Brokers

Gold Scalpel is a scalper, so **spread is the single biggest factor** in how it performs. It will run on **any broker**, but it is designed for **raw-spread or zero-spread accounts** where the cost per trade is as low as possible. On a standard wide-spread account, the tight scalping edge erodes quickly.

::: tip Our recommendation
Use a **raw** or **zero-spread** account. We specifically recommend **Exness Zero Spread** accounts for XAUUSD.
:::

### Recommended brokers

- **[Exness](https://one.exnessonelink.com/a/1hjxucvo9g)** — Zero Spread accounts on gold; our top recommendation for this EA.
- **[Vantage Markets](https://vigco.co/la-com-inv/KhKA668s)** — Raw-spread accounts; a solid alternative.

Whichever broker you choose, look for:

- A **raw** or **zero-spread** account type (tightest spreads, small commission)
- A **gold symbol** (XAUUSD or equivalent) with good tick history
- **Hedging or Netting** — both are supported
- Low-latency execution — a **VPS** near the broker's server helps for 24/5 operation

::: info Affiliate disclosure
The Exness and Vantage Markets links above are referral links. If you open an account through them, Foxe Labs may earn a commission at no extra cost to you. You're free to use any broker that offers a raw or zero-spread gold account.
:::

## Installation

Gold Scalpel is distributed through the **MQL5 Market**, so installation is handled by MetaTrader itself — no manual file copying or compiling.

### Step 1 — Purchase or rent the product

1. Open the **[Gold Scalpel product page on the MQL5 Market](https://www.mql5.com/en/market/product/175235?source=docs)**
2. Choose **Buy** (lifetime) or **Rent** (monthly), or **Download Demo** to test first
3. Sign in with the same MQL5 account you use inside MetaTrader 5

::: tip Try before you buy
The free **Demo** runs in the MetaTrader **Strategy Tester** only (it can't trade live). Use it to backtest the EA on your own gold history before purchasing.
:::

### Step 2 — Install from inside MetaTrader 5

1. In MT5, open the **Toolbox** (Ctrl+T) and go to the **Market** tab — or open the **Navigator** (Ctrl+N)
2. Sign in with your MQL5 account if prompted (Tools → Options → Community)
3. Your purchased products appear under **Navigator → Expert Advisors → Market**
4. If you don't see it yet, right-click **Expert Advisors → Refresh**

The EA is delivered as a protected, ready-to-run product. You don't need MetaEditor and there's nothing to compile.

### Step 3 — Attach to a chart

1. Open an **XAUUSD** chart (or your broker's gold symbol)
2. Drag **Gold Scalpel** from the Navigator onto the chart
3. In the settings dialog, open the **Common** tab and ensure:
   - ✅ **Allow Algo Trading** is checked
4. Switch to the **Inputs** tab and set your risk preferences (see the [Inputs Reference](./input-reference)) — the defaults are sensible to start
5. Click **OK**

::: tip Gold only
Gold Scalpel is optimised exclusively for XAUUSD. For best results keep it on a gold chart.
:::

### Step 4 — Enable Algo Trading globally

Make sure the **Algo Trading** button in the MT5 toolbar is enabled (green). If it's red/disabled, the EA loads but won't place any trades.

### Step 5 — Verify it's running

Look at the chart — you should see:

- A small smiley face 🙂 in the top-right corner (EA is active)
- The styled on-chart **dashboard** showing live status (account, strategy state, and counters)
- Log entries in the **Experts** tab at the bottom of MT5

If you see all three, you're up and running.

::: tip The dashboard shows even when the market is closed
The panel refreshes on a one-second timer, so it appears the moment you attach the EA — you don't have to wait for a tick. If it doesn't show, check that `ShowDashboard = true` and that Algo Trading is enabled.
:::

## Verifying with a Backtest

Before running live (and available with the free Demo), run a quick backtest:

1. Open the **Strategy Tester** (Ctrl+R)
2. Select **Gold Scalpel** as the Expert
3. Choose **XAUUSD** as the symbol
4. Set Modelling to **Every tick based on real ticks** (recommended for an accurate result)
5. Pick a date range — at least 1–3 months for a first look
6. Click **Start**

You should see trades being placed and the equity curve evolving. Review the Journal tab for any messages.

::: tip Backtest speed
Logging and the dashboard are disabled automatically during non-visual (headless) tester runs, so backtests stay fast. Enable **Visual mode** if you want to watch the dashboard during a single run.
:::

## Next Steps

- 📘 **[How It Works](./how-it-works)** — Understand the approach and what to expect
- 📊 **[Performance](./performance)** — What testing shows and how to read it
- ⚙️ **[Inputs Reference](./input-reference)** — Every available setting explained
- 🗒️ **[Changelog](./changelog)** — What changed in each version
- 💬 **[Get Support](mailto:support@foxelabs.com)** — Reach out if you hit any issues

Happy scalping! 🦊
