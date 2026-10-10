<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListingCardResource;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ListingFavoriteController extends Controller
{
    /**
     * List the published listings the user saved for later.
     */
    public function index(Request $request): Response
    {
        $listings = $request->user()
            ->favoritedListings()
            ->published()
            ->with('cover')
            ->withFavoritedBy($request->user())
            ->orderByPivot('created_at', 'desc')
            ->orderByDesc('listings.id')
            ->get();

        return Inertia::render('favorites/index', [
            'listings' => ListingCardResource::collection($listings),
        ]);
    }

    /**
     * Save a published listing. Repeating the request does not create a second row.
     */
    public function store(Request $request, Listing $listing): RedirectResponse
    {
        $this->ensurePublished($listing);

        $request->user()->favoritedListings()->syncWithoutDetaching([$listing->id]);

        return back();
    }

    /**
     * Remove a saved listing. Missing rows are left as they are.
     */
    public function destroy(Request $request, Listing $listing): RedirectResponse
    {
        $this->ensurePublished($listing);

        $request->user()->favoritedListings()->detach($listing->id);

        return back();
    }

    /**
     * Unpublished listings are hidden the same way as the public show page.
     */
    private function ensurePublished(Listing $listing): void
    {
        if (! Gate::allows('favorite', $listing)) {
            abort(404);
        }
    }
}
