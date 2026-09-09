<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ListingImage>
 */
class ListingImageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'path' => 'listings/placeholder.jpg',
            'disk' => ListingImage::DISK,
            'position' => 0,
            'is_cover' => true,
        ];
    }
}
