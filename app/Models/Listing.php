<?php

namespace App\Models;

use App\Enums\BathroomType;
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
 * @property string $currency
 * @property bool $is_furnished
 * @property bool $pets_allowed
 * @property BathroomType|null $bathroom_type
 * @property int|null $bedrooms
 * @property int|null $bathrooms
 * @property int|null $area_m2
 * @property bool|null $has_parking
 * @property string $country
 * @property string $state
 * @property string $city
 * @property string $neighborhood
 * @property string|null $postal_code
 * @property string|null $street_address
 * @property string $latitude
 * @property string $longitude
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
    'currency',
    'is_furnished',
    'pets_allowed',
    'bathroom_type',
    'bedrooms',
    'bathrooms',
    'area_m2',
    'has_parking',
    'country',
    'state',
    'city',
    'neighborhood',
    'postal_code',
    'street_address',
    'latitude',
    'longitude',
    'contact_via_whatsapp',
    'contact_via_phone',
    'published_at',
])]
class Listing extends Model
{
    /** @use HasFactory<ListingFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'currency' => 'MXN',
        'country' => 'MX',
        'is_furnished' => false,
        'pets_allowed' => false,
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
            'bathroom_type' => BathroomType::class,
            'is_furnished' => 'boolean',
            'pets_allowed' => 'boolean',
            'has_parking' => 'boolean',
            'contact_via_whatsapp' => 'boolean',
            'contact_via_phone' => 'boolean',
            'is_published' => 'boolean',
            'rent_amount' => 'integer',
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
            'area_m2' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Public catalog: published and not soft-deleted.
     *
     * @param  Builder<Listing>  $query
     */
    #[Scope]
    protected function visibleInCatalog(Builder $query): void
    {
        $query->where('is_published', true);
    }
}
