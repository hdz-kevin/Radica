<?php

namespace App\Support;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Curated Teziutlán neighborhoods from config/locations.php.
 * Listings still store city, neighborhood, latitude, and longitude as values.
 *
 * @phpstan-type City array{state: string, name: string, latitude: float, longitude: float, zoom: int}
 * @phpstan-type Neighborhood array{slug: string, name: string, latitude: float, longitude: float, zoom: int}
 */
class TeziutlanNeighborhoods
{
    /**
     * @return City
     */
    public static function city(): array
    {
        /** @var City $city */
        $city = config('locations.city');

        return $city;
    }

    /**
     * @return Collection<int, Neighborhood>
     */
    public static function all(): Collection
    {
        /** @var list<Neighborhood> $neighborhoods */
        $neighborhoods = config('locations.neighborhoods');

        return collect($neighborhoods)->values();
    }

    /**
     * @return Neighborhood|null
     */
    public static function find(string $slug): ?array
    {
        /** @var Neighborhood|null $neighborhood */
        $neighborhood = self::all()->firstWhere('slug', $slug);

        return $neighborhood;
    }

    /**
     * @return list<string>
     */
    public static function names(): array
    {
        return self::all()->pluck('name')->all();
    }

    public static function contains(string $name): bool
    {
        $needle = self::normalize($name);

        return self::all()->contains(
            fn (array $neighborhood): bool => self::normalize($neighborhood['name']) === $needle
        );
    }

    private static function normalize(string $value): string
    {
        return Str::lower(Str::ascii(trim($value)));
    }
}
