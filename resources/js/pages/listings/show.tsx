import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    Bath,
    Bed,
    Car,
    Droplet,
    EllipsisVertical,
    Flame,
    MapPin,
    MessageCircle,
    PawPrint,
    Phone,
    Sofa,
    Tv,
    Wifi,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
    destroy,
    edit,
    publish,
    show,
    unpublish,
} from '@/actions/App/Http/Controllers/ListingController';
import { ListingCover } from '@/components/listing-cover';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    formatListingAddress,
    formatRent,
    telUrl,
    type ListingPermissions,
    type ListingShow,
    type ListingShowImage,
    whatsAppUrl,
} from '@/lib/listing';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

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
}: {
    listing: ListingShow;
    can: ListingPermissions;
}) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Inicio',
                href: home(),
            },
            {
                title: listing.title,
                href: show(listing.id),
            },
        ],
    });

    const phoneNumber = listing.user.phone_number;
    const showWhatsApp = listing.contact_via_whatsapp && phoneNumber !== null;
    const showPhone = listing.contact_via_phone && phoneNumber !== null;
    const includedAmenities = amenityChips.filter((chip) => listing[chip.name]);
    const showOwnerActions = can.update || can.delete || can.publish;

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
                                className="min-h-52 rounded-lg border-0 bg-muted lg:min-h-72"
                            />
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col gap-8 lg:col-span-6">
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between gap-2">
                                <h1 className="min-w-0 text-xl font-semibold tracking-tight lg:text-2xl">
                                    {listing.title}
                                </h1>
                                {showOwnerActions ? (
                                    <ListingOwnerMenu listing={listing} can={can} />
                                ) : null}
                            </div>
                            <p className="text-lg font-semibold lg:text-xl">
                                {formatRent(listing.rent_amount)}
                                <span className="text-lg font-normal">
                                    {' '}
                                    / mes
                                </span>
                            </p>
                            <p className="inline-flex items-center gap-2 text-base lg:text-[17px]">
                                <MapPin className="size-4 shrink-0 lg:size-5" />
                                {formatListingAddress(
                                    listing.street_address,
                                    listing.zone,
                                    listing.city,
                                    listing.state
                                )}
                            </p>
                        </div>

                        <p className="whitespace-pre-wrap text-base leading-7 lg:text-[17px]">
                            {listing.description}
                        </p>

                        {listing.category !== 'room' &&
                            (listing.bedrooms !== null || listing.bathrooms !== null) && (
                                <p className="flex flex-wrap gap-x-4 gap-y-1 text-base lg:text-[17px]">
                                    {listing.bedrooms !== null && (
                                        <span className="inline-flex items-center gap-2">
                                            <Bed className="size-5" />
                                            {countLabel(
                                                listing.bedrooms,
                                                'recámara',
                                                'recámaras',
                                            )}
                                        </span>
                                    )}
                                    {listing.bathrooms !== null && (
                                        <span className="inline-flex items-center gap-2">
                                            <Bath className="size-5" />
                                            {countLabel(listing.bathrooms, 'baño', 'baños')}
                                        </span>
                                    )}
                                </p>
                            )}

                        {includedAmenities.length > 0 && (
                            <section className="grid gap-3">
                                <h2 className="text-sm lg:text-base font-medium">
                                    Amenidades y servicios
                                </h2>
                                <ul className="flex flex-wrap gap-2.5">
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
                            <section className='grid gap-3'>
                                <h2 className="text-sm lg:text-base font-medium">
                                    Contacto
                                </h2>
                                <div className="flex flex-wrap gap-2.5">
                                    {showPhone && phoneNumber ? (
                                        <Button
                                            asChild
                                            size="lg"
                                            className="w-full rounded-md sm:w-auto"
                                        >
                                            <a href={telUrl(phoneNumber)}>
                                                <Phone className='size-5' />
                                                Llamar
                                            </a>
                                        </Button>
                                    ) : null}
                                    {showWhatsApp && phoneNumber ? (
                                        <Button
                                            variant="outline"
                                            asChild
                                            size="lg"
                                            className="w-full rounded-md sm:w-auto"
                                        >
                                            <a
                                                href={whatsAppUrl(phoneNumber)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className='size-5' />
                                                WhatsApp
                                            </a>
                                        </Button>
                                    ) : null}
                                </div>

                            </section>
                        )}
                    </div>
                </div>
            </article>
        </>
    );
}

function ListingOwnerMenu({
    listing,
    can,
}: {
    listing: ListingShow;
    can: ListingPermissions;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 lg:size-10 shrink-0"
                    aria-label="Opciones de la publicación"
                >
                    <EllipsisVertical className="size-4 lg:size-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {can.update && (
                    <DropdownMenuItem asChild>
                        <Link href={edit(listing.id)}>Editar</Link>
                    </DropdownMenuItem>
                )}
                {can.publish &&
                    (listing.is_published ? (
                        <Form {...unpublish.form(listing.id)}>
                            {({ processing }) => (
                                <DropdownMenuItem asChild className="w-full" disabled={processing}>
                                    <button type="submit" disabled={processing}>
                                        Ocultar
                                    </button>
                                </DropdownMenuItem>
                            )}
                        </Form>
                    ) : (
                        <Form {...publish.form(listing.id)}>
                            {({ processing }) => (
                                <DropdownMenuItem asChild className="w-full" disabled={processing}>
                                    <button type="submit" disabled={processing}>
                                        Publicar
                                    </button>
                                </DropdownMenuItem>
                            )}
                        </Form>
                    ))}
                {can.delete && (
                    <Form
                        {...destroy.form(listing.id)}
                        onBefore={() =>
                            confirm('¿Borrar esta publicación? No se puede deshacer.')
                        }
                    >
                        {({ processing }) => (
                            <DropdownMenuItem
                                className="w-full"
                                variant="destructive"
                                asChild
                                disabled={processing}
                            >
                                <button type="submit" disabled={processing}>
                                    Eliminar
                                </button>
                            </DropdownMenuItem>
                        )}
                    </Form>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
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
            <div className="overflow-hidden rounded-lg bg-muted">
                <img
                    src={active.url}
                    alt={title}
                    className="aspect-video w-full min-h-52 object-cover lg:min-h-72"
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
                                    image.is_cover ? 'Portada' : 'Seleccionar foto'
                                }
                                aria-current={index === activeIndex ? 'true' : undefined}
                                className={cn(
                                    'overflow-hidden rounded-md border',
                                    index === activeIndex && 'ring-2 ring-gray-500',
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

function AmenityChip({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
    return (
        <span className="border-gray-200 inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm lg:text-base font-medium">
            <Icon className="size-5" />
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
            title: 'Publicación',
            href: home(),
        },
    ],
};
