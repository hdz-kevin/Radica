<?php

use App\Models\Listing;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests see listings as not favorited', function () {
    $listing = Listing::factory()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('listings.0.id', $listing->id)
            ->where('listings.0.is_favorited', false)
        );

    $this->get(route('listings.show', $listing))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('favorited', false)
        );
});

test('a guest cannot save a listing', function () {
    $listing = Listing::factory()->create();

    $this->post(route('listings.favorite.store', $listing))
        ->assertRedirect(route('login'));

    $this->assertDatabaseCount('listing_favorites', 0);
});

test('guests cannot open the favorites page', function () {
    $this->get(route('favorites.index'))
        ->assertRedirect(route('login'));
});

test('an external return url is ignored', function (string $return) {
    $this->get(route('favorites.login', ['return' => $return]))
        ->assertRedirect(route('login'))
        ->assertSessionHas('url.intended', url('/'));
})->with([
    'absolute' => 'https://evil.test/phish',
    'protocol relative' => '//evil.test',
]);

test('login after the heart returns to the same page without saving', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->create();
    $return = '/listings/'.$listing->id;

    $this->get(route('favorites.login', ['return' => $return]))
        ->assertRedirect(route('login'));

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(url($return));

    $this->assertAuthenticated();
    $this->assertDatabaseCount('listing_favorites', 0);
});

test('an authenticated user can save a published listing once', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->create();

    $this->actingAs($user)
        ->from(route('home'))
        ->post(route('listings.favorite.store', $listing))
        ->assertRedirect(route('home'));

    $this->actingAs($user)
        ->from(route('home'))
        ->post(route('listings.favorite.store', $listing))
        ->assertRedirect(route('home'));

    expect($user->favoritedListings()->count())->toBe(1);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('listings.0.id', $listing->id)
            ->where('listings.0.is_favorited', true)
        );

    $this->actingAs($user)
        ->get(route('listings.show', $listing))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('favorited', true)
            ->missing('listing.is_favorited')
        );
});

test('removing a favorite is idempotent', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->create();
    $user->favoritedListings()->attach($listing);

    $this->actingAs($user)
        ->from(route('listings.show', $listing))
        ->delete(route('listings.favorite.destroy', $listing))
        ->assertRedirect(route('listings.show', $listing));

    expect($user->favoritedListings()->count())->toBe(0);

    $this->actingAs($user)
        ->from(route('listings.show', $listing))
        ->delete(route('listings.favorite.destroy', $listing))
        ->assertRedirect(route('listings.show', $listing));

    $this->assertDatabaseCount('listing_favorites', 0);
});

test('an unpublished listing cannot be favorited', function () {
    $owner = User::factory()->create();
    $listing = Listing::factory()->for($owner)->unpublished()->create();

    $this->actingAs($owner)
        ->post(route('listings.favorite.store', $listing))
        ->assertNotFound();

    $this->actingAs(User::factory()->create())
        ->delete(route('listings.favorite.destroy', $listing))
        ->assertNotFound();

    $this->assertDatabaseCount('listing_favorites', 0);
});

test('favorites lists only that user\'s published saves, newest first', function () {
    $this->freezeTime();

    $user = User::factory()->create();
    $other = User::factory()->create();
    $older = Listing::factory()->create();
    $newer = Listing::factory()->create();
    $hidden = Listing::factory()->create();
    $someoneElses = Listing::factory()->create();

    $user->favoritedListings()->attach($older->id, [
        'created_at' => now()->subDay(),
        'updated_at' => now()->subDay(),
    ]);
    $user->favoritedListings()->attach($newer->id, [
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $user->favoritedListings()->attach($hidden->id, [
        'created_at' => now()->subHour(),
        'updated_at' => now()->subHour(),
    ]);
    $other->favoritedListings()->attach($someoneElses);

    $hidden->unpublish();

    $this->actingAs($user)
        ->get(route('favorites.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('favorites/index')
            ->has('listings', 2)
            ->where('listings.0.id', $newer->id)
            ->where('listings.0.is_favorited', true)
            ->where('listings.1.id', $older->id)
            ->missing('listings.0.can')
        );

    expect($user->favoritedListings()->whereKey($hidden->id)->exists())->toBeTrue();

    $hidden->publish();

    $this->actingAs($user)
        ->get(route('favorites.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('listings', 3)
            ->where('listings.0.id', $newer->id)
            ->where('listings.1.id', $hidden->id)
            ->where('listings.2.id', $older->id)
        );
});

test('deleting a listing removes its favorites', function () {
    $owner = User::factory()->create();
    $user = User::factory()->create();
    $listing = Listing::factory()->for($owner)->create();
    $user->favoritedListings()->attach($listing);

    $this->actingAs($owner)
        ->delete(route('listings.destroy', $listing))
        ->assertRedirect(route('listings.mine'));

    $this->assertDatabaseMissing('listing_favorites', [
        'user_id' => $user->id,
        'listing_id' => $listing->id,
    ]);
});
