---
paths:
  - 'resources/js/**'
---

# Js

## MVP is built in teaching slices
Canonical spec: docs/mvp_plan.md. Frontend follows the same numbered slices. After each slice, explain Inertia/React architecture. Do not add Mapbox or a pin map; the catalog is cards. Do not implement the full MVP in one pass.

## Listing form phone and owner actions
Show phone_number on create/edit only when auth.user.phone_number is null. Owner buttons on show use the sibling can prop from the server, never compare user ids. Estado and ciudad are visible disabled fields; the POST does not send them.
