---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Listing write actions return 403
Show still uses abort(404) for unpublished or unauthorized view. create/edit/update/destroy/publish/unpublish of another user's listing return 403 from the policy. Pass a sibling Inertia prop can (update, delete, publish) from the controller via Gate::allows. Do not put can on ListingShowResource and do not compare auth.user.id to the owner in React.

## Catalog filters use query params on GET /listings
The public landing page is GET / (route home) via HomeController. Public catalog filters are query params on ListingController@index (route listings.index): zone (trimmed, LIKE substring) and category (ListingCategory::tryFrom; unknown values are ignored, not 422). Echo the applied filters as the Inertia filters prop. Do not add a JSON search endpoint.

## Favorite only published listings
Saving or removing a favorite of an unpublished listing is abort(404), including for the owner. ListingPolicy::favorite is true only when isPublished(). Store uses syncWithoutDetaching and destroy uses detach; both are idempotent, return back(), and flash a success toast (La publicación se guardó en favoritos or La publicación se quitó de favoritos). Guests who tap the heart hit GET login/continue (LoginRedirectController, name login.intended), which sets url.intended to a same-app relative path (otherwise /) and redirects to login. That does not attach a favorite.

## Catalog 404 for unpublished listings
Public catalog: GET /listings is ListingController@index (name listings.index), GET /listings/{listing} is show. Unpublished or unauthorized show is abort(404), not 403. Guests may view published listings via ListingPolicy with ?User. Do not serialize the full User (email). ListingShowResource sends only user.phone_number, to everyone including guests (public by decision, to remove contact friction; the Aviso de Privacidad says so). There is no login gate for contact. Scraping risk is accepted for now; a throttled reveal endpoint is the planned mitigation if needed.
