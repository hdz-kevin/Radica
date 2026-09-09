<?php

use App\Enums\ListingCategory;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('the database seeder creates a varied catalog for filter work', function () {
    Storage::fake(ListingImage::DISK);

    $this->seed();

    $this->assertDatabaseCount('users', 20);
    $this->assertDatabaseCount('listings', 50);

    expect(Listing::query()->published()->count())->toBeGreaterThanOrEqual(40);

    Listing::query()->published()->withCount('images')->each(function (Listing $listing): void {
        expect($listing->images_count)->toBeGreaterThanOrEqual(1);
    });

    $cover = Listing::query()->published()->with('cover')->first()?->cover;

    expect($cover)->not->toBeNull();

    $bytes = Storage::disk(ListingImage::DISK)->get($cover->path);

    expect($bytes)->toStartWith("\xFF\xD8");
    expect(strlen($bytes))->toBeGreaterThan(10 * 1024);

    Listing::query()->each(function (Listing $listing): void {
        [$min, $max] = match ($listing->category) {
            ListingCategory::Room => [1400, 2000],
            ListingCategory::Apartment => [3000, 8000],
            ListingCategory::House => [7000, 15000],
        };

        expect($listing->rent_amount)
            ->toBeGreaterThanOrEqual($min)
            ->toBeLessThanOrEqual($max);
    });

    expect(Listing::query()->pluck('category')->unique()->count())->toBe(3);
    expect(Listing::query()->pluck('zone')->unique()->sort()->values()->all())->toEqual([
        'Aire Libre',
        'Centro',
        'Chignaulingo',
        'El Carmen',
        'El Fresnillo',
        'Francia',
        'La Magdalena',
        'Xoloco',
    ]);

    $testUser = User::query()->where('email', 'test@example.com')->first();

    expect($testUser)->not->toBeNull();
    expect($testUser->listings()->count())->toBeGreaterThan(1);
    expect($testUser->listings()->where('is_published', false)->exists())->toBeTrue();

    $listingCounts = User::query()->withCount('listings')->pluck('listings_count');

    expect($listingCounts->min())->toBe(1);
    expect($listingCounts->max())->toBeGreaterThanOrEqual(4);
});
