<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Laravel\Socialite\Two\User as SocialiteUser;

/**
 * @param  array<string, mixed>  $overrides
 */
function googleUser(array $overrides = []): SocialiteUser
{
    return SocialiteUser::fake([
        'id' => 'google-1',
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.com',
        'email_verified' => true,
        ...$overrides,
    ]);
}

test('guests are redirected to google', function () {
    Socialite::fake('google');

    $this->get(route('auth.google.redirect'))
        ->assertRedirect('https://socialite.fake/google/authorize');
});

test('authenticated users are not sent to google', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('auth.google.redirect'))
        ->assertRedirect(route('home'));
});

test('a new google user is signed in', function () {
    Socialite::fake('google', googleUser());

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('home'));

    $user = User::query()->where('email', 'ada@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->google_id)->toBe('google-1')
        ->and($user->password)->toBeNull()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->terms_accepted_at)->not->toBeNull()
        ->and($user->name)->toBe('Ada Lovelace');

    $this->assertAuthenticatedAs($user);
});

test('google login returns to the intended url', function () {
    Socialite::fake('google', googleUser());

    $this->get(route('login.intended', ['return' => '/favorites']));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(url('/favorites'));

    $this->assertAuthenticated();
});

test('the same google account signs into the existing user', function () {
    $user = User::factory()->create([
        'name' => 'Local Name',
        'email' => 'local@example.com',
        'google_id' => 'google-1',
    ]);

    Socialite::fake('google', googleUser([
        'name' => 'Google Name',
        'email' => 'other@example.com',
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('home'));

    $user->refresh();

    expect(User::query()->count())->toBe(1)
        ->and($user->name)->toBe('Local Name')
        ->and($user->email)->toBe('local@example.com')
        ->and(Hash::check('password', $user->password))->toBeTrue();

    $this->assertAuthenticatedAs($user);
});

test('an unverified local account is linked and its password is cleared', function () {
    $user = User::factory()->unverified()->create([
        'name' => 'Ada',
        'email' => 'ada@example.com',
    ]);

    Socialite::fake('google', googleUser());

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('home'));

    $user->refresh();

    expect(User::query()->count())->toBe(1)
        ->and($user->google_id)->toBe('google-1')
        ->and($user->name)->toBe('Ada')
        ->and($user->password)->toBeNull()
        ->and($user->email_verified_at)->not->toBeNull();

    $this->assertAuthenticatedAs($user);
});

test('a verified local account keeps its password when linked', function () {
    $user = User::factory()->create([
        'name' => 'Ada',
        'email' => 'ada@example.com',
    ]);

    Socialite::fake('google', googleUser());

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('home'));

    $user->refresh();

    expect($user->google_id)->toBe('google-1')
        ->and(Hash::check('password', $user->password))->toBeTrue()
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->terms_accepted_at)->toBeNull();

    $this->assertAuthenticatedAs($user);
});

test('google sign in is rejected when the email is not verified', function () {
    Socialite::fake('google', googleUser(['email_verified' => false]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'Google no compartió un correo verificado.');

    $this->assertGuest();
    expect(User::query()->count())->toBe(0);
});

test('google sign in is rejected when the email is missing', function () {
    Socialite::fake('google', googleUser(['email' => null]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'Google no compartió un correo verificado.');

    $this->assertGuest();
    expect(User::query()->count())->toBe(0);
});

test('a google account does not take over a different linked user', function () {
    $owner = User::factory()->create([
        'email' => 'ada@example.com',
        'google_id' => 'google-owner',
    ]);

    Socialite::fake('google', googleUser(['id' => 'google-other']));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'No se pudo iniciar sesión con Google. Vuelve a intentarlo.');

    $this->assertGuest();
    expect(User::query()->count())->toBe(1)
        ->and($owner->refresh()->google_id)->toBe('google-owner');
});

test('an invalid google callback leaves the guest signed out', function () {
    Socialite::fake('google', fn () => throw new InvalidStateException);

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('login'))
        ->assertSessionHas('error', 'No se pudo iniciar sesión con Google. Vuelve a intentarlo.');

    $this->assertGuest();
    expect(User::query()->count())->toBe(0);
});

test('a blank google name falls back to the email mailbox', function () {
    Socialite::fake('google', googleUser(['name' => '   ']));

    $this->get(route('auth.google.callback'));

    expect(User::query()->where('email', 'ada@example.com')->value('name'))->toBe('ada');
});

test('google email is stored in lowercase', function () {
    Socialite::fake('google', googleUser(['email' => 'Ada@Example.com']));

    $this->get(route('auth.google.callback'));

    expect(User::query()->where('google_id', 'google-1')->value('email'))->toBe('ada@example.com');
});
