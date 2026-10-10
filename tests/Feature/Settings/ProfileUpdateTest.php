<?php

use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('deleting the account removes all of its listings and photo files', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->withImages(1)->create();
    $trashed = Listing::factory()->for($user)->trashed()->create();
    $path = $listing->images()->first()->path;
    $user->favoritedListings()->attach($otherListing = Listing::factory()->create());

    $this->actingAs($user)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertRedirect(route('home'));

    expect(Listing::withTrashed()->whereKey([$listing->id, $trashed->id])->exists())->toBeFalse();
    $this->assertDatabaseMissing('listing_images', ['listing_id' => $listing->id]);
    $this->assertDatabaseMissing('listing_favorites', ['user_id' => $user->id]);
    $this->assertModelExists($otherListing);
    Storage::disk(ListingImage::storageDisk())->assertMissing($path);
});

test('phone number can be saved on the profile', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => '5512345678',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh()->phone_number)->toBe('5215512345678');
});

test('saving a phone number does not prefix it twice', function () {
    $user = User::factory()->withPhone()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => '5512345678',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh()->phone_number)->toBe('5215512345678');
});

test('profile shows spanish messages when name and email are missing', function () {
    $this->app->setLocale('es');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->patch(route('profile.update'), [
            'name' => '',
            'email' => '',
        ])
        ->assertSessionHasErrors([
            'name' => 'El nombre es obligatorio.',
            'email' => 'El correo electrónico es obligatorio.',
        ])
        ->assertRedirect(route('profile.edit'));
});

test('phone number must be 10 digits', function () {
    $this->app->setLocale('es');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => '5215512345678',
        ])
        ->assertSessionHasErrors([
            'phone_number' => 'El número de teléfono debe contener 10 dígitos.',
        ])
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh()->phone_number)->toBeNull();
});

test('phone number can be cleared on the profile', function () {
    $user = User::factory()->withPhone()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh()->phone_number)->toBeNull();
});

test('a user without a password can delete their account', function () {
    $user = User::factory()->create([
        'password' => null,
        'google_id' => 'google-1',
    ]);

    $this->actingAs($user)
        ->delete(route('profile.destroy'))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
