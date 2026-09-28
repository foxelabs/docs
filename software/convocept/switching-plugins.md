---
title: Switching Plugins
description: Move to Convocept from wpDiscuz, Subscribe to Comments Reloaded or your theme's default comments.
---

# Switching Plugins

[[toc]]

## From the default WordPress comments

Nothing to do. Activate Convocept and every existing comment shows in the
new thread. Deactivate it, and your theme's comments come back.

## wpDiscuz

wpDiscuz stores comments as normal WordPress comments, so **every comment
appears in Convocept straight away**:

1. Activate Convocept.
2. Deactivate wpDiscuz.

Not carried over yet: wpDiscuz votes and its comment subscriptions. An
importer for both is planned for Convocept 1.1. Until then, keep wpDiscuz
installed but inactive, so its data stays in the database for the importer.

Comments are shown as WordPress stored them. wpDiscuz features that live
only in its own tables or shortcodes, such as inline feedback, ratings or
uploaded images, are not shown.

## Subscribe to Comments Reloaded

Convocept has its own [comment subscriptions](/convocept/subscriptions):
"email me replies", "email me all new comments", subscribing without
commenting, double opt-in and one-click unsubscribe. It replaces Subscribe
to Comments Reloaded (StCR).

Running both at once sends readers two emails for each new comment, so
deactivate StCR when you turn on Convocept's subscriptions.

An importer for StCR's subscribers is planned for Convocept 1.1. Until then,
keep StCR installed but inactive if you want to move its subscribers later.

## Disqus

See [Import from Disqus](/convocept/import-from-disqus).
