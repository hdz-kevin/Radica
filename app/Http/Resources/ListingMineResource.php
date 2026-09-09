<?php

namespace App\Http\Resources;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Listing */
class ListingMineResource extends JsonResource
{
    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     category: string,
     *     rent_amount: int,
     *     zone: string,
     *     city: string,
     *     is_published: bool,
     *     cover_url: string|null
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
            'is_published' => $this->is_published,
            'cover_url' => $this->cover?->url(),
        ];
    }
}
