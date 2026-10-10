<?php

namespace App\Models;

use App\Rules\MexicanPhoneNumber;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone_number
 * @property Carbon|null $email_verified_at
 * @property string|null $password
 * @property string|null $google_id
 * @property Carbon|null $terms_accepted_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Listing> $listings
 */
#[Fillable(['name', 'email', 'password', 'phone_number', 'google_id'])]
#[Hidden(['password', 'google_id', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The listings FK cascade skips Listing::deleting, which removes the photo
     * files, so listings are force deleted through Eloquent first.
     */
    protected static function booted(): void
    {
        static::deleting(function (User $user): void {
            $user->listings()->withTrashed()->each(fn (Listing $listing): ?bool => $listing->forceDelete());
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'terms_accepted_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Listing, $this>
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Listings this user saved to view later.
     *
     * @return BelongsToMany<Listing, $this>
     */
    public function favoritedListings(): BelongsToMany
    {
        return $this->belongsToMany(Listing::class, 'listing_favorites')->withTimestamps();
    }

    /**
     * Persist the 10 national digits with the WhatsApp prefix.
     */
    protected function phoneNumber(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value): ?string => MexicanPhoneNumber::forStorage($value),
        );
    }

    /**
     * Whether the user has a contact phone number.
     */
    public function hasPhone(): bool
    {
        return filled($this->phone_number);
    }

    /**
     * Whether the user can sign in with a local password.
     */
    public function hasPassword(): bool
    {
        return filled($this->password);
    }
}
