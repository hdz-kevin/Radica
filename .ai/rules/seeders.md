---
paths:
  - 'database/seeders/**'
---

# Seeders

## Seeders hold catalog variety, factories stay deterministic
DatabaseSeeder creates 20 users (test@example.com plus 19 landlords) and 100 Teziutlán listings with 1–5 public-disk JPEGs so filter work has volume. Zone names are a private array in ListingSeeder, not a colonia catalog. Do not randomize ListingFactory::definition() (tests expect zone Centro and rent 12000); put realistic variety only in seeders.

## Seed listing photos from Unsplash fixtures
Listing seed photos come from committed Unsplash JPEGs in database/seeders/fixtures/listings/{apartment,room,house}/ (10 per category). Copy and recycle those files onto the public disk. Do not generate colored GD placeholders.

## Seed rents follow category ranges
Seeded rent_amount stays in Teziutlán ranges by category: room 1400–2000, apartment 3000–8000, house 7000–15000. Do not change ListingFactory::definition() rent (tests expect 12000).

## Seed listing zones are eight Teziutlán colonias
ListingSeeder repeats only these zones (free text, not a catalog): Aire Libre, Centro, El Carmen, El Fresnillo, Francia, Xoloco, Chignaulingo, La Magdalena. Do not add config/locations.php or extra colonias in seed data.
