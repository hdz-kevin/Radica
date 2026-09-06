---
paths:
  - 'app/Http/Requests/**'
---

# Requests

## Listing phone and category validation
phone_number is required on store/update only when the user has no phone (blank users.phone_number). Persist it to the user, never overwrite an existing number from the listing form. Republish fails if the user still has no phone. Rooms persist bedrooms and bathrooms as null; apartment/house require bedrooms and bathrooms. has_parking and include_water/electricity/gas/internet/cable are required booleans for every category (default false). There is no bathroom_type or square_meters. At least one contact channel. State and city are never taken from the request.
