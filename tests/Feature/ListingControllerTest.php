<?php

use App\Models\Listing;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('index', function () {
    test('renders published listings for a guest', function () {
        $published = Listing::factory()->create();
        Listing::factory()->unpublished()->create();
        Listing::factory()->trashed()->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $published->id)
                ->where('listings.0.zone', $published->zone)
                ->missing('listings.0.description')
            );
    });

    test('lists published listings newest first', function () {
        $this->freezeTime();

        $older = Listing::factory()->create([
            'published_at' => now()->subDay(),
        ]);
        $newer = Listing::factory()->create([
            'published_at' => now(),
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->where('listings.0.id', $newer->id)
                ->where('listings.1.id', $older->id)
            );
    });
});

describe('show', function () {
    test('renders a published listing for a guest', function () {
        $owner = User::factory()->withPhone()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/show')
                ->where('listing.id', $listing->id)
                ->where('listing.zone', $listing->zone)
                ->where('listing.user.phone_number', $owner->phone_number)
                ->missing('listing.user.email')
            );
    });

    test('returns 404 when a guest visits an unpublished listing', function () {
        $listing = Listing::factory()->unpublished()->create();

        $this->get(route('listings.show', $listing))->assertNotFound();
    });

    test('returns 404 when a guest visits a deleted listing', function () {
        $listing = Listing::factory()->trashed()->create();

        $this->get(route('listings.show', $listing))->assertNotFound();
    });

    test('returns 404 when another user visits an unpublished listing', function () {
        $listing = Listing::factory()->unpublished()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('listings.show', $listing))
            ->assertNotFound();
    });

    test('renders an unpublished listing for the owner', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->unpublished()->create();

        $this->actingAs($owner)
            ->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/show')
                ->where('listing.id', $listing->id)
                ->where('listing.is_published', false)
            );
    });
});
