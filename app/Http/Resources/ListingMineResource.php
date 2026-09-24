<?php

namespace App\Http\Resources;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

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
     *     street_address: string|null,
     *     is_published: bool,
     *     cover_url: string|null,
     *     can: array{update: bool, delete: bool, publish: bool}
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
            'street_address' => $this->street_address,
            'is_published' => $this->is_published,
            'cover_url' => $this->cover?->url(),
            'can' => [
                'update' => Gate::allows('update', $this->resource),
                'delete' => Gate::allows('delete', $this->resource),
                'publish' => Gate::allows('publish', $this->resource),
            ],
        ];
    }
}
