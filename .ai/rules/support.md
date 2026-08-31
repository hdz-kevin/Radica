---
paths:
  - 'app/Support/**'
---

# Support

## Neighborhood catalog is config plus TeziutlanNeighborhoods
Read colonias from config/locations.php through App\Support\TeziutlanNeighborhoods (city, all, find, names, contains). Do not add a Neighborhood Eloquent model. Share the array as an Inertia prop when building publish/filter UI; do not add a search endpoint or Mapbox Search for colonias.
