<?php

namespace App\Models;

use Database\Factories\ListingImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $listing_id
 * @property string $path
 * @property string $disk
 * @property int $position
 * @property bool $is_cover
 * @property-read Listing $listing
 */
#[Fillable(['listing_id', 'path', 'disk', 'position', 'is_cover'])]
class ListingImage extends Model
{
    /** @use HasFactory<ListingImageFactory> */
    use HasFactory;

    public const DISK = 'public';

    public const MAX_PER_LISTING = 15;

    public const MAX_FILE_KILOBYTES = 10240;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'disk' => self::DISK,
        'is_cover' => false,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'is_cover' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Listing, $this>
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Public URL for this image on its disk.
     */
    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }
}
