<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::query()->where('email', 'test@example.com')->first();

    Notification::assertSentTo($user, VerifyEmail::class);
});

test('empty registration shows spanish required messages', function () {
    $this->app->setLocale('es');

    $this->post(route('register.store'), [])
        ->assertSessionHasErrors([
            'name' => 'El nombre es obligatorio.',
            'email' => 'El correo electrónico es obligatorio.',
            'password' => 'La contraseña es obligatoria.',
        ]);

    $this->assertGuest();
});

test('invalid registration email shows a spanish message', function () {
    $this->app->setLocale('es');

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'not-an-email',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors([
        'email' => 'El correo electrónico no es válido.',
    ]);

    $this->assertGuest();
});

test('taken registration email shows a spanish message', function () {
    $this->app->setLocale('es');

    User::factory()->create(['email' => 'taken@example.com']);

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'taken@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors([
        'email' => 'El correo electrónico ya está registrado.',
    ]);

    $this->assertGuest();
});

test('short registration password shows a spanish message', function () {
    $this->app->setLocale('es');

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ])->assertSessionHasErrors([
        'password' => 'La contraseña debe tener al menos 8 caracteres.',
    ]);

    $this->assertGuest();
});

test('mismatched registration passwords show a spanish message', function () {
    $this->app->setLocale('es');

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'different',
    ])->assertSessionHasErrors([
        'password' => 'Las contraseñas no coinciden.',
    ]);

    $this->assertGuest();
});

test('unverified users are sent to the verification notice', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('verification.notice'));
});
