<?php

use App\Models\Listing;

test('a listing factory defaults to Teziutlan Centro', function () {
    $listing = Listing::factory()->create();

    expect($listing)
        ->city->toBe(Listing::DEFAULT_CITY)
        ->state->toBe(Listing::DEFAULT_STATE)
        ->zone->toBe('Centro')
        ->street_address->toBeNull();

    $this->assertDatabaseHas('listings', [
        'id' => $listing->id,
        'zone' => 'Centro',
    ]);
});

test('a published listing is included in the published scope', function () {
    $listing = Listing::factory()->create();

    expect(Listing::query()->published()->whereKey($listing)->exists())->toBeTrue();
});

test('an unpublished listing is excluded by the published scope', function () {
    $listing = Listing::factory()->unpublished()->create();

    expect($listing->isPublished())->toBeFalse();
    expect(Listing::query()->published()->whereKey($listing)->exists())->toBeFalse();
});

test('publishing a listing makes it visible and updates published_at', function () {
    $this->freezeTime();

    $listing = Listing::factory()->unpublished()->create([
        'published_at' => now()->subDay(),
    ]);

    $listing->publish();

    expect($listing->fresh())
        ->is_published->toBeTrue()
        ->published_at->toDateTimeString()->toBe(now()->toDateTimeString());
});

test('unpublishing a listing hides it and keeps published_at', function () {
    $this->freezeTime();

    $listing = Listing::factory()->create([
        'published_at' => now()->subDay(),
    ]);
    $publishedAt = $listing->published_at;

    $listing->unpublish();

    $listing->refresh();

    expect($listing)
        ->is_published->toBeFalse()
        ->published_at->toEqual($publishedAt);
    expect(Listing::query()->published()->whereKey($listing)->exists())->toBeFalse();
});

test('a soft deleted listing is excluded by the published scope', function () {
    $listing = Listing::factory()->trashed()->create();

    expect(Listing::query()->published()->whereKey($listing)->exists())->toBeFalse();
});

test('the inZone scope matches a zone substring', function () {
    $centro = Listing::factory()->create(['zone' => 'Centro']);
    Listing::factory()->create(['zone' => 'El Carmen']);

    expect(Listing::query()->inZone('Cent')->pluck('id')->all())
        ->toBe([$centro->id]);
});

test('the inZone scope treats like wildcards as literals', function () {
    Listing::factory()->create(['zone' => 'Centro']);

    expect(Listing::query()->inZone('%')->exists())->toBeFalse();
    expect(Listing::query()->inZone('_')->exists())->toBeFalse();
});

test('the inZone scope ignores spaces in the zone text', function (string $needle) {
    $carmen = Listing::factory()->create(['zone' => 'El Carmen']);
    Listing::factory()->create(['zone' => 'Centro']);

    expect(Listing::query()->inZone($needle)->pluck('id')->all())
        ->toBe([$carmen->id]);
})->with([
    'without spaces' => ['elcarmen'],
    'with a space' => ['el carmen'],
    'with extra spaces' => ['el  carmen'],
]);
