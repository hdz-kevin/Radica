---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Catalog 404 for unpublished listings
Public catalog: GET / is ListingController@index (name home), GET /listings/{listing} is show. Unpublished or unauthorized show is abort(404), not 403. Guests may view published listings via ListingPolicy with ?User. Do not serialize the owner User (email); pass owner.phone_number only.
