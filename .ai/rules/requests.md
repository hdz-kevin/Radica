---
paths:
  - 'app/Http/Requests/**'
---

# Requests

## Listing phone and category validation
phone_number is not part of listing store/update validation. Store (create, which publishes) requires the user to already have a phone; update and republish do not. Rooms persist bedrooms and bathrooms as null; apartment/house require bedrooms and bathrooms. has_parking and include_water/electricity/gas/internet/cable are required booleans for every category (default false). There is no bathroom_type or square_meters. At least one contact channel. State and city are never taken from the request.

## Listing photos are request files not listing columns
Store requires images array min 1 max 15 (jpeg/jpg/png/webp/avif, max 10240 KB / 10 MB per file via ListingImage::MAX_FILE_KILOBYTES). Update uses image_order: existing listing_image ids that belong to this listing, plus the sentinel new for each uploaded file; count(new) must equal count(images); after() enforces total in [1, 15]. listingAttributes() must except images and image_order so files are never mass-assigned onto listings. SyncListingImages walks that order (empty order = all new files, used by create).
