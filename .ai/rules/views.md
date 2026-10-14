---
paths:
  - 'resources/views/**'
---

# Views

## Listing Open Graph is server HTML
Listing Open Graph tags are printed in app.blade.php from ListingOpenGraph::fromPage($page), only for listings/show. WhatsApp and Facebook read that first HTML response and do not run JavaScript. Keep the tags in the Blade response so they are present even when the SSR server is down. Do not rely on the React Head alone. Preview is the title, then the price on its own line and zone, city, state on the next, plus the cover image when one exists. Do not put the phone or the full description in og:description.

## Site icon is the navbar house
public/favicon.svg, public/favicon.ico, and public/apple-touch-icon.png are the navbar mark: a white Lucide house on #171717. Browsers and WhatsApp use those files for the tab icon and the badge on a shared link. Do not restore the Laravel mark.
