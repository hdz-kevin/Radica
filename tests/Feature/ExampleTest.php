<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the home page renders the public catalog', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('listings/index')
            ->has('listings', 0)
        );
});
