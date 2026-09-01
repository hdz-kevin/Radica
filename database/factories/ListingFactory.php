<?php

namespace Database\Factories;

use App\Enums\BathroomType;
use App\Enums\ListingCategory;
use App\Models\Listing;
use App\Models\User;
use App\Support\TeziutlanNeighborhoods;
use Illuminate\Database\Eloquent\Factories\Factory;
use RuntimeException;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $city = TeziutlanNeighborhoods::city();
        $centro = TeziutlanNeighborhoods::find('centro')
            ?? throw new RuntimeException('The centro neighborhood is missing from config/locations.php.');

        return [
            'user_id' => User::factory(),
            'category' => ListingCategory::Apartment,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'rent_amount' => 12000,
            'is_furnished' => false,
            'pets_allowed' => false,
            'bathroom_type' => null,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'square_meters' => 75,
            'has_parking' => true,
            'state' => $city['state'],
            'city' => $city['name'],
            'neighborhood' => $centro['name'],
            'street_address' => null,
            'latitude' => $centro['latitude'],
            'longitude' => $centro['longitude'],
            'contact_via_whatsapp' => true,
            'contact_via_phone' => true,
            'is_published' => true,
            'published_at' => now(),
        ];
    }

    /**
     * Indicate that the listing is a room.
     */
    public function room(BathroomType $bathroomType = BathroomType::Own): static
    {
        return $this->state(fn (array $attributes): array => [
            'category' => ListingCategory::Room,
            'bathroom_type' => $bathroomType,
            'bedrooms' => null,
            'bathrooms' => null,
            'square_meters' => null,
            'has_parking' => null,
        ]);
    }

    /**
     * Indicate that the listing is an apartment.
     */
    public function apartment(): static
    {
        return $this->state(fn (array $attributes): array => [
            'category' => ListingCategory::Apartment,
            'bathroom_type' => null,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'square_meters' => 75,
            'has_parking' => true,
        ]);
    }

    /**
     * Indicate that the listing is a house.
     */
    public function house(): static
    {
        return $this->state(fn (array $attributes): array => [
            'category' => ListingCategory::House,
            'bathroom_type' => null,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_meters' => 140,
            'has_parking' => true,
        ]);
    }

    /**
     * Indicate that the listing is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_published' => false,
        ]);
    }
}
