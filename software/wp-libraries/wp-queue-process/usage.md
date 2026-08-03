# Usage

## One-off async request

Async requests are useful for pushing slow one-off tasks — sending an email, warming a cache — to a background process. Once dispatched, the request processes immediately and out of band.

```php
class WP_Example_Request extends \DuckDev\Queue\Async {

    protected $action = 'example_request';

    protected function handle() {
        // Actions to perform. Dispatched data is available in $_POST.
    }
}
```

Dispatch it (chaining is supported):

```php
$request = new WP_Example_Request();
$request->data( array( 'value1' => $value1, 'value2' => $value2 ) )->dispatch();
```

## Background queue

Background processes queue tasks and work through them in batches. Higher-end servers process more items per batch. A health check runs by default every 5 minutes to restart the queue if it ever fails; queues are processed first-in-first-out, so items can be pushed even while one is already running.

```php
class WP_Example_Process extends \DuckDev\Queue\Task {

    protected $action = 'example_process';

    /**
     * Return the item (optionally modified) to push it back for another pass,
     * or false to remove it from the queue.
     */
    protected function task( $item, $group ) {
        // Actions to perform.
        return false;
    }

    protected function complete() {
        parent::complete();
        // Show a notice, log, etc.
    }
}
```

Instantiate the process **unconditionally** (every request, even when nothing is queued), push items, then save and dispatch:

```php
$process = new WP_Example_Process();

foreach ( $items as $item ) {
    $process->push_to_queue( $item );
}

$process->save( 'my-group' )->dispatch();
```

## Public methods (`Task`)

| Method | Description |
| --- | --- |
| `push_to_queue( $item )` | Append a single item to the in-memory queue. |
| `set_queue( array $items )` | Replace the in-memory queue wholesale. |
| `save( string $group = 'default' )` | Persist the in-memory queue as a new batch. |
| `dispatch()` | Schedule the health-check cron and start processing. |
| `update( string $key, array $data )` | Replace the items of an existing batch. |
| `delete( string $key )` | Delete a batch entirely. |
| `cancel_process()` | Drop the current batch and clear the cron. |

## Swapping the storage driver

Pass your own `StoreInterface` — or a custom `ServerLimits` / `ProcessLock` — to the constructor:

```php
$process = new WP_Example_Process( new MyCustomStore( 'my_plugin_example_process' ) );
```

## Filters

Every filter is namespaced with the process identifier (`{prefix}_{action}`, e.g. `duckdev_example_process`):

| Filter | Default | Purpose |
| --- | --- | --- |
| `{id}_query_args` | action + nonce | Query args added to the dispatch URL. |
| `{id}_query_url` | `admin-ajax.php` | URL the request is dispatched to. |
| `{id}_post_args` | non-blocking POST | Arguments passed to `wp_remote_post()`. |
| `{id}_default_time_limit` | `20` | Per-batch time budget, in seconds. |
| `{id}_time_exceeded` | computed | Override whether the time budget is spent. |
| `{id}_memory_exceeded` | computed | Override whether the memory budget is spent. |
| `{id}_queue_lock_time` | `60` | Process lock duration, in seconds. |
| `{id}_cron_interval` | `5` | Health-check interval, in minutes. |

## BasicAuth

If your site is behind BasicAuth, the dispatched request needs credentials attached:

```php
add_filter( 'http_request_args', function ( $r ) {
    $r['headers']['Authorization'] = 'Basic ' . base64_encode( USERNAME . ':' . PASSWORD );
    return $r;
} );
```
