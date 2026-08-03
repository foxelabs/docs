# Changelog

## 2.0.0

### Changed
- Structural rewrite. **PHP 7.4+** required; properties and signatures are typed.
- Persistence, load-guarding, and locking moved into injectable collaborators (`StoreInterface`, `ServerLimits`, `ProcessLock`).
- The internal protected helpers from 1.x (`is_queue_empty()`, `get_batch()`, `memory_exceeded()`, …) were removed — override `task()` / `complete()` or inject a collaborator instead.
- `set_queue()` and `save()` now type-hint their arguments.

### Unchanged
- Public API (`Async`, `Task`, `push_to_queue()`, `set_queue()`, `save()`, `dispatch()`, `update()`, `delete()`, `cancel_process()`) and every filter.
