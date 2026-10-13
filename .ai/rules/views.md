---
paths:
  - 'resources/views/**'
---

# Views

## Listing Open Graph is server HTML
Listing Open Graph tags are printed in app.blade.php from ListingOpenGraph::fromPage($page), only for listings/show. WhatsApp and Facebook read that first HTML response and do not run JavaScript. Keep the tags in the Blade response so they are present even when the SSR server is down. Do not rely on the React Head alone. Preview is title, price, zone and city, plus the cover image when one exists. Do not put the phone or the full description in og:description.
