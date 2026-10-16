---
paths:
  - 'resources/js/**'
---

# Js

## MVP is built in teaching slices
Canonical spec: docs/mvp_plan.md. Frontend follows the same numbered slices. After each slice, explain Inertia/React architecture. Do not add Mapbox or a pin map; the catalog is cards. Do not implement the full MVP in one pass.

## Listing form phone and owner actions
Collect phone_number on the listing form. Create prefills the 10 national digits from auth.user.phone_number when the profile has one. Edit shows that listing's number, not the profile. Owner buttons on show use the sibling can prop from the server, never compare user ids.

## Listing form uploads 1 to 15 photos
Photo UI is ListingImageUploader at the start of ListingForm (mobile stacked, lg 7-column grid with images sticky left spanning 3 and fields spanning 4). Multipart images[] is rebuilt with DataTransfer from new File objects in visual order. Edit also posts image_order[] (existing id or the sentinel new). Cover is always the first item in that order; tapping a thumb only changes the large preview. Reorder with @dnd-kit (mouse distance, touch long-press). Copy is “1 a 15 fotos”. Cards use cover_url or the existing placeholder.

## Catalog live filters are Inertia visits
The catalog filters with debounced router.get to listings.index at /listings, only listings and filters, preserveState, preserveScroll, and replace. Omit empty query keys. Do not use useHttp or a JSON search endpoint for this page.

## Listing numeric fields accept digits only
Rent, bedrooms, and bathrooms ignore any character that is not a digit. Rent groups the amount with commas. The hidden field submits the digits only. Bedrooms and bathrooms stay plain digits.

## Listing form hides Estado and Ciudad
Estado and ciudad are not shown on ListingForm and the POST does not send them; the server assigns Puebla and Teziutlán. Amenities, utilities, and contact channels are pill chips (hidden 0 + checkbox 1). Recámaras and baños stay hidden when category is room.

## Listing form desktop split is 3/7 photos
On lg, ListingForm is a 11-column grid: ListingImageUploader spans 5 columns and the fields span 6. Mobile stays stacked.

## Listing actions menu
Show and Mis publicaciones use ListingActionsMenu: one outline ellipsis button on the right of the title, on every viewport. The order is Compartir, Guardar, then Editar, Ocultar or Publicar, and Eliminar when can allows them. There is no Ver item. Compartir and Guardar are disabled when the listing is hidden. Mis publicaciones sends is_favorited on each listing. Guardar fills the heart from that flag and removes the favorite when it is already saved. Ocultar uses EyeOff and Publicar uses Eye. The catalog card has no owner menu and ListingCardResource does not send can. The mine card menu click must not follow the card link. Do not compare user ids on the client.

## Favorite heart does not auto-save for guests
The heart overlay is only on public catalog cards, with pointer-events-auto so it does not follow the card link. It is not on Mis publicaciones. Saving in the menu is the Guardar item. Compartir and Guardar are disabled while the listing is hidden. The card prefetches show; saving or removing a favorite invalidates that prefetch with listingShowCacheTag so the show menu matches the heart without a refresh. The server flashes La publicación se guardó en favoritos or La publicación se quitó de favoritos, and useFlashToast shows it. Guests still see Guardar on a published listing; the link is login.intended with return set to the current page, and the listing is not saved until they tap again after login. Main nav order is Catálogo, Favoritos, Publicar, Mis publicaciones. Favoritos reuses the public card. Share uses navigator.share with the title and the absolute URL, and otherwise copies that URL. Do not also pass the rent and place as share text: Messenger prints that text above the photo, ahead of the title. The preview lines come from Open Graph. Do not put share on catalog cards.

## Profile phone field shows 10 national digits
The profile and listing phone fields show a fixed +52 prefix that is not an input and is not submitted. While typing, the 10 national digits display as xxx xxx xxxx. The hidden phone_number field submits only those digits. Strip a stored 521 prefix for display with nationalPhoneNumber from @/lib/phone. Do not put 521 in the placeholder or ask the user to type it. Listing WhatsApp links use the stored 521 value. Call links drop that extra 1 and use 52 plus the 10 national digits.

## Contact buttons on show are public
Llamar and WhatsApp render for guests too, from listing.phone_number and the contact_via flags. There is no "Inicia sesión para contactar" button. Keep the antifraud notice under them.

## Guests go to login through login.intended
Guest CTAs that should return to the current page (favorite heart) link to login.intended with query return=page.url (import { intended } from '@/routes/login'). favorites.login no longer exists. Run wayfinder:generate with --with-form, otherwise .form() helpers disappear.

## Entry auth screens use the landing header
Login, register, and forgot password use LandingHeader on every viewport and do not render AppBottomNav. Reset password and verify email keep AppHeader from lg up and the bottom nav below lg. Protected links still redirect to login.

## Landing uses a dedicated marketing header
The home page uses LandingHeader: transparent, borderless, with brand and account entry actions. AppHeader remains unchanged for application pages. Add future marketing links to LandingHeader, not AppHeader.

## Listing show photo carousel
The listing show page keeps photos in position order. The large photo is a snap carousel at every width: horizontal scroll changes the photo, with no arrow buttons and no counter on the page. overscroll-x-contain keeps that gesture from triggering browser back or forward. Thumbnails jump that carousel, and scrolling the large photo moves the thumbnail row to the active photo. Clicking the large photo opens a fullscreen dialog on the same photo. Clicking the black area outside that photo closes the dialog; clicking the photo does not. The dialog shows a counter when there is more than one photo. Below lg the dialog swipes; from lg it shows one photo with side arrow buttons (disabled on the first and last) and keyboard arrows. A single photo has no arrows and still opens the viewer.

## WhatsApp inquiry includes the listing link
The WhatsApp button on a listing opens wa.me with the stored 521 number and a prefilled message: "Hola, vi tu publicación en radicaMX. ¿Sigue disponible?" plus the absolute listing URL on its own line. WhatsApp builds the photo preview from that URL's Open Graph tags, the same preview as Compartir. Do not put the rent, address, or description in the message text.
