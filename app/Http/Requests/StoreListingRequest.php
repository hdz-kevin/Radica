<?php

namespace App\Http\Requests;

use App\Concerns\ListingValidationRules;
use App\Models\Listing;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    use ListingValidationRules;

    /**
     * Determine whether the user may create a listing.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Listing::class);
    }

    /**
     * Get the validation rules used to validate listings.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->listingRules();
    }

    /**
     * Get the "after" validation rules.
     * This is used to add additional validation rules that depend on the validated data.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        // At least one contact channel is required after the field rules pass.
        return $this->contactChannelRules();
    }
}
