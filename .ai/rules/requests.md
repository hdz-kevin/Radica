---
paths:
  - 'app/Http/Requests/**'
---

# Requests

## Listing phone and category validation
phone_number is required on store/update only when the user has no phone (blank users.phone_number). Persist it to the user, never overwrite an existing number from the listing form. Republish fails if the user still has no phone. Room requires bathroom_type and nulls apartment fields; apartment/house require bedrooms, bathrooms, and has_parking, square_meters optional, bathroom_type null. At least one contact channel. State and city are never taken from the request.
