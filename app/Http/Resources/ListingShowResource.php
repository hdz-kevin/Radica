<?php

namespace App\Http\Resources;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Listing */
class ListingShowResource extends JsonResource
{
    /**
     * Transform Listing model into a simpler array for the listing show view.
     *
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
            'is_published' => $this->is_published,
            'state' => $this->state,
            'city' => $this->city,
            'zone' => $this->zone,
            'street_address' => $this->street_address,
            'contact_via_whatsapp' => $this->contact_via_whatsapp,
            'contact_via_phone' => $this->contact_via_phone,
            'user' => [
                'phone_number' => $this->user->phone_number,
            ],
        ];
    }
}
