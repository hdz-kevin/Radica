<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    /**
     * Anyone may request the published listings.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Anyone may view a published listing.
     * Only the owner may view an unpublished listing.
     */
    public function view(?User $user, Listing $listing): bool
    {
        if ($listing->isPublished()) {
            return true;
        }

        return $user !== null && $user->id === $listing->user_id;
    }

    /**
     * Only the owner can create a listing.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Only the owner can update a listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return false;
    }

    /**
     * Only the owner can delete a listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Listing $listing): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Listing $listing): bool
    {
        return false;
    }
}
