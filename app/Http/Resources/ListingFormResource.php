<?php

namespace App\Http\Resources;

use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Listing */
class ListingFormResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category->value,
            'rent_amount' => $this->rent_amount,
            'is_furnished' => $this->is_furnished,
            'pets_allowed' => $this->pets_allowed,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'has_parking' => $this->has_parking,
            'include_water' => $this->include_water,
            'include_electricity' => $this->include_electricity,
            'include_gas' => $this->include_gas,
            'include_internet' => $this->include_internet,
            'include_cable' => $this->include_cable,
            'state' => $this->state,
            'city' => $this->city,
            'zone' => $this->zone,
            'street_address' => $this->street_address,
            'contact_via_whatsapp' => $this->contact_via_whatsapp,
            'contact_via_phone' => $this->contact_via_phone,
            'images' => $this->images->map(fn (ListingImage $image): array => [
                'id' => $image->id,
                'url' => $image->url(),
            ])->values()->all(),
        ];
    }
}
