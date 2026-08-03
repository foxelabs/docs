---
title: Load Button Settings
---

# Load Button Settings

The Load Button settings let you customise the **Load Comments** button. You can find them under **Comments → Lazy Load** in your WordPress admin, inside the **Load Button** section of the settings page.

[![Load Button Settings](/lazy-load-for-comments/load-button.png)](/lazy-load-for-comments/load-button.png)

::: info Note
These settings only take effect when the **Load Method** in the [Loading Behaviour](./loading-behaviour) section is set to **On Button Click**. With the *On Scroll* method there is no button to customise.
:::

## Button Text

The label shown on the button that visitors click to load the comments.

This is a text input field.

**Expected value:** any text. Default: `Load Comments`.

## Button Style

Controls how the button is styled.

This is a dropdown (select) input with two options:

### Inherit Theme Style
The button uses your theme's own button styling so it blends in with the rest of your site. On block themes it picks up the button style defined in the theme, and on classic themes it uses the theme's native button styles. This is the default option.

### Plugin Style
The button uses the plugin's built-in style — a simple bordered button with a transparent background and no border radius.

**Expected value:** `Inherit Theme Style` or `Plugin Style`. Default: `Inherit Theme Style`.

## Extra CSS Classes

Add one or more CSS classes to the button. This is useful when you want to apply your own styles, or reuse a button class that already exists in your theme.

This is a text input field. Separate multiple classes with spaces.

**Expected value:** one or more CSS class names separated by spaces. Default: empty.

::: tip
If you choose **Plugin Style** but still want a different look, add your own class here and style it from your theme or a custom CSS plugin.
:::