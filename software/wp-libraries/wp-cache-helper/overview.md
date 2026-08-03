# WP Cache Helper — Overview

A small WordPress library that wraps the object cache and transient APIs with a callback-style `remember()` helper, group-flush support for the object cache (delegating to core's `wp_cache_flush_group()` on WP 6.1+ backends that support it, with a version-sentinel fallback for backends that don't), and per-prefix scoping so multiple consumers on the same site never collide.

Inspired by [WP Cache Remember](https://github.com/stevegrunwell/wp-cache-remember).

## Why it exists

- **Callback-style caching.** `remember()` distinguishes a legitimately cached `0`, `''`, `[]`, or `false` from a true miss — the callback only runs when nothing was cached.
- **Group flush without core support.** Increments a per-group version sentinel so old entries become unreadable without touching the rest of the cache. On WP 6.1+ backends with native support, delegates straight to `wp_cache_flush_group()`.
- **Per-prefix scoping.** Every key, group, and the `{prefix}_can_cache` filter is namespaced under the supplied prefix, so multiple consumers can't collide.

## Architecture

```
src/
├── Cache.php                     # Container + entry point
├── Contracts/
│   ├── ObjectCacheInterface.php
│   └── TransientCacheInterface.php
├── Storage/
│   ├── ObjectCache.php           # wp_cache_* wrapper + native/fallback group flush
│   └── TransientCache.php        # (site_)transient wrapper
├── Support/
│   └── KeyPrefixer.php           # Shared key + group prefixing
└── Exceptions/
    └── CacheException.php
```

Services receive their collaborators by constructor injection so they can be unit-tested without WordPress in the loop. Construction has no side effects.
