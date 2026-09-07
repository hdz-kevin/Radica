<?php

namespace App\Http\Requests;

use App\Concerns\ListingValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateListingRequest extends FormRequest
{
    use ListingValidationRules;

    /**
     * Determine if the user is authorized to update the listing.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('listing'));
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
        return $this->contactChannelRules();
    }
}
