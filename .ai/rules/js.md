---
paths:
  - 'resources/js/**'
---

# Js

## MVP is built in teaching slices
Canonical spec: docs/mvp_plan.md. Frontend follows the same numbered slices. After each slice, explain Inertia/React architecture. Do not add Mapbox or a pin map; the catalog is cards. Do not implement the full MVP in one pass.

## Listing form phone and owner actions
Do not collect phone_number on the listing form. Create shows a warning plus a link to the profile when auth.user.phone_number is null. Edit does not. Owner buttons on show use the sibling can prop from the server, never compare user ids.

## Listing form uploads 1 to 15 photos
Photo UI is ListingImageUploader at the start of ListingForm (mobile stacked, lg 7-column grid with images sticky left spanning 3 and fields spanning 4). Multipart images[] is rebuilt with DataTransfer from new File objects in visual order. Edit also posts image_order[] (existing id or the sentinel new). Cover is always the first item in that order; tapping a thumb only changes the large preview. Reorder with @dnd-kit (mouse distance, touch long-press). Copy is “1 a 15 fotos”. Cards use cover_url or the existing placeholder; show renders images in position order as a simple gallery.

## Catalog live filters are Inertia visits
The catalog filters with debounced router.get to home, only listings and filters, preserveState, preserveScroll, and replace. Omit empty query keys. Do not use useHttp or a JSON search endpoint for this page.

## Listing form hides Estado and Ciudad
Estado and ciudad are not shown on ListingForm and the POST does not send them; the server assigns Puebla and Teziutlán. Amenities, utilities, and contact channels are pill chips (hidden 0 + checkbox 1). Recámaras and baños stay hidden when category is room.

## Listing form desktop split is 3/7 photos
On lg, ListingForm is a 11-column grid: ListingImageUploader spans 5 columns and the fields span 6. Mobile stays stacked.

## Owner menu only on Mis publicaciones
The catalog card has no owner menu and ListingCardResource does not send can. Mis publicaciones shows Ver, Editar, Publicar or Despublicar, and Eliminar from listing.can on ListingMineResource via Gate. Do not compare user ids on the client. The menu click must not follow the card link.
