<?php

use App\Support\TeziutlanNeighborhoods;

test('city is Teziutlan Puebla', function () {
    expect(TeziutlanNeighborhoods::city())
        ->toMatchArray([
            'state' => 'Puebla',
            'name' => 'Teziutlán',
        ]);
});

test('find returns Centro for the centro slug', function () {
    expect(TeziutlanNeighborhoods::find('centro'))
        ->toMatchArray([
            'slug' => 'centro',
            'name' => 'Centro',
            'latitude' => 19.8178,
            'longitude' => -97.3606,
            'zoom' => 15,
        ]);
});

test('find returns null for an unknown slug', function () {
    expect(TeziutlanNeighborhoods::find('roma-norte'))->toBeNull();
});

test('names includes Centro', function () {
    expect(TeziutlanNeighborhoods::names())->toContain('Centro');
});

test('contains is true for a catalog name regardless of case or accents', function (string $name) {
    expect(TeziutlanNeighborhoods::contains($name))->toBeTrue();
})->with([
    'lowercase' => ['centro'],
    'without accent' => ['San Sebastian'],
]);

test('contains is false for a name that is not in the catalog', function () {
    expect(TeziutlanNeighborhoods::contains('Roma Norte'))->toBeFalse();
});

test('every neighborhood has a slug name and map centroid', function () {
    foreach (TeziutlanNeighborhoods::all() as $neighborhood) {
        expect($neighborhood)->toHaveKeys(['slug', 'name', 'latitude', 'longitude', 'zoom']);
        expect($neighborhood['slug'])->not->toBeEmpty();
        expect($neighborhood['name'])->not->toBeEmpty();
    }
});
