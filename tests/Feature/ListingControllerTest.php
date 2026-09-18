<?php

use App\Enums\ListingCategory;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function listingImage(string $name = 'cover.jpg'): UploadedFile
{
    return UploadedFile::fake()->image($name);
}

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function listingPayload(array $overrides = []): array
{
    return [
        'title' => 'Departamento en el centro',
        'description' => 'Departamento iluminado cerca del parque.',
        'category' => ListingCategory::Apartment->value,
        'rent_amount' => 8000,
        'zone' => 'Centro',
        'street_address' => null,
        'is_furnished' => false,
        'pets_allowed' => false,
        'bedrooms' => 2,
        'bathrooms' => 1,
        'has_parking' => true,
        'include_water' => false,
        'include_electricity' => false,
        'include_gas' => false,
        'include_internet' => false,
        'include_cable' => false,
        'contact_via_whatsapp' => true,
        'contact_via_phone' => true,
        'images' => [listingImage()],
        'image_order' => ['new'],
        ...$overrides,
    ];
}

describe('index', function () {
    test('renders published listings for a guest', function () {
        $published = Listing::factory()->create();
        Listing::factory()->unpublished()->create();
        Listing::factory()->trashed()->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $published->id)
                ->where('listings.0.zone', $published->zone)
                ->where('listings.0.cover_url', null)
                ->missing('listings.0.description')
                ->where('filters.zone', '')
                ->where('filters.category', null)
            );
    });

    test('lists published listings newest first', function () {
        $this->freezeTime();

        $older = Listing::factory()->create([
            'published_at' => now()->subDay(),
        ]);
        $newer = Listing::factory()->create([
            'published_at' => now(),
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->where('listings.0.id', $newer->id)
                ->where('listings.1.id', $older->id)
            );
    });

    test('filters published listings by a zone substring', function () {
        $centro = Listing::factory()->create(['zone' => 'Centro']);
        Listing::factory()->create(['zone' => 'El Carmen']);
        Listing::factory()->unpublished()->create(['zone' => 'Centro']);
        Listing::factory()->trashed()->create(['zone' => 'Centro']);

        $this->get(route('home', ['zone' => 'Centro']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $centro->id)
                ->where('filters.zone', 'Centro')
                ->where('filters.category', null)
            );
    });

    test('filters zones without regard to letter case', function () {
        $centro = Listing::factory()->create(['zone' => 'Centro']);
        Listing::factory()->create(['zone' => 'El Carmen']);

        $this->get(route('home', ['zone' => 'centro']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $centro->id)
                ->where('filters.zone', 'centro')
            );
    });

    test('filters zones without regard to spaces', function () {
        $carmen = Listing::factory()->create(['zone' => 'El Carmen']);
        Listing::factory()->create(['zone' => 'Centro']);

        $this->get(route('home', ['zone' => 'elcarmen']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $carmen->id)
                ->where('filters.zone', 'elcarmen')
            );
    });

    test('an empty zone query returns the full published catalog', function (string $zone) {
        Listing::factory()->create(['zone' => 'Centro']);
        Listing::factory()->create(['zone' => 'El Carmen']);

        $this->get(route('home', ['zone' => $zone]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 2)
                ->where('filters.zone', '')
            );
    })->with([
        'empty' => [''],
        'whitespace' => ['   '],
    ]);

    test('filters published listings by category', function () {
        $room = Listing::factory()->room()->create();
        Listing::factory()->apartment()->create();

        $this->get(route('home', ['category' => 'room']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $room->id)
                ->where('filters.category', 'room')
                ->where('filters.zone', '')
            );
    });

    test('applies zone and category filters together', function () {
        $match = Listing::factory()->apartment()->create(['zone' => 'Centro']);
        Listing::factory()->room()->create(['zone' => 'Centro']);
        Listing::factory()->apartment()->create(['zone' => 'El Carmen']);

        $this->get(route('home', ['zone' => 'Centro', 'category' => 'apartment']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 1)
                ->where('listings.0.id', $match->id)
                ->where('filters.zone', 'Centro')
                ->where('filters.category', 'apartment')
            );
    });

    test('treats like wildcards in the zone query as literals', function () {
        Listing::factory()->create(['zone' => 'Centro']);

        $this->get(route('home', ['zone' => '%']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 0)
                ->where('filters.zone', '%')
            );
    });

    test('ignores an unknown category query and lists published listings', function () {
        Listing::factory()->room()->create();
        Listing::factory()->apartment()->create();

        $this->get(route('home', ['category' => 'nope']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 2)
                ->where('filters.category', null)
                ->where('filters.zone', '')
            );
    });

    test('renders an empty catalog when the filters match nothing', function () {
        Listing::factory()->create(['zone' => 'Centro']);

        $this->get(route('home', ['zone' => 'Xoloco']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->has('listings', 0)
                ->where('filters.zone', 'Xoloco')
                ->where('filters.category', null)
            );
    });
});

describe('show', function () {
    test('renders a published listing for a guest', function () {
        $owner = User::factory()->withPhone()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/show')
                ->where('listing.id', $listing->id)
                ->where('listing.zone', $listing->zone)
                ->where('listing.user.phone_number', $owner->phone_number)
                ->missing('listing.user.email')
                ->has('listing.images', 0)
                ->missing('listing.bathroom_type')
                ->missing('listing.square_meters')
                ->where('listing.has_parking', $listing->has_parking)
                ->where('listing.include_water', $listing->include_water)
                ->where('can.update', false)
                ->where('can.delete', false)
                ->where('can.publish', false)
            );
    });

    test('returns 404 when a guest visits an unpublished listing', function () {
        $listing = Listing::factory()->unpublished()->create();

        $this->get(route('listings.show', $listing))->assertNotFound();
    });

    test('returns 404 when a guest visits a deleted listing', function () {
        $listing = Listing::factory()->trashed()->create();

        $this->get(route('listings.show', $listing))->assertNotFound();
    });

    test('returns 404 when another user visits an unpublished listing', function () {
        $listing = Listing::factory()->unpublished()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('listings.show', $listing))
            ->assertNotFound();
    });

    test('renders an unpublished listing for the owner', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->unpublished()->create();

        $this->actingAs($owner)
            ->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/show')
                ->where('listing.id', $listing->id)
                ->where('listing.is_published', false)
                ->where('can.update', true)
                ->where('can.delete', true)
                ->where('can.publish', true)
            );
    });
});

describe('create', function () {
    test('redirects guests to login', function () {
        $this->get(route('listings.create'))
            ->assertRedirect(route('login'));
    });

    test('renders the create form with default location', function () {
        $this->actingAs(User::factory()->create())
            ->get(route('listings.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/create')
                ->where('defaults.state', Listing::DEFAULT_STATE)
                ->where('defaults.city', Listing::DEFAULT_CITY)
            );
    });
});

describe('store', function () {
    beforeEach(function () {
        Storage::fake(ListingImage::DISK);
    });

    test('redirects guests to login', function () {
        $this->post(route('listings.store'), listingPayload())
            ->assertRedirect(route('login'));
    });

    test('creates a published listing', function () {
        $user = User::factory()->withPhone()->create();

        $this->actingAs($user)
            ->post(route('listings.store'), listingPayload())
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $listing = $user->listings()->first();

        expect($listing)
            ->not->toBeNull()
            ->title->toBe('Departamento en el centro')
            ->is_published->toBeTrue()
            ->state->toBe(Listing::DEFAULT_STATE)
            ->city->toBe(Listing::DEFAULT_CITY)
            ->zone->toBe('Centro');
        expect($user->fresh()->phone_number)->toBe('5215512345678');

        $this->assertAuthenticated();
        $this->get(route('listings.show', $listing))->assertOk();
    });

    test('does not create a listing when the user has no phone', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('listings.create'))
            ->post(route('listings.store'), listingPayload())
            ->assertRedirect(route('listings.create'))
            ->assertSessionHasErrors('phone_number');

        expect($user->listings()->count())->toBe(0);
        expect($user->fresh()->phone_number)->toBeNull();
    });

    test('rejects a listing without a zone or a contact channel', function () {
        $user = User::factory()->withPhone()->create();

        $this->actingAs($user)
            ->from(route('listings.create'))
            ->post(route('listings.store'), listingPayload([
                'zone' => '',
                'contact_via_whatsapp' => false,
                'contact_via_phone' => false,
            ]))
            ->assertRedirect(route('listings.create'))
            ->assertSessionHasErrors(['zone', 'contact_via_whatsapp']);

        expect($user->listings()->count())->toBe(0);
    });

    test('creates a room without bedrooms or bathrooms and requires bedrooms for an apartment', function () {
        $user = User::factory()->withPhone()->create();

        $this->actingAs($user)
            ->post(route('listings.store'), listingPayload([
                'category' => ListingCategory::Room->value,
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        expect($user->listings()->first())
            ->category->toBe(ListingCategory::Room)
            ->bedrooms->toBeNull()
            ->bathrooms->toBeNull()
            ->has_parking->toBeTrue();

        $this->actingAs($user)
            ->from(route('listings.create'))
            ->post(route('listings.store'), listingPayload([
                'bedrooms' => null,
            ]))
            ->assertRedirect(route('listings.create'))
            ->assertSessionHasErrors('bedrooms');
    });

    test('persists included utilities', function () {
        $user = User::factory()->withPhone()->create();

        $this->actingAs($user)
            ->post(route('listings.store'), listingPayload([
                'include_water' => true,
                'include_electricity' => true,
                'include_internet' => true,
            ]))
            ->assertSessionHasNoErrors();

        expect($user->listings()->first())
            ->include_water->toBeTrue()
            ->include_electricity->toBeTrue()
            ->include_gas->toBeFalse()
            ->include_internet->toBeTrue()
            ->include_cable->toBeFalse();
    });

    test('ignores client-supplied state, city, and published flags', function () {
        $user = User::factory()->withPhone()->create();

        $this->actingAs($user)
            ->post(route('listings.store'), listingPayload([
                'state' => 'Jalisco',
                'city' => 'Guadalajara',
                'is_published' => false,
            ]))
            ->assertSessionHasNoErrors();

        $listing = $user->listings()->first();

        expect($listing)
            ->state->toBe(Listing::DEFAULT_STATE)
            ->city->toBe(Listing::DEFAULT_CITY)
            ->is_published->toBeTrue();
    });

    test('rejects a listing without photos', function () {
        $user = User::factory()->withPhone()->create();

        $this->actingAs($user)
            ->from(route('listings.create'))
            ->post(route('listings.store'), listingPayload([
                'images' => [],
            ]))
            ->assertRedirect(route('listings.create'))
            ->assertSessionHasErrors('images');

        expect($user->listings()->count())->toBe(0);
    });

    test('stores one photo and exposes its url on the card and show page', function () {
        $user = User::factory()->withPhone()->create();
        $file = listingImage('sala.jpg');

        $this->actingAs($user)
            ->post(route('listings.store'), listingPayload([
                'images' => [$file],
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $listing = $user->listings()->first();
        $image = $listing->images()->first();

        expect($image)
            ->not->toBeNull()
            ->position->toBe(0)
            ->is_cover->toBeTrue();

        Storage::disk(ListingImage::DISK)->assertExists($image->path);

        $this->get(route('listings.show', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/show')
                ->has('listing.images', 1)
                ->where('listing.images.0.is_cover', true)
                ->where('listing.images.0.url', $image->url())
            );

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/index')
                ->where('listings.0.cover_url', $image->url())
            );
    });

    test('rejects a listing with more than 15 photos', function () {
        $user = User::factory()->withPhone()->create();
        $images = [];

        for ($i = 1; $i <= ListingImage::MAX_PER_LISTING + 1; $i++) {
            $images[] = listingImage("photo-{$i}.jpg");
        }

        $this->actingAs($user)
            ->from(route('listings.create'))
            ->post(route('listings.store'), listingPayload([
                'images' => $images,
            ]))
            ->assertRedirect(route('listings.create'))
            ->assertSessionHasErrors('images');

        expect($user->listings()->count())->toBe(0);
    });

    test('rejects a photo larger than 10 MB', function () {
        $user = User::factory()->withPhone()->create();
        $file = listingImage('grande.jpg')->size(ListingImage::MAX_FILE_KILOBYTES + 1);

        $this->actingAs($user)
            ->from(route('listings.create'))
            ->post(route('listings.store'), listingPayload([
                'images' => [$file],
            ]))
            ->assertRedirect(route('listings.create'))
            ->assertSessionHasErrors('images.0');

        expect($user->listings()->count())->toBe(0);
    });
});

describe('mine', function () {
    test('redirects guests to login', function () {
        $this->get(route('listings.mine'))
            ->assertRedirect(route('login'));
    });

    test('lists only the authenticated user listings including unpublished ones', function () {
        $owner = User::factory()->create();
        $minePublished = Listing::factory()->for($owner)->create();
        $mineUnpublished = Listing::factory()->for($owner)->unpublished()->create();
        Listing::factory()->for($owner)->trashed()->create();
        Listing::factory()->create();

        $this->actingAs($owner)
            ->get(route('listings.mine'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/mine')
                ->has('listings', 2)
                ->where('listings.0.id', $mineUnpublished->id)
                ->where('listings.1.id', $minePublished->id)
                ->where('listings.0.is_published', false)
            );
    });
});

describe('edit', function () {
    test('redirects guests to login', function () {
        $listing = Listing::factory()->create();

        $this->get(route('listings.edit', $listing))
            ->assertRedirect(route('login'));
    });

    test('forbids another user from editing a listing', function () {
        $listing = Listing::factory()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('listings.edit', $listing))
            ->assertForbidden();
    });

    test('renders the edit form for the owner', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->actingAs($owner)
            ->get(route('listings.edit', $listing))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('listings/edit')
                ->where('listing.id', $listing->id)
                ->where('listing.title', $listing->title)
                ->has('listing.images', 0)
            );
    });
});

describe('update', function () {
    beforeEach(function () {
        Storage::fake(ListingImage::DISK);
    });

    test('updates a listing for the owner without requiring an existing phone', function () {
        $owner = User::factory()->withPhone()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'title' => 'Departamento renovado',
                'zone' => 'La Trinidad',
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('listings.show', $listing));

        expect($listing->fresh())
            ->title->toBe('Departamento renovado')
            ->zone->toBe('La Trinidad')
            ->state->toBe(Listing::DEFAULT_STATE)
            ->city->toBe(Listing::DEFAULT_CITY);
    });

    test('forbids another user from updating a listing', function () {
        $listing = Listing::factory()->create();

        $this->actingAs(User::factory()->withPhone()->create())
            ->patch(route('listings.update', $listing), listingPayload())
            ->assertForbidden();
    });

    test('clears apartment fields when the listing becomes a room', function () {
        $owner = User::factory()->withPhone()->create();
        $listing = Listing::factory()->for($owner)->apartment()->create([
            'has_parking' => true,
        ]);

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'category' => ListingCategory::Room->value,
            ]))
            ->assertSessionHasNoErrors();

        expect($listing->fresh())
            ->category->toBe(ListingCategory::Room)
            ->bedrooms->toBeNull()
            ->bathrooms->toBeNull()
            ->has_parking->toBeTrue();
    });

    test('updates a listing when the owner has no phone', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'title' => 'Departamento renovado',
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('listings.show', $listing));

        expect($listing->fresh()->title)->toBe('Departamento renovado');
        expect($owner->fresh()->phone_number)->toBeNull();
    });

    test('rejects an update that would leave the listing without photos', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(1)->create();

        $this->actingAs($owner)
            ->from(route('listings.edit', $listing))
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => [],
                'images' => [],
            ]))
            ->assertRedirect(route('listings.edit', $listing))
            ->assertSessionHasErrors([
                'images' => 'La publicación debe tener entre 1 y 15 fotos.',
            ]);

        expect($listing->fresh()->images)->toHaveCount(1);
    });

    test('keeps remaining photos, stores a new one, and recalculates the cover', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(2)->create();
        $existing = $listing->images()->orderBy('position')->get();
        $removed = $existing[0];
        $kept = $existing[1];
        $newFile = listingImage('nueva.jpg');

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => [$kept->id, 'new'],
                'images' => [$newFile],
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('listings.show', $listing));

        $images = $listing->fresh()->images()->orderBy('position')->get();

        expect($images)->toHaveCount(2);
        expect($images[0])
            ->id->toBe($kept->id)
            ->is_cover->toBeTrue()
            ->position->toBe(0);
        expect($images[1])
            ->is_cover->toBeFalse()
            ->position->toBe(1);

        Storage::disk(ListingImage::DISK)->assertMissing($removed->path);
        Storage::disk(ListingImage::DISK)->assertExists($images[1]->path);
        $this->assertDatabaseMissing('listing_images', ['id' => $removed->id]);
    });

    test('rejects image order ids that belong to another listing', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(1)->create();
        $foreignId = Listing::factory()->withImages(1)->create()->images()->first()->id;

        $this->actingAs($owner)
            ->from(route('listings.edit', $listing))
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => [$foreignId],
                'images' => [],
            ]))
            ->assertRedirect(route('listings.edit', $listing))
            ->assertSessionHasErrors('image_order.0');
    });

    test('reorders existing photos and moves the former second to cover', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(2)->create();
        $existing = $listing->images()->orderBy('position')->orderBy('id')->get();

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => [$existing[1]->id, $existing[0]->id],
                'images' => [],
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('listings.show', $listing));

        $images = $listing->fresh()->images()->orderBy('position')->orderBy('id')->get();

        expect($images)->toHaveCount(2);
        expect($images[0])
            ->id->toBe($existing[1]->id)
            ->is_cover->toBeTrue()
            ->position->toBe(0);
        expect($images[1])
            ->id->toBe($existing[0]->id)
            ->is_cover->toBeFalse()
            ->position->toBe(1);
    });

    test('inserts a new photo as cover ahead of kept photos', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(2)->create();
        $existing = $listing->images()->orderBy('position')->orderBy('id')->get();
        $newFile = listingImage('portada.jpg');

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => ['new', $existing[0]->id, $existing[1]->id],
                'images' => [$newFile],
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('listings.show', $listing));

        $images = $listing->fresh()->images()->orderBy('position')->orderBy('id')->get();

        expect($images)->toHaveCount(3);
        expect($images[0])
            ->is_cover->toBeTrue()
            ->position->toBe(0);
        expect($images[1])
            ->id->toBe($existing[0]->id)
            ->is_cover->toBeFalse()
            ->position->toBe(1);
        expect($images[2])
            ->id->toBe($existing[1]->id)
            ->is_cover->toBeFalse()
            ->position->toBe(2);

        Storage::disk(ListingImage::DISK)->assertExists($images[0]->path);
    });

    test('interleaves a new photo between kept photos', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(2)->create();
        $existing = $listing->images()->orderBy('position')->orderBy('id')->get();
        $newFile = listingImage('intercalada.jpg');

        $this->actingAs($owner)
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => [$existing[0]->id, 'new', $existing[1]->id],
                'images' => [$newFile],
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('listings.show', $listing));

        $images = $listing->fresh()->images()->orderBy('position')->orderBy('id')->get();

        expect($images)->toHaveCount(3);
        expect($images[0])
            ->id->toBe($existing[0]->id)
            ->is_cover->toBeTrue()
            ->position->toBe(0);
        expect($images[1])
            ->is_cover->toBeFalse()
            ->position->toBe(1);
        expect($images[2])
            ->id->toBe($existing[1]->id)
            ->is_cover->toBeFalse()
            ->position->toBe(2);

        Storage::disk(ListingImage::DISK)->assertExists($images[1]->path);
    });

    test('rejects an update when new photo slots do not match uploaded files', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(1)->create();
        $keptId = $listing->images()->first()->id;

        $this->actingAs($owner)
            ->from(route('listings.edit', $listing))
            ->patch(route('listings.update', $listing), listingPayload([
                'image_order' => [$keptId, 'new'],
                'images' => [],
            ]))
            ->assertRedirect(route('listings.edit', $listing))
            ->assertSessionHasErrors([
                'images' => 'El número de fotos nuevas no coincide con el orden indicado.',
            ]);

        expect($listing->fresh()->images)->toHaveCount(1);
    });
});

describe('publish', function () {
    test('hides a listing from the catalog without clearing published_at', function () {
        $this->freezeTime();

        $owner = User::factory()->withPhone()->create();
        $listing = Listing::factory()->for($owner)->create([
            'published_at' => now()->subDay(),
        ]);
        $publishedAt = $listing->published_at;

        $this->actingAs($owner)
            ->from(route('listings.show', $listing))
            ->post(route('listings.unpublish', $listing))
            ->assertRedirect(route('listings.show', $listing));

        $listing->refresh();

        expect($listing)
            ->is_published->toBeFalse()
            ->published_at->toEqual($publishedAt);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('listings', 0));

        $this->actingAs($owner)
            ->get(route('listings.show', $listing))
            ->assertOk();
    });

    test('publishes a listing and updates published_at', function () {
        $this->freezeTime();

        $owner = User::factory()->withPhone()->create();
        $listing = Listing::factory()->for($owner)->unpublished()->create([
            'published_at' => now()->subDay(),
        ]);

        $this->actingAs($owner)
            ->from(route('listings.show', $listing))
            ->post(route('listings.publish', $listing))
            ->assertRedirect(route('listings.show', $listing));

        expect($listing->fresh())
            ->is_published->toBeTrue()
            ->published_at->toDateTimeString()->toBe(now()->toDateTimeString());
    });

    test('publishes a listing when the owner has no phone number', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->unpublished()->create();

        $this->actingAs($owner)
            ->from(route('listings.show', $listing))
            ->post(route('listings.publish', $listing))
            ->assertRedirect(route('listings.show', $listing))
            ->assertSessionHasNoErrors();

        expect($listing->fresh()->is_published)->toBeTrue();
    });

    test('forbids another user from publishing a listing', function () {
        $listing = Listing::factory()->unpublished()->create();

        $this->actingAs(User::factory()->withPhone()->create())
            ->post(route('listings.publish', $listing))
            ->assertForbidden();
    });
});

describe('destroy', function () {
    beforeEach(function () {
        Storage::fake(ListingImage::DISK);
    });

    test('soft deletes a listing for the owner', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->actingAs($owner)
            ->delete(route('listings.destroy', $listing))
            ->assertRedirect(route('listings.mine'));

        $this->assertSoftDeleted($listing);

        $this->get(route('listings.show', $listing))->assertNotFound();

        $this->actingAs($owner)
            ->get(route('listings.mine'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('listings', 0));
    });

    test('forbids another user from deleting a listing', function () {
        $listing = Listing::factory()->create();

        $this->actingAs(User::factory()->create())
            ->delete(route('listings.destroy', $listing))
            ->assertForbidden();

        $this->assertNotSoftDeleted($listing);
    });

    test('deletes stored photo files when the listing is deleted', function () {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->withImages(1)->create();
        $path = $listing->images()->first()->path;

        $this->actingAs($owner)
            ->delete(route('listings.destroy', $listing))
            ->assertRedirect(route('listings.mine'));

        $this->assertSoftDeleted($listing);
        $this->assertDatabaseMissing('listing_images', ['listing_id' => $listing->id]);
        Storage::disk(ListingImage::DISK)->assertMissing($path);
    });
});
