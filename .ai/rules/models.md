---
paths:
  - 'app/Models/*.php'
---

# Models

## Listing location stays on listings
Listing address fields (country, state, city, neighborhood, postal_code, street_address, latitude, longitude) stay on listings. Do not extract a Location model/table. Location is a value of the listing, not its own entity. A 1:1 split adds joins and N+1 on the catalog with no reuse. A shared places catalog can be additive later (place_id). Inertia may nest a location object when serializing; that is not a schema change.

## Listings use is_published not rented status
Listing visibility is is_published (boolean, default true), not available/rented and not a two-value enum. Do not put is_published in Fillable; Publicar/Despublicar is a dedicated action. published_at is only for catalog sort and is not cleared on unpublish. Soft delete means the owner deleted the listing, not paused it. There is no rented_at or hide-after-7-days.

## City is Teziutlán; colonias are not a table
MVP geography is Teziutlán, Puebla, stored on listings (country/state/city/neighborhood/lat/lng). Do not create cities, neighborhoods, or locations tables. Neighborhood autocomplete is config/locations.php via TeziutlanNeighborhoods, not a FK. User-typed names persist only on the listing; do not auto-insert them into the catalog.
