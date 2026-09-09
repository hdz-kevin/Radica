---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Catalog 404 for unpublished listings
Public catalog: GET / is ListingController@index (name home), GET /listings/{listing} is show. Unpublished or unauthorized show is abort(404), not 403. Guests may view published listings via ListingPolicy with ?User. Do not serialize the full User (email); pass user.phone_number only.

## Listing write actions return 403
Show still uses abort(404) for unpublished or unauthorized view. create/edit/update/destroy/publish/unpublish of another user's listing return 403 from the policy. Pass a sibling Inertia prop can (update, delete, publish) from the controller via Gate::allows. Do not put can on ListingShowResource and do not compare auth.user.id to the owner in React.

## Catalog filters use query params on GET /
Public catalog filters are query params on ListingController@index (route home): zone (trimmed, LIKE substring) and category (ListingCategory::tryFrom; unknown values are ignored, not 422). Echo the applied filters as the Inertia filters prop. Do not add a JSON search endpoint.
