---
paths:
  - 'app/Http/Requests/**'
---

# Requests

## Listing phone and category validation
phone_number is not part of listing store/update validation. Store (create, which publishes) requires the user to already have a phone; update and republish do not. Rooms persist bedrooms and bathrooms as null; apartment/house require bedrooms and bathrooms. has_parking and include_water/electricity/gas/internet/cable are required booleans for every category (default false). There is no bathroom_type or square_meters. At least one contact channel. State and city are never taken from the request.
