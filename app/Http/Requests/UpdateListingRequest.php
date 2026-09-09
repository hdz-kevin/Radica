<?php

namespace App\Http\Requests;

use App\Concerns\ListingValidationRules;
use App\Models\ListingImage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
        $listingId = $this->route('listing')->id;

        return [
            ...$this->listingRules(),
            'kept_image_ids' => ['nullable', 'array', 'max:'.ListingImage::MAX_PER_LISTING],
            'kept_image_ids.*' => [
                'integer',
                'distinct',
                // Check if the image exists in listing_images table and belongs to the listing
                Rule::exists('listing_images', 'id')->where('listing_id', $listingId),
            ],
            'images' => ['nullable', 'array', 'max:'.ListingImage::MAX_PER_LISTING],
            'images.*' => $this->imageFileRules(),
        ];
    }

    /**
     * Require between 1 and 15 photos after keep plus new uploads.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            ...$this->contactChannelRules(),

            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $kept = count(Arr::wrap($this->input('kept_image_ids', [])));
                $total = $kept + count($this->uploadedImages());

                if ($total < 1 || $total > ListingImage::MAX_PER_LISTING) {
                    $validator->errors()->add(
                        'images',
                        'La publicación debe tener entre 1 y 15 fotos.',
                    );
                }
            },
        ];
    }
}
