<?php

use App\Models\Listing;

test('a listing factory defaults to Teziutlan Centro', function () {
    $listing = Listing::factory()->create();

    expect($listing)
        ->city->toBe('Teziutlán')
        ->state->toBe('Puebla')
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

test('a soft deleted listing is excluded by the published scope', function () {
    $listing = Listing::factory()->trashed()->create();

    expect(Listing::query()->published()->whereKey($listing)->exists())->toBeFalse();
});
