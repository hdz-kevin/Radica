---
paths:
  - 'app/Models/*.php'
---

# Models

## Listing location stays on listings
Listing address fields (state, city, zone, street_address) stay on listings. Do not extract a Location model/table. Do not store country, currency, postal_code, latitude, or longitude. Display rent as MXN in the UI. Location is a value of the listing (text), not its own entity. A 1:1 split adds joins and N+1 on the catalog with no reuse. The UI label is “Zona o colonia”; the column is `zone` (not `region` or `neighborhood`). Inertia may nest a location object when serializing; that is not a schema change.

## Listings use is_published not rented status
Listing visibility is is_published (boolean, default true), not available/rented and not a two-value enum. Do not put is_published in Fillable; Publicar/Despublicar is a dedicated action. published_at is only for catalog sort and is not cleared on unpublish. Soft delete means the owner deleted the listing, not paused it. There is no rented_at or hide-after-7-days.

## Zone is free text; no colonia catalog
MVP geography defaults to Teziutlán, Puebla (state/city copied on save; not shown in the form). `zone` is required free text. Do not create cities, neighborhoods, or locations tables. Do not add config/locations.php or TeziutlanNeighborhoods. Catalog filters use LIKE on zone, not a curated list.

## published() not visibleInCatalog
Listing catalog queries use the published() scope and isPublished(), not visibleInCatalog. SoftDeletes already hide trashed rows; do not invent a second visibility vocabulary.
