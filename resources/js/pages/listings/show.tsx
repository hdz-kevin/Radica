import { Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    BathIcon,
    BedSingle,
    Car,
    Droplet,
    Flame,
    MapPinIcon,
    MessageCircle,
    PawPrint,
    Phone,
    ShieldAlert,
    Sofa,
    Tv,
    Wifi,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { show } from '@/actions/App/Http/Controllers/ListingController';
import { ListingActionsMenu } from '@/components/listing-actions-menu';
import { ListingCover } from '@/components/listing-cover';
import { Button } from '@/components/ui/button';
import {
    formatListingAddress,
    formatRent,
    googleMapsUrl,
    telUrl,
    type ListingPermissions,
    type ListingShow,
    type ListingShowImage,
    whatsAppUrl,
} from '@/lib/listing';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { terms } from '@/routes/legal';
import { index as listingsIndex } from '@/routes/listings';
const amenityChips = [
    { name: 'is_furnished', label: 'Amueblado', icon: Sofa },
    { name: 'pets_allowed', label: 'Mascotas permitidas', icon: PawPrint },
    { name: 'has_parking', label: 'Estacionamiento', icon: Car },
    { name: 'include_water', label: 'Agua', icon: Droplet },
    { name: 'include_electricity', label: 'Luz', icon: Zap },
    { name: 'include_gas', label: 'Gas', icon: Flame },
    { name: 'include_internet', label: 'Internet', icon: Wifi },
    { name: 'include_cable', label: 'Cable', icon: Tv },
] as const satisfies ReadonlyArray<{
    name: keyof ListingShow;
    label: string;
    icon: LucideIcon;
}>;

export default function ListingsShow({
    listing,
    can,
    favorited,
}: {
    listing: ListingShow;
    can: ListingPermissions;
    favorited: boolean;
}) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Inicio',
                href: home(),
            },
            {
                title: 'Publicaciones',
                href: listingsIndex(),
            },
            {
                title: listing.title,
                href: show(listing.id),
            },
        ],
    });

    const phoneNumber = listing.phone_number;
    const showWhatsApp = listing.contact_via_whatsapp && phoneNumber !== null;
    const showPhone = listing.contact_via_phone && phoneNumber !== null;
    const includedAmenities = amenityChips.filter((chip) => listing[chip.name]);
    const address = formatListingAddress(
        listing.street_address,
        listing.zone,
        listing.city,
        listing.state,
    );

    return (
        <>
            <Head title={listing.title} />

            <article className="flex flex-col gap-6 lg:mt-4">
                {!listing.is_published && (
                    <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
                        Esta publicación no está visible al público
                    </p>
                )}

                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-11 lg:items-start">
                    <div className="min-w-0 lg:sticky lg:top-4 lg:col-span-5">
                        {listing.images.length > 0 ? (
                            <ListingGallery
                                images={listing.images}
                                title={listing.title}
                            />
                        ) : (
                            <ListingCover
                                url={null}
                                alt=""
                                className="bg-muted min-h-52 rounded-lg border-0 lg:min-h-72"
                            />
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col gap-8 lg:col-span-6">
                        <div className="flex flex-col gap-2.5 lg:gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <h1 className="min-w-0 text-lg font-semibold tracking-tight lg:text-xl">
                                    {listing.title}
                                </h1>
                                <ListingActionsMenu
                                    listing={listing}
                                    can={can}
                                    favorited={favorited}
                                />
                            </div>
                            <p className="text-base font-semibold lg:text-lg">
                                {formatRent(listing.rent_amount)}
                                <span className="text-base font-normal lg:text-lg">
                                    {' '}
                                    / mes
                                </span>
                            </p>
                            <a
                                href={googleMapsUrl(address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Abrir ${address} en Google Maps`}
                                className="focus-visible:ring-ring inline-flex w-fit items-center gap-2 rounded-sm text-sm underline focus-visible:ring-2 focus-visible:outline-none lg:text-base"
                            >
                                <MapPinIcon className="size-4 shrink-0 lg:size-5" />
                                {address}
                            </a>
                        </div>

                        <p className="text-sm leading-7 whitespace-pre-wrap lg:text-base lg:leading-8">
                            {listing.description}
                        </p>

                        {listing.category !== 'room' &&
                            (listing.bedrooms !== null ||
                                listing.bathrooms !== null) && (
                                <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm lg:text-base">
                                    {listing.bedrooms !== null && (
                                        <span className="inline-flex items-center gap-2">
                                            <BedSingle className="size-4 lg:size-5" />
                                            {countLabel(
                                                listing.bedrooms,
                                                'recámara',
                                                'recámaras',
                                            )}
                                        </span>
                                    )}
                                    {listing.bathrooms !== null && (
                                        <span className="inline-flex items-center gap-2">
                                            <BathIcon className="size-4 lg:size-5" />
                                            {countLabel(
                                                listing.bathrooms,
                                                'baño',
                                                'baños',
                                            )}
                                        </span>
                                    )}
                                </p>
                            )}

                        {includedAmenities.length > 0 && (
                            <section className="grid gap-3">
                                <h2 className="text-sm font-medium lg:text-base">
                                    Amenidades y servicios
                                </h2>
                                <ul className="flex flex-wrap gap-3">
                                    {includedAmenities.map((chip) => (
                                        <li key={chip.name}>
                                            <AmenityChip
                                                label={chip.label}
                                                icon={chip.icon}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {(showWhatsApp || showPhone) && (
                            <section className="grid gap-3">
                                <h2 className="text-sm font-medium lg:text-base">
                                    Contactar
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {showPhone && phoneNumber ? (
                                        <Button
                                            asChild
                                            className="w-full rounded-md sm:w-auto"
                                        >
                                            <a href={telUrl(phoneNumber)}>
                                                <Phone className="size-5" />
                                                Llamar
                                            </a>
                                        </Button>
                                    ) : null}
                                    {showWhatsApp && phoneNumber ? (
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="w-full rounded-md sm:w-auto"
                                        >
                                            <a
                                                href={whatsAppUrl(phoneNumber)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="size-5" />
                                                WhatsApp
                                            </a>
                                        </Button>
                                    ) : null}
                                </div>
                                <p className="text-muted-foreground flex gap-2 rounded-md border px-3 py-2 text-xs lg:mt-0.5 lg:text-sm">
                                    <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                                    <span>
                                        Recomendamos no depositar dinero antes
                                        de conocer el inmueble.{' '}
                                        <Link
                                            href={terms()}
                                            className="underline underline-offset-4"
                                        >
                                            Consejos de seguridad
                                        </Link>
                                    </span>
                                </p>
                            </section>
                        )}
                    </div>
                </div>
            </article>
        </>
    );
}

function ListingGallery({
    images,
    title,
}: {
    images: ListingShowImage[];
    title: string;
}) {
    const coverIndex = Math.max(
        0,
        images.findIndex((image) => image.is_cover),
    );
    const [activeIndex, setActiveIndex] = useState(coverIndex);
    const active = images[activeIndex] ?? images[0];

    return (
        <div className="grid gap-3">
            <div className="bg-muted overflow-hidden rounded-lg">
                <img
                    src={active.url}
                    alt={title}
                    className="aspect-video min-h-56 w-full object-cover lg:min-h-72"
                />
            </div>
            {images.length > 1 ? (
                <ul className="grid grid-cols-5 gap-2 lg:grid-cols-6">
                    {images.map((image, index) => (
                        <li key={image.id}>
                            <button
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                aria-label={
                                    image.is_cover
                                        ? 'Portada'
                                        : 'Seleccionar foto'
                                }
                                aria-current={
                                    index === activeIndex ? 'true' : undefined
                                }
                                className={cn(
                                    'overflow-hidden rounded-md border',
                                    index === activeIndex &&
                                        'ring-2 ring-gray-500',
                                )}
                            >
                                <img
                                    src={image.url}
                                    alt=""
                                    className="size-17 object-cover lg:size-20"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

function AmenityChip({
    label,
    icon: Icon,
}: {
    label: string;
    icon: LucideIcon;
}) {
    return (
        <span className="bg-muted/40 inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium lg:h-10 lg:px-4 lg:text-base">
            <Icon className="size-4" />
            {label}
        </span>
    );
}

function countLabel(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

ListingsShow.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Publicaciones',
            href: listingsIndex(),
        },
    ],
};
