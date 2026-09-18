---
paths:
  - 'resources/js/**'
---

# Js

## MVP is built in teaching slices
Canonical spec: docs/mvp_plan.md. Frontend follows the same numbered slices. After each slice, explain Inertia/React architecture. Do not add Mapbox or a pin map; the catalog is cards. Do not implement the full MVP in one pass.

## Listing form phone and owner actions
Do not collect phone_number on the listing form. Create shows a warning plus a link to the profile when auth.user.phone_number is null. Edit does not. Owner buttons on show use the sibling can prop from the server, never compare user ids. Estado and ciudad are visible disabled fields; the POST does not send them.

## Listing form uploads 1 to 15 photos
Photo UI is ListingImageUploader at the start of ListingForm (mobile stacked, lg two columns with images sticky left). Multipart images[] is rebuilt with DataTransfer from new File objects in visual order. Edit also posts image_order[] (existing id or the sentinel new). Cover is always the first item in that order; tapping a thumb only changes the large preview. Reorder with @dnd-kit (mouse distance, touch long-press). Copy is “1 a 15 fotos”. Cards use cover_url or the existing placeholder; show renders images in position order as a simple gallery.

## Catalog live filters are Inertia visits
The catalog filters with debounced router.get to home, only listings and filters, preserveState, preserveScroll, and replace. Omit empty query keys. Do not use useHttp or a JSON search endpoint for this page.
