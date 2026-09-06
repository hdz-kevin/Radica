<?php

namespace App\Models;

use App\Enums\ListingCategory;
use Database\Factories\ListingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property ListingCategory $category
 * @property string $title
 * @property string $description
 * @property int $rent_amount
 * @property bool $is_furnished
 * @property bool $pets_allowed
 * @property int|null $bedrooms
 * @property int|null $bathrooms
 * @property bool $has_parking
 * @property bool $include_water
 * @property bool $include_electricity
 * @property bool $include_gas
 * @property bool $include_internet
 * @property bool $include_cable
 * @property string $state
 * @property string $city
 * @property string $zone
 * @property string|null $street_address
 * @property bool $contact_via_whatsapp
 * @property bool $contact_via_phone
 * @property bool $is_published
 * @property Carbon $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read User $user
 */
#[Fillable([
    'category',
    'title',
    'description',
    'rent_amount',
    'is_furnished',
    'pets_allowed',
    'bedrooms',
    'bathrooms',
    'has_parking',
    'include_water',
    'include_electricity',
    'include_gas',
    'include_internet',
    'include_cable',
    'state',
    'city',
    'zone',
    'street_address',
    'contact_via_whatsapp',
    'contact_via_phone',
    'published_at',
])]
class Listing extends Model
{
    public const DEFAULT_STATE = 'Puebla';

    public const DEFAULT_CITY = 'Teziutlán';

    /** @use HasFactory<ListingFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_furnished' => false,
        'pets_allowed' => false,
        'has_parking' => false,
        'include_water' => false,
        'include_electricity' => false,
        'include_gas' => false,
        'include_internet' => false,
        'include_cable' => false,
        'contact_via_whatsapp' => true,
        'contact_via_phone' => true,
        'is_published' => true,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category' => ListingCategory::class,
            'is_furnished' => 'boolean',
            'pets_allowed' => 'boolean',
            'has_parking' => 'boolean',
            'include_water' => 'boolean',
            'include_electricity' => 'boolean',
            'include_gas' => 'boolean',
            'include_internet' => 'boolean',
            'include_cable' => 'boolean',
            'contact_via_whatsapp' => 'boolean',
            'contact_via_phone' => 'boolean',
            'is_published' => 'boolean',
            'rent_amount' => 'integer',
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /**
     * The user who owns the listing.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Only include published listings.
     *
     * @param  Builder<Listing>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * Whether the listing is published.
     */
    public function isPublished(): bool
    {
        return $this->is_published;
    }

    /**
     * Make the listing visible in the catalog and bump its sort date.
     */
    public function publish(): void
    {
        $this->is_published = true;
        $this->published_at = now();
        $this->save();
    }

    /**
     * Hide the listing from the catalog without clearing published_at.
     */
    public function unpublish(): void
    {
        $this->is_published = false;
        $this->save();
    }
}
