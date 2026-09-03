<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListingCardResource;
use App\Http\Resources\ListingShowResource;
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
            ->get();

        return Inertia::render('listings/index', [
            'listings' => ListingCardResource::collection($listings),
        ]);
    }

    public function show(Listing $listing): Response
    {
        if (! Gate::allows('view', $listing)) {
            abort(404);
        }

        $listing->load(['user:id,phone_number']);

        return Inertia::render('listings/show', [
            'listing' => ListingShowResource::make($listing),
        ]);
    }
}
