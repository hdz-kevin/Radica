<?php

namespace App\Concerns;

use App\Enums\ListingCategory;
use App\Models\Listing;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

trait ListingValidationRules
{
    /**
     * All boolean fields expected in the incoming request.
     *
     * @var list<string>
     */
    private const BOOLEAN_FIELDS = [
        'is_furnished',
        'pets_allowed',
        'has_parking',
        'include_water',
        'include_electricity',
        'include_gas',
        'include_internet',
        'include_cable',
        'contact_via_whatsapp',
        'contact_via_phone',
    ];

    /**
     * Ensure that the boolean fields are always included in the request.
     * If they don't exist in the incoming request, they are set to false.
     */
    protected function prepareForValidation(): void
    {
        $merged = [];

        foreach (self::BOOLEAN_FIELDS as $field) {
            $merged[$field] = $this->boolean($field);
        }

        $this->merge($merged);
    }

    /**
     * Get the validation rules used to validate listings.
     * Bedrooms and bathrooms are required for apartments and houses.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function listingRules(): array
    {
        $isApartment = $this->input('category') === ListingCategory::Apartment->value;
        $isHouse = $this->input('category') === ListingCategory::House->value;

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', Rule::enum(ListingCategory::class)],
            'rent_amount' => ['required', 'integer', 'min:1'],
            'zone' => ['required', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'is_furnished' => ['required', 'boolean'],
            'pets_allowed' => ['required', 'boolean'],
            'has_parking' => ['required', 'boolean'],
            'include_water' => ['required', 'boolean'],
            'include_electricity' => ['required', 'boolean'],
            'include_gas' => ['required', 'boolean'],
            'include_internet' => ['required', 'boolean'],
            'include_cable' => ['required', 'boolean'],
            'contact_via_whatsapp' => ['required', 'boolean'],
            'contact_via_phone' => ['required', 'boolean'],
            'bedrooms' => [
                Rule::when($isApartment || $isHouse, ['required', 'integer', 'min:1'], ['nullable']),
            ],
            'bathrooms' => [
                Rule::when($isApartment || $isHouse, ['required', 'integer', 'min:1'], ['nullable']),
            ],
        ];
    }

    /**
     * Require at least one contact channel after the field rules pass.
     *
     * @return array<int, callable(Validator): void>
     */
    protected function contactChannelRules(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->boolean('contact_via_whatsapp') || $this->boolean('contact_via_phone')) {
                    return;
                }

                $validator->errors()->add(
                    'contact_via_whatsapp',
                    'Elige al menos un canal de contacto: WhatsApp o llamada.',
                );
            },
        ];
    }

    /**
     * Prepare the listing data to be persisted after validation.
     *
     * @return array<string, mixed>
     */
    public function listingAttributes(): array
    {
        $category = ListingCategory::from($this->input('category'));

        $attributes = [
            ...$this->validated(),
            'state' => Listing::DEFAULT_STATE,
            'city' => Listing::DEFAULT_CITY,
        ];

        if ($category === ListingCategory::Room) {
            $attributes['bedrooms'] = null;
            $attributes['bathrooms'] = null;
        }

        return $attributes;
    }
}
