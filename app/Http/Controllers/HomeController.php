<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListingCardResource;
use App\Models\Listing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public landing page.
     */
    public function __invoke(Request $request): Response
    {
        $featuredListings = Listing::query()
            ->published()
            ->with('cover')
            ->withFavoritedBy($request->user())
            ->latest('published_at')
            ->latest('id')
            ->limit(6)
            ->get();

        return Inertia::render('home', [
            'featuredListings' => ListingCardResource::collection($featuredListings),
        ]);
    }
}
