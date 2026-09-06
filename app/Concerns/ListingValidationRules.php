<?php

namespace App\Concerns;

use App\Enums\BathroomType;
use App\Enums\ListingCategory;
use App\Models\Listing;
use App\Rules\MexicanPhoneNumber;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

trait ListingValidationRules
{
    protected function prepareForValidation(): void
    {
        $booleans = [
            'is_furnished',
            'pets_allowed',
            'contact_via_whatsapp',
            'contact_via_phone',
        ];

        $merged = [];

        foreach ($booleans as $field) {
            $merged[$field] = $this->boolean($field);
        }

        if ($this->input('category') !== ListingCategory::Room->value) {
            $merged['has_parking'] = $this->boolean('has_parking');
        }

        $this->merge($merged);
    }

    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function listingRules(): array
    {
        $isRoom = $this->input('category') === ListingCategory::Room->value;

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', Rule::enum(ListingCategory::class)],
            'rent_amount' => ['required', 'integer', 'min:1'],
            'zone' => ['required', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'is_furnished' => ['required', 'boolean'],
            'pets_allowed' => ['required', 'boolean'],
            'contact_via_whatsapp' => ['required', 'boolean'],
            'contact_via_phone' => ['required', 'boolean'],
            'bathroom_type' => [
                Rule::when($isRoom, ['required', Rule::enum(BathroomType::class)], ['nullable']),
            ],
            'bedrooms' => [
                Rule::when(! $isRoom, ['required', 'integer', 'min:1'], ['nullable']),
            ],
            'bathrooms' => [
                Rule::when(! $isRoom, ['required', 'integer', 'min:1'], ['nullable']),
            ],
            'square_meters' => [
                Rule::when(! $isRoom, ['nullable', 'integer', 'min:1'], ['nullable']),
            ],
            'has_parking' => [
                Rule::when(! $isRoom, ['required', 'boolean'], ['nullable']),
            ],
        ];

        if (blank($this->user()?->phone_number)) {
            $rules['phone_number'] = ['required', 'string', new MexicanPhoneNumber];
        }

        return $rules;
    }

    /**
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
     * @return array<string, mixed>
     */
    public function listingAttributes(): array
    {
        $category = ListingCategory::from($this->validated('category'));

        $attributes = [
            ...$this->safe()->only([
                'title',
                'description',
                'category',
                'rent_amount',
                'zone',
                'street_address',
                'is_furnished',
                'pets_allowed',
                'contact_via_whatsapp',
                'contact_via_phone',
            ]),
            'state' => Listing::DEFAULT_STATE,
            'city' => Listing::DEFAULT_CITY,
        ];

        if ($category === ListingCategory::Room) {
            return [
                ...$attributes,
                'bathroom_type' => $this->validated('bathroom_type'),
                'bedrooms' => null,
                'bathrooms' => null,
                'square_meters' => null,
                'has_parking' => null,
            ];
        }

        return [
            ...$attributes,
            'bathroom_type' => null,
            'bedrooms' => $this->validated('bedrooms'),
            'bathrooms' => $this->validated('bathrooms'),
            'square_meters' => $this->validated('square_meters'),
            'has_parking' => $this->boolean('has_parking'),
        ];
    }

    public function phoneNumberToPersist(): ?string
    {
        if (filled($this->user()?->phone_number)) {
            return null;
        }

        return $this->validated('phone_number');
    }
}
