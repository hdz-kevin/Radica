<?php

namespace App\Http\Controllers;

use App\Actions\SyncListingImages;
use App\Enums\ListingCategory;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingCardResource;
use App\Http\Resources\ListingFormResource;
use App\Http\Resources\ListingMineResource;
use App\Http\Resources\ListingShowResource;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    /**
     * Display the listing index page.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'zone' => ['sometimes', 'nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string'],
        ]);

        $zone = trim((string) ($validated['zone'] ?? ''));
        $category = ListingCategory::tryFrom((string) ($validated['category'] ?? ''));

        $listings = Listing::query()
            ->published()
            ->with('cover')
            ->when($zone !== '', fn ($query) => $query->inZone($zone))
            ->when($category, fn ($query, ListingCategory $category) => $query->ofCategory($category))
            ->latest('published_at')
            // Specify a Deterministic Sort Order. 'id' as stable tie-breaker.
            ->latest('id')
            ->get();

        return Inertia::render('listings/index', [
            'listings' => ListingCardResource::collection($listings),
            'filters' => [
                'zone' => $zone,
                'category' => $category?->value,
            ],
        ]);
    }

    /**
     * Display the create listing form.
     */
    public function create(): Response
    {
        Gate::authorize('create', Listing::class);

        return Inertia::render('listings/create', [
            'defaults' => [
                'state' => Listing::DEFAULT_STATE,
                'city' => Listing::DEFAULT_CITY,
            ],
        ]);
    }

    /**
     * Save a new listing to the database.
     */
    public function store(StoreListingRequest $request, SyncListingImages $sync): RedirectResponse
    {
        if (! $request->user()->hasPhone()) {
            return back()->withErrors([
                'phone_number' => 'Guarda tu teléfono de contacto en tu perfil.',
            ]);
        }

        // Create the listing and sync the images
        $listing = DB::transaction(function () use ($request, $sync): Listing {
            $listing = $request->user()->listings()->create([
                ...$request->listingAttributes(),
                'published_at' => now(),
            ]);

            $sync->handle($listing, $request->uploadedImages());

            return $listing;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación creada.']);

        return to_route('listings.show', $listing);
    }

    /**
     * Show an individual listing.
     */
    public function show(Listing $listing): Response
    {
        if (! Gate::allows('view', $listing)) {
            abort(404);
        }

        $listing->load(['user:id,phone_number', 'images']);

        return Inertia::render('listings/show', [
            'listing' => ListingShowResource::make($listing),
            'can' => [
                'update' => Gate::allows('update', $listing),
                'delete' => Gate::allows('delete', $listing),
                'publish' => Gate::allows('publish', $listing),
            ],
        ]);
    }

    /**
     * Display the user's listings.
     */
    public function mine(Request $request): Response
    {
        $listings = $request->user()
            ->listings()
            ->with('cover')
            ->latest('created_at')
            ->latest('id')
            ->get();

        return Inertia::render('listings/mine', [
            'listings' => ListingMineResource::collection($listings),
        ]);
    }

    /**
     * Display the edit listing form
     */
    public function edit(Listing $listing): Response
    {
        Gate::authorize('update', $listing);

        $listing->load('images');

        return Inertia::render('listings/edit', [
            'listing' => ListingFormResource::make($listing),
        ]);
    }

    /**
     * Update the listing in the database.
     */
    public function update(UpdateListingRequest $request, Listing $listing, SyncListingImages $sync): RedirectResponse
    {
        DB::transaction(function () use ($request, $listing, $sync): void {
            $listing->update($request->listingAttributes());
            $sync->handle(
                $listing,
                $request->uploadedImages(),
                $request->imageOrder(),
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación actualizada.']);

        return to_route('listings.show', $listing);
    }

    /**
     * Delete the listing from the database.
     */
    public function destroy(Listing $listing): RedirectResponse
    {
        Gate::authorize('delete', $listing);

        $listing->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación eliminada.']);

        return to_route('listings.mine');
    }

    /**
     * Mark the listing as published.
     */
    public function publish(Listing $listing): RedirectResponse
    {
        Gate::authorize('publish', $listing);

        $listing->publish();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'La publicación ya es visible en el catálogo.']);

        return back();
    }

    /**
     * Mark the listing as unpublished.
     */
    public function unpublish(Listing $listing): RedirectResponse
    {
        Gate::authorize('unpublish', $listing);

        $listing->unpublish();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'La publicación ya no es visible en el catálogo.']);

        return back();
    }
}
