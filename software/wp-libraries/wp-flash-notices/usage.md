# Usage

## Available methods

| Method | Purpose |
| --- | --- |
| `add( $key, $message, $type, $dismissible, $network )` | Queue a notice. Returns the queued `Notice`. |
| `get( $key, $network )` | Read one stored notice. Returns `Notice` or `null`. |
| `fetch( $network )` | Read every stored notice as `Notice[]`, keyed by notice key. |
| `clear( $network )` | Delete the stored queue. |
| `save()` | Flush the in-memory queue to storage. Runs automatically on `shutdown`. |
| `render()` | Print the stored notices, then clear them. Hooked to the notice actions. |
| `types()` | The supported notice types, after filtering. |
| `prefixer()` / `store()` / `renderer()` | Access the underlying collaborators. |

## `add()` — queue a notice

```php
$notices = \FoxeLabs\Notices\Notices::get_instance( 'my_plugin' );

$notices->add( 'settings-saved', 'Your settings have been saved.', 'success' );
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `$key` | `string` | — | Unique key. Re-using a key replaces the earlier notice. |
| `$message` | `string` | — | Notice body. Limited HTML allowed. |
| `$type` | `string` | `info` | `success`, `info`, `warning` or `error`. Unknown types fall back to `info`. |
| `$dismissible` | `bool` | `true` | Show the dismiss button. |
| `$network` | `bool` | `false` | Queue as a network admin notice (multisite only). |

It throws `NoticeException` when the key or message is empty — both are programmer errors, not user input.

The four core types map to the bar colour core paints on the notice:

```php
$notices->add( 'settings-saved', 'Your settings have been saved.', 'success' );    // Green
$notices->add( 'import-failed', 'The import could not be completed.', 'error' );   // Red
$notices->add( 'license-expiring', 'Your license expires in 3 days.', 'warning' ); // Yellow
$notices->add( 'sync-running', 'A sync is currently running.', 'info', false );    // Blue, no dismiss button
```

### The redirect pattern

This is what the library is for. Queue on the request that does the work, redirect, and the notice appears on the page the user lands on:

```php
add_action( 'admin_post_my_plugin_save', function () {
    check_admin_referer( 'my_plugin_save' );

    $notices = \FoxeLabs\Notices\Notices::get_instance( 'my_plugin' );

    if ( my_plugin_save_settings( $_POST ) ) {
        $notices->add( 'settings-saved', 'Your settings have been saved.', 'success' );
    } else {
        $notices->add( 'settings-saved', 'Your settings could not be saved.', 'error' );
    }

    wp_safe_redirect( admin_url( 'admin.php?page=my-plugin' ) );
    exit;
} );
```

::: warning `exit` after a redirect still flushes the queue
`shutdown` fires on `exit`, so the queue is saved. It is **`wp_die()` mid-request and fatal errors** that can cut the flush short. If you queue a notice on a path that may die, call `save()` yourself before dying.
:::

### Network notices

```php
$notices->add( 'network-update', 'All sites have been updated.', 'success', true, true );
```

Network notices are stored separately and rendered on `network_admin_notices`. Off multisite, `$network = true` silently falls back to the regular site queue rather than erroring.

## Reading and clearing

```php
$notice = $notices->get( 'settings-saved' );

if ( $notice ) {
    echo esc_html( $notice->message() );
}

$all = $notices->fetch();  // Notice[] keyed by notice key.
$notices->clear();         // Delete the stored queue.
```

Pass `true` as the last argument to any of these to work on the network queue.

`Notice` is an immutable value object: `key()`, `message()`, `type()`, `is_dismissible()`, `to_array()`.

::: tip Reading does not consume
`get()` and `fetch()` only read — they do not clear. Rendering is what clears. If you read notices to display them yourself, call `clear()` when you are done, or they will be shown again on the next page load.
:::

## Front-end notices

Notices print automatically in the admin. To print them in a front-end template, fire the prefixed action wherever you want them:

```php
do_action( 'my_plugin_front_notices' );
```

The action is prefixed, so firing it only renders *your* queue.

## Filters

| Filter | Arguments | Use |
| --- | --- | --- |
| `{prefix}_flash_notice_types` | `string[] $types` | Register custom notice types. |
| `{prefix}_flash_notice_item` | `Notice $notice, bool $network` | Replace a notice just before it is queued. Return a `Notice` to override; anything else is ignored. |
| `{prefix}_flash_notices_fetch` | `Notice[] $notices, bool $network` | Modify the notices read from storage. |
| `{prefix}_flash_notices_auto_render` | `bool $enable, bool $network` | Return `false` to stop the library printing notices. |
| `{prefix}_flash_notices_auto_clear` | `bool $enable, bool $network` | Return `false` to keep notices after rendering. |

Types are resolved on every `add()` rather than cached at construction, so a filter registered after the container is built still applies.

### Custom notice types

A type maps directly to the `notice-{type}` CSS class, so a custom type needs styles of its own:

```php
add_filter( 'my_plugin_flash_notice_types', function ( $types ) {
    $types[] = 'my-plugin-critical';

    return $types;
} );

$notices->add( 'meltdown', 'Something went very wrong.', 'my-plugin-critical' );
```

Without the filter, an unrecognised type is quietly downgraded to `info` — the notice still shows.

### Rendering the notices yourself

`{prefix}_flash_notices_auto_render` disables printing **and** the clearing that follows it, so nothing is lost while you take over:

```php
add_filter( 'my_plugin_flash_notices_auto_render', '__return_false' );

add_action( 'admin_notices', function () {
    $notices = \FoxeLabs\Notices\Notices::get_instance( 'my_plugin' );

    foreach ( $notices->fetch() as $notice ) {
        printf( '<div class="my-toast">%s</div>', esc_html( $notice->message() ) );
    }

    $notices->clear();
} );
```

::: danger Disabling auto-clear makes them permanent
`{prefix}_flash_notices_auto_clear` returning `false` means the notices are printed on *every* page load until something calls `clear()`. If you use it, own the clearing — otherwise they are no longer flash notices at all.
:::

## Actions

| Action | Arguments |
| --- | --- |
| `{prefix}_flash_notices_after_queue` | `Notice $notice, bool $network, Notice[] $queue, Notice[] $network_queue` |
| `{prefix}_flash_notices_after_save` | `Notice[] $queue, Notice[] $network_queue` |
| `{prefix}_flash_notices_after_render` | `Notice[] $notices, bool $network` |
| `{prefix}_flash_notices_after_clear` | `bool $network` |
| `{prefix}_front_notices` | — (you fire this one) |

`after_queue` fires before anything is stored — the notice is still only in memory at that point.

## Custom storage and rendering

Implement `RendererInterface` to change the markup:

```php
use FoxeLabs\Notices\Contracts\RendererInterface;

class MyRenderer implements RendererInterface {

    public function render( array $notices ): void {
        foreach ( $notices as $notice ) {
            printf(
                '<div class="my-toast my-toast--%s">%s</div>',
                esc_attr( $notice->type() ),
                esc_html( $notice->message() )
            );
        }
    }
}

$notices = new \FoxeLabs\Notices\Notices( 'my_plugin', null, new MyRenderer() );
$notices->register();
```

Or `StoreInterface` to change where the queue lives — it deals in plain arrays keyed by notice key, not `Notice` objects, so stored data stays forward-compatible:

```php
public function get( bool $network = false ): array;
public function put( array $notices, bool $network = false ): bool;
public function delete( bool $network = false ): bool;
```

The bundled `TransientStore` also takes an expiration, so you can shorten the backstop:

```php
use FoxeLabs\Notices\Storage\TransientStore;
use FoxeLabs\Notices\Support\KeyPrefixer;

$store   = new TransientStore( new KeyPrefixer( 'my_plugin' ), HOUR_IN_SECONDS );
$notices = new \FoxeLabs\Notices\Notices( 'my_plugin', $store );
$notices->register();
```

::: tip
Instances built with `new` are not registered in the `get_instance()` map. Hold onto the object, or your other call sites will get a separate default-wired container back.
:::
