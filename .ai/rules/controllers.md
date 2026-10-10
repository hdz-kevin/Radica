---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Listing write actions return 403
Show still uses abort(404) for unpublished or unauthorized view. create/edit/update/destroy/publish/unpublish of another user's listing return 403 from the policy. Pass a sibling Inertia prop can (update, delete, publish) from the controller via Gate::allows. Do not put can on ListingShowResource and do not compare auth.user.id to the owner in React.

## Catalog filters use query params on GET /
Public catalog filters are query params on ListingController@index (route home): zone (trimmed, LIKE substring) and category (ListingCategory::tryFrom; unknown values are ignored, not 422). Echo the applied filters as the Inertia filters prop. Do not add a JSON search endpoint.

## Favorite only published listings
Saving or removing a favorite of an unpublished listing is abort(404), including for the owner. ListingPolicy::favorite is true only when isPublished(). Store uses syncWithoutDetaching and destroy uses detach; both are idempotent and return back() with no toast. Guests who tap the heart hit GET login/continue (LoginRedirectController, name login.intended), which sets url.intended to a same-app relative path (otherwise /) and redirects to login. That does not attach a favorite.

## Catalog 404 for unpublished listings
Public catalog: GET / is ListingController@index (name home), GET /listings/{listing} is show. Unpublished or unauthorized show is abort(404), not 403. Guests may view published listings via ListingPolicy with ?User. Do not serialize the full User (email). ListingShowResource sends user.has_phone and user.phone_number; phone_number is null for guests (privacy notice promises it is only shown to signed-in users). Guests get "Inicia sesion para contactar" via login.intended.
