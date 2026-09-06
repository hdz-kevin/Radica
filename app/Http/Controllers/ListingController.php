<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingCardResource;
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

    /**
     * Render the create listing page.
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
    public function store(StoreListingRequest $request): RedirectResponse
    {
        $listing = DB::transaction(function () use ($request): Listing {
            $listing = $request->user()->listings()->create([
                ...$request->listingAttributes(),
                'published_at' => now(),
            ]);

            $phoneNumber = $request->phoneNumberToPersist();

            if ($phoneNumber !== null) {
                $request->user()->update(['phone_number' => $phoneNumber]);
            }

            return $listing;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación creada.']);

        return to_route('listings.show', $listing);
    }

    public function show(Listing $listing): Response
    {
        if (! Gate::allows('view', $listing)) {
            abort(404);
        }

        $listing->load(['user:id,phone_number']);

        return Inertia::render('listings/show', [
            'listing' => ListingShowResource::make($listing),
            'can' => [
                'update' => Gate::allows('update', $listing),
                'delete' => Gate::allows('delete', $listing),
                'publish' => Gate::allows('publish', $listing),
            ],
        ]);
    }

    public function mine(Request $request): Response
    {
        $listings = $request->user()
            ->listings()
            ->latest('updated_at')
            ->latest('id')
            ->get();

        return Inertia::render('listings/mine', [
            'listings' => ListingMineResource::collection($listings),
        ]);
    }

    public function edit(Listing $listing): Response
    {
        Gate::authorize('update', $listing);

        return Inertia::render('listings/edit', [
            'listing' => [
                'id' => $listing->id,
                'title' => $listing->title,
                'description' => $listing->description,
                'category' => $listing->category->value,
                'rent_amount' => $listing->rent_amount,
                'is_furnished' => $listing->is_furnished,
                'pets_allowed' => $listing->pets_allowed,
                'bedrooms' => $listing->bedrooms,
                'bathrooms' => $listing->bathrooms,
                'has_parking' => $listing->has_parking,
                'include_water' => $listing->include_water,
                'include_electricity' => $listing->include_electricity,
                'include_gas' => $listing->include_gas,
                'include_internet' => $listing->include_internet,
                'include_cable' => $listing->include_cable,
                'state' => $listing->state,
                'city' => $listing->city,
                'zone' => $listing->zone,
                'street_address' => $listing->street_address,
                'contact_via_whatsapp' => $listing->contact_via_whatsapp,
                'contact_via_phone' => $listing->contact_via_phone,
            ],
        ]);
    }

    public function update(UpdateListingRequest $request, Listing $listing): RedirectResponse
    {
        DB::transaction(function () use ($request, $listing): void {
            $listing->update($request->listingAttributes());

            $phoneNumber = $request->phoneNumberToPersist();

            if ($phoneNumber !== null) {
                $request->user()->update(['phone_number' => $phoneNumber]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación actualizada.']);

        return to_route('listings.show', $listing);
    }

    public function destroy(Listing $listing): RedirectResponse
    {
        Gate::authorize('delete', $listing);

        $listing->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación eliminada.']);

        return to_route('listings.mine');
    }

    public function publish(Request $request, Listing $listing): RedirectResponse
    {
        Gate::authorize('publish', $listing);

        if (! $request->user()->hasPhone()) {
            return back()->withErrors([
                'phone_number' => 'Añade un teléfono en tu perfil o al editar la publicación.',
            ]);
        }

        $listing->publish();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'La publicación ya es visible en el catálogo.']);

        return back();
    }

    public function unpublish(Listing $listing): RedirectResponse
    {
        Gate::authorize('unpublish', $listing);

        $listing->unpublish();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'La publicación ya no es visible en el catálogo.']);

        return back();
    }
}
