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

## Favorite heart does not auto-save for guests
The heart is on public catalog cards and beside the title on a published show page. On cards it uses pointer-events-auto so it does not follow the card link. It is not on Mis publicaciones. Guests still see it; the link is login.intended with return set to the current page, and the listing is not saved until they tap again after login. Main nav order is Catálogo, Favoritos, Publicar, Mis publicaciones. Favoritos reuses the public card.

## Profile phone field shows 10 national digits
The profile phone field shows and submits the 10 national digits. Strip a stored 521 prefix for display (nationalPhoneNumber). Do not put 521 in the placeholder or ask the user to type it. Listing WhatsApp links use the stored 521 value. Call links drop that extra 1 and use 52 plus the 10 national digits.

## Guests go to login through login.intended
Guest CTAs that should return to the current page (favorite heart, contact button on show) link to login.intended with query return=page.url (import { intended } from '@/routes/login'). favorites.login no longer exists. Run wayfinder:generate with --with-form, otherwise .form() helpers disappear.
