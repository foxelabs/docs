# Changelog

## 3.0.0

Rebrand from DuckDev to FoxeLabs. No behavioural changes — but the rename touches the namespace and the generated hook names, so it is a breaking release.

### Changed
- Composer package renamed `duckdev/wp-queue-process` → **`foxelabs/wp-queue-process`**. Update your `composer.json` require entry.
- Namespace renamed `DuckDev\Queue\` → **`FoxeLabs\Queue\`**. Update every `use` statement and class reference.
- The default process prefix changed `duckdev` → **`foxelabs`**, so every generated filter name, option key, cron hook, and lock transient moves from `duckdev_{action}_*` to `foxelabs_{action}_*`.

### Upgrading
- Drain your queues **before** upgrading. Batches persisted under the old `duckdev_*` option keys are not visible to the new prefix and will be orphaned in the options table.
- Any `add_filter( 'duckdev_my_action_time_exceeded', … )` calls must be renamed to `foxelabs_my_action_*`.
- To keep the old keys and filter names, override `$prefix` back to `'duckdev'` in your subclass.

### Unchanged
- Public API (`Async`, `Task`, `push_to_queue()`, `set_queue()`, `save()`, `dispatch()`, `update()`, `delete()`, `cancel_process()`), the filter list, and all behaviour.

## 2.0.0

### Changed
- Structural rewrite. **PHP 7.4+** required; properties and signatures are typed.
- Persistence, load-guarding, and locking moved into injectable collaborators (`StoreInterface`, `ServerLimits`, `ProcessLock`).
- The internal protected helpers from 1.x (`is_queue_empty()`, `get_batch()`, `memory_exceeded()`, …) were removed — override `task()` / `complete()` or inject a collaborator instead.
- `set_queue()` and `save()` now type-hint their arguments.

### Unchanged
- Public API (`Async`, `Task`, `push_to_queue()`, `set_queue()`, `save()`, `dispatch()`, `update()`, `delete()`, `cancel_process()`) and every filter.
