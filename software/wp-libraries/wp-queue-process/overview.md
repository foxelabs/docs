# WP Queue Process — Overview

A WordPress library for firing off non-blocking asynchronous requests and for running long jobs as a background queue. Items pushed onto the queue are worked through in batches that bail out before exhausting the server's time or memory budget; each finished batch chains the next instantly, and a self-healing cron restarts a stalled queue.

- Inspired by [TechCrunch WP Asynchronous Tasks](https://github.com/techcrunch/wp-async-task).
- Forked from [WP Background Processing](https://github.com/deliciousbrains/wp-background-processing), modernised with a swappable storage driver, a server-load guard, and a full test suite.

## Concepts

Consumers extend one of two abstract classes:

- **`Async`** — a one-off non-blocking request. Use it when you want to hand off a slow task (sending an email, warming a cache) to a background PHP process.
- **`Task`** — a background queue that extends `Async`. Items are pushed onto the queue and processed in batches, first-in first-out. New items can be pushed even while a batch is running.

`Task` delegates persistence to a `StoreInterface`, load-guarding to `ServerLimits`, and single-worker locking to `ProcessLock`. All three are injected through the constructor with WordPress-backed defaults.

## Architecture

```
src/
├── Async.php                     # Abstract non-blocking request
├── Task.php                      # Abstract background queue (extends Async)
├── Contracts/
│   └── StoreInterface.php        # Where batches are persisted
├── Storage/
│   └── OptionStore.php           # Default driver: (network) options table
├── Support/
│   ├── Batch.php                 # Value object: one stored batch
│   ├── ServerLimits.php          # Time/memory budget guard
│   └── ProcessLock.php           # Single-worker lock (site transient)
└── Exceptions/
    └── QueueException.php
```
