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
    /**
     * Sync the listing's images including the kept rows plus the newly uploaded files.
     *
     * @param  list<UploadedFile>  $newFiles
     * @param  list<int|string>  $keptImageIds
     */
    public function handle(Listing $listing, array $newFiles, array $keptImageIds = []): void
    {
        $keptImageIds = array_map(intval(...), $keptImageIds);
        /** @var Collection<int, ListingImage> */
        $existing = $listing->images()->orderBy('position')->get();

        // Delete the images that are in the database but not in the keptImageIds array
        foreach ($existing as $image) {
            if (in_array($image->id, $keptImageIds, true)) {
                continue;
            }

            Storage::disk($image->disk)->delete($image->path);
            $image->delete();
        }

        // Get the ListingImage models that are to be kept
        $kept = $existing
            ->filter(fn (ListingImage $image): bool => in_array($image->id, $keptImageIds, true))
            ->values();

        // Store image files and prepare ListingImage model instances to be saved
        $created = collect($newFiles)->map(function (UploadedFile $file) use ($listing): ListingImage {
            $path = $file->store('listings/'.$listing->id, ListingImage::DISK);

            if (! is_string($path)) {
                throw new RuntimeException('Unable to store listing image.');
            }

            return $listing->images()->make([
                'path' => $path,
                'disk' => ListingImage::DISK,
            ]);
        });

        // Save all ListingImage models to the database
        $kept->concat($created)->values()->each(function (ListingImage $image, int $index): void {
            $image->position = $index;
            $image->is_cover = $index === 0;
            $image->save();
        });
    }
}
