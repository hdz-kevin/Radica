<?php

test('a same-app return path becomes the intended url', function () {
    $this->get(route('login.intended', ['return' => '/listings/1']))
        ->assertRedirect(route('login'))
        ->assertSessionHas('url.intended', url('/listings/1'));
});

test('an external return url is ignored', function (string $return) {
    $this->get(route('login.intended', ['return' => $return]))
        ->assertRedirect(route('login'))
        ->assertSessionHas('url.intended', url('/'));
})->with([
    'absolute' => 'https://evil.test/phish',
    'protocol relative' => '//evil.test',
]);
