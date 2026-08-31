<?php

use App\Models\Listing;

test('a listing factory defaults to Teziutlan Centro', function () {
    $listing = Listing::factory()->make();

    expect($listing)
        ->city->toBe('Teziutlán')
        ->state->toBe('Puebla')
        ->neighborhood->toBe('Centro');
});

test('a published listing appears in the catalog', function () {
    $listing = Listing::factory()->create();

    expect(Listing::query()->visibleInCatalog()->whereKey($listing)->exists())->toBeTrue();
});

test('an unpublished listing does not appear in the catalog', function () {
    $listing = Listing::factory()->unpublished()->create();

    expect(Listing::query()->visibleInCatalog()->whereKey($listing)->exists())->toBeFalse();
});

test('a soft deleted listing does not appear in the catalog', function () {
    $listing = Listing::factory()->trashed()->create();

    expect(Listing::query()->visibleInCatalog()->whereKey($listing)->exists())->toBeFalse();
});
