---
paths:
  - 'tests/**/*.php'
---

# Tests

## Fake the public disk in Feature tests
Listing::deleting always calls Storage::deleteDirectory('listings/{id}') on the public disk, even when the listing has no images. Feature tests use sqlite :memory:, so the first listing is always id=1. Without Storage::fake(ListingImage::DISK), a destroy test wipes storage/app/public/listings/1 and the local seed photos for listing 1. Tests\TestCase already fakes that disk in setUp; keep it. Do not write or delete listing photos on the real public disk.
