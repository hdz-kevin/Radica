<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(): Response
    {
        $listings = Listing::query()
            ->published()
            ->latest('published_at')
            ->get()
            ->map(fn (Listing $listing): array => $this->catalogCard($listing))
            ->values();

        return Inertia::render('listings/index', [
            'listings' => $listings,
        ]);
    }

    public function show(Listing $listing): Response
    {
        if (! Gate::allows('view', $listing)) {
            abort(404);
        }

        $listing->load(['user:id,phone_number']);

        return Inertia::render('listings/show', [
            'listing' => $this->catalogShow($listing),
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     category: string,
     *     rent_amount: int,
     *     zone: string,
     *     city: string
     * }
     */
    private function catalogCard(Listing $listing): array
    {
        return [
            'id' => $listing->id,
            'title' => $listing->title,
            'category' => $listing->category->value,
            'rent_amount' => $listing->rent_amount,
            'zone' => $listing->zone,
            'city' => $listing->city,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function catalogShow(Listing $listing): array
    {
        return [
            'id' => $listing->id,
            'title' => $listing->title,
            'description' => $listing->description,
            'category' => $listing->category->value,
            'rent_amount' => $listing->rent_amount,
            'is_furnished' => $listing->is_furnished,
            'pets_allowed' => $listing->pets_allowed,
            'bathroom_type' => $listing->bathroom_type?->value,
            'bedrooms' => $listing->bedrooms,
            'bathrooms' => $listing->bathrooms,
            'square_meters' => $listing->square_meters,
            'has_parking' => $listing->has_parking,
            'is_published' => $listing->is_published,
            'location' => [
                'state' => $listing->state,
                'city' => $listing->city,
                'zone' => $listing->zone,
                'street_address' => $listing->street_address,
            ],
            'contact_via_whatsapp' => $listing->contact_via_whatsapp,
            'contact_via_phone' => $listing->contact_via_phone,
            'owner' => [
                'phone_number' => $listing->user->phone_number,
            ],
        ];
    }
}
