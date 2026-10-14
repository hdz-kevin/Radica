<?php

use App\Models\Listing;
use Inertia\Testing\AssertableInertia as Assert;

test('the site icon is the navbar house', function () {
    $svg = file_get_contents(public_path('favicon.svg'));

    expect($svg)->toContain('#171717')
        ->toContain('M15 21v-8')
        ->not->toContain('#FF2D20');

    $this->get(route('home'))
        ->assertOk()
        ->assertSee('href="/favicon.svg"', false)
        ->assertSee('href="/apple-touch-icon.png"', false);
});

test('the home page renders the public landing page', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertDontSee('property="og:title"', false)
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('featuredListings', 0)
        );
});

test('the home page shows published listings on featured cards', function () {
    $published = Listing::factory()->create(['title' => 'Departamento en Centro']);
    Listing::factory()->unpublished()->create(['title' => 'Oculta']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('featuredListings', 1)
            ->where('featuredListings.0.title', $published->title)
            ->where('featuredListings.0.id', $published->id)
        );
});
