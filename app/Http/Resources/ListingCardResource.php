<?php

namespace App\Http\Resources;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Listing */
class ListingCardResource extends JsonResource
{
    /**
     * Transform Listing model into a simpler array for the listing card component.
     *
     * @return array{
     *     id: int,
     *     title: string,
     *     category: string,
     *     rent_amount: int,
     *     zone: string,
     *     city: string
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category->value,
            'rent_amount' => $this->rent_amount,
            'zone' => $this->zone,
            'city' => $this->city,
        ];
    }
}
