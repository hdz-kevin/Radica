<?php

namespace App\Http\Requests;

use App\Actions\SyncListingImages;
use App\Concerns\ListingValidationRules;
use App\Models\ListingImage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
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
        return [
            ...$this->listingRules(),
            'image_order' => ['nullable', 'array', 'max:'.ListingImage::MAX_PER_LISTING],
            'image_order.*' => ['required'],
            'images' => ['nullable', 'array', 'max:'.ListingImage::MAX_PER_LISTING],
            'images.*' => $this->imageFileRules(),
        ];
    }

    /**
     * Display order of kept image ids and new-file sentinels.
     *
     * @return list<int|string>
     */
    public function imageOrder(): array
    {
        $order = [];

        foreach (Arr::wrap($this->input('image_order', [])) as $item) {
            if ($item === SyncListingImages::NEW_SLOT) {
                $order[] = SyncListingImages::NEW_SLOT;

                continue;
            }

            $order[] = (int) $item;
        }

        return $order;
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

                $rawOrder = array_values(Arr::wrap($this->input('image_order', [])));
                $listingId = $this->route('listing')->id;
                $keptIds = [];
                $newCount = 0;

                foreach ($rawOrder as $index => $item) {
                    if ($item === SyncListingImages::NEW_SLOT) {
                        $newCount++;

                        continue;
                    }

                    if (! is_numeric($item) || (int) $item < 1 || (string) (int) $item !== (string) $item) {
                        $validator->errors()->add(
                            "image_order.{$index}",
                            'Cada posición debe ser una foto existente o una foto nueva.',
                        );

                        continue;
                    }

                    $id = (int) $item;

                    if (in_array($id, $keptIds, true)) {
                        $validator->errors()->add(
                            "image_order.{$index}",
                            'No puedes repetir la misma foto en el orden.',
                        );

                        continue;
                    }

                    $keptIds[] = $id;
                }

                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $ownedIds = ListingImage::query()
                    ->where('listing_id', $listingId)
                    ->whereIn('id', $keptIds)
                    ->pluck('id')
                    ->all();

                foreach ($rawOrder as $index => $item) {
                    if ($item === SyncListingImages::NEW_SLOT) {
                        continue;
                    }

                    if (! in_array((int) $item, $ownedIds, true)) {
                        $validator->errors()->add(
                            "image_order.{$index}",
                            'La foto seleccionada no pertenece a esta publicación.',
                        );
                    }
                }

                $total = count($rawOrder);

                if ($total < 1 || $total > ListingImage::MAX_PER_LISTING) {
                    $validator->errors()->add(
                        'images',
                        'La publicación debe tener entre 1 y 15 fotos.',
                    );

                    return;
                }

                if ($newCount !== count($this->uploadedImages())) {
                    $validator->errors()->add(
                        'images',
                        'El número de fotos nuevas no coincide con el orden indicado.',
                    );
                }
            },
        ];
    }
}
