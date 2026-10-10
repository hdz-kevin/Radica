<?php

use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config([
        'legal.owner_name' => 'Radica',
        'legal.contact_email' => 'radica@example.com',
    ]);
});

test('guests can read the legal documents with the configured owner', function (string $route, string $component) {
    $this->get(route($route))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component($component)
            ->where('legal.owner_name', 'Radica')
            ->where('legal.contact_email', 'radica@example.com')
            ->where('legal.jurisdiction', config('legal.jurisdiction'))
            ->where('legal.updated_at', config('legal.updated_at'))
        );
})->with([
    'terms' => ['legal.terms', 'legal/terms'],
    'privacy' => ['legal.privacy', 'legal/privacy'],
]);
