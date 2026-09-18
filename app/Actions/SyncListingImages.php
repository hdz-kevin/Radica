<?php

namespace App\Actions;

use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class SyncListingImages
{
    public const NEW_SLOT = 'new';

    /**
     * Sync the listing's images to match the given display order.
     *
     * Each order item is an existing image id or the NEW_SLOT sentinel, which consumes the next uploaded file.
     * An empty order (create) treats every uploaded file as a new slot in the given file order.
     *
     * @param  list<UploadedFile>  $newFiles
     * @param  list<int|string>  $order
     */
    public function handle(Listing $listing, array $newFiles, array $order = []): void
    {
        $newFiles = array_values($newFiles);

        if ($order === []) {
            $order = array_fill(0, count($newFiles), self::NEW_SLOT);
        }

        /** @var Collection<int, ListingImage> $existing */
        $existing = $listing->images()->orderBy('position')->orderBy('id')->get();
        $existingById = $existing->keyBy('id');

        $keptIds = [];

        foreach ($order as $item) {
            if ($item === self::NEW_SLOT) {
                continue;
            }

            $keptIds[] = (int) $item;
        }

        foreach ($existing as $image) {
            if (in_array($image->id, $keptIds, true)) {
                continue;
            }

            Storage::disk($image->disk)->delete($image->path);
            $image->delete();
        }

        // Move kept rows off the unique (listing_id, position) range before reassigning order.
        $positionShift = ListingImage::MAX_PER_LISTING + 1;

        foreach ($keptIds as $keptId) {
            $kept = $existingById->get($keptId);

            if (! $kept instanceof ListingImage) {
                throw new RuntimeException('Missing kept listing image.');
            }

            $kept->position = $kept->position + $positionShift;
            $kept->is_cover = false;
            $kept->save();
        }

        $nextNew = 0;

        collect($order)->each(function (int|string $item, int $index) use ($listing, $newFiles, $existingById, &$nextNew): void {
            if ($item === self::NEW_SLOT) {
                $file = $newFiles[$nextNew] ?? null;
                $nextNew++;

                if (! $file instanceof UploadedFile) {
                    throw new RuntimeException('Missing uploaded image for order slot.');
                }

                $path = $file->store('listings/'.$listing->id, ListingImage::DISK);

                if (! is_string($path)) {
                    throw new RuntimeException('Unable to store listing image.');
                }

                $image = $listing->images()->make([
                    'path' => $path,
                    'disk' => ListingImage::DISK,
                ]);
            } else {
                $image = $existingById->get((int) $item);

                if (! $image instanceof ListingImage) {
                    throw new RuntimeException('Missing kept listing image.');
                }
            }

            $image->position = $index;
            $image->is_cover = $index === 0;
            $image->save();
        });
    }
}
