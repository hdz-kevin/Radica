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
     * Any authenticated user may publish a listing.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Only the owner can update a listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return $this->owns($user, $listing);
    }

    /**
     * Only the owner can delete a listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return $this->owns($user, $listing);
    }

    /**
     * Only the owner can publish a listing.
     */
    public function publish(User $user, Listing $listing): bool
    {
        return $this->owns($user, $listing);
    }

    /**
     * Only the owner can unpublish a listing.
     */
    public function unpublish(User $user, Listing $listing): bool
    {
        return $this->owns($user, $listing);
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

    /**
     * Whether the user owns the listing.
     */
    private function owns(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }
}
