<?php

use App\Models\Listing;
use App\Models\User;
use App\Policies\ListingPolicy;

test('anyone can view the catalog', function () {
    expect((new ListingPolicy)->viewAny(null))->toBeTrue();
    expect((new ListingPolicy)->viewAny(User::factory()->create()))->toBeTrue();
});

test('a guest can view a published listing', function () {
    $listing = Listing::factory()->create();

    expect((new ListingPolicy)->view(null, $listing))->toBeTrue();
});

test('a guest cannot view an unpublished listing', function () {
    $listing = Listing::factory()->unpublished()->create();

    expect((new ListingPolicy)->view(null, $listing))->toBeFalse();
});

test('the owner can view an unpublished listing', function () {
    $owner = User::factory()->create();
    $listing = Listing::factory()->for($owner)->unpublished()->create();

    expect((new ListingPolicy)->view($owner, $listing))->toBeTrue();
});

test('another user cannot view an unpublished listing', function () {
    $listing = Listing::factory()->unpublished()->create();

    expect((new ListingPolicy)->view(User::factory()->create(), $listing))->toBeFalse();
});
