import { Form, Link } from '@inertiajs/react';
import { EllipsisVertical, Eye, EyeOff, MapPinIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import {
    destroy,
    edit,
    publish,
    show,
    unpublish,
} from '@/actions/App/Http/Controllers/ListingController';
import { FavoriteButton } from '@/components/favorite-button';
import { ListingCover } from '@/components/listing-cover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    categoryLabel,
    formatListingAddress,
    formatRent,
    googleMapsUrl,
    type ListingCard as ListingCardData,
    type ListingMine,
} from '@/lib/listing';
import { cn } from '@/lib/utils';

const overlayBadgeClassName =
    'border-border/70 bg-background text-foreground shadow-sm';

const cardClassName =
    'h-full gap-0 overflow-hidden p-0 pb-0 shadow-sm transition-colors hover:bg-accent/40';

type ListingCardProps =
    | { variant?: 'public'; listing: ListingCardData }
    | { variant: 'mine'; listing: ListingMine };

export function ListingCard(props: ListingCardProps) {
    const listing = props.listing;
    const address = formatListingAddress(
        listing.street_address,
        listing.zone,
        listing.city,
        listing.state,
    );
    const variant = props.variant === 'mine' ? 'mine' : 'public';

    return (
        <Card className={cn('relative', cardClassName)}>
            <Link
                href={show(listing.id)}
                prefetch
                aria-label={`${listing.title}, ${formatRent(listing.rent_amount)}, ${address}`}
                className="absolute inset-0 z-0"
            />
            <div className="pointer-events-none relative z-10 flex h-full flex-col">
                <ListingCardBody
                    listing={listing}
                    address={address}
                    variant={variant}
                    menu={
                        props.variant === 'mine' && props.listing.can.update ? (
                            <div className="pointer-events-auto">
                                <ListingCardMenu
                                    listing={props.listing}
                                    isPublished={props.listing.is_published}
                                />
                            </div>
                        ) : null
                    }
                />
            </div>
        </Card>
    );
}

function ListingCardBody({
    listing,
    address,
    variant,
    menu = null,
}: {
    listing: ListingCardData | ListingMine;
    address: string;
    variant: 'public' | 'mine';
    menu?: ReactNode;
}) {
    const isPublished = 'is_published' in listing ? listing.is_published : true;

    return (
        <>
            <div className="relative">
                <ListingCover
                    url={listing.cover_url}
                    alt={variant === 'mine' ? '' : listing.title}
                    className="rounded-none border-0"
                />
                <Badge
                    variant="outline"
                    className={cn(
                        'absolute top-3 left-3 text-sm font-medium',
                        overlayBadgeClassName,
                    )}
                >
                    {categoryLabel(listing.category)}
                </Badge>
                {variant === 'mine' && (
                    <Badge
                        variant="outline"
                        className={cn(
                            'absolute top-3 right-3 text-sm font-medium',
                            overlayBadgeClassName,
                        )}
                    >
                        {isPublished ? <Eye /> : <EyeOff />}
                        {isPublished ? 'Publica' : 'Oculta'}
                    </Badge>
                )}
                {variant === 'public' && 'is_favorited' in listing && (
                    <div className="pointer-events-auto absolute top-3 right-3">
                        <FavoriteButton
                            listingId={listing.id}
                            favorited={listing.is_favorited}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1.5 lg:gap-2 px-4 py-4">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base lg:text-[17px] font-semibold">
                        {listing.title}
                    </CardTitle>
                    {menu}
                </div>
                <p className="text-base font-semibold">
                    {formatRent(listing.rent_amount)}
                    <span className="font-normal"> / mes</span>
                </p>
                <a
                    href={googleMapsUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${address} en Google Maps`}
                    className="focus-visible:ring-ring pointer-events-auto inline-flex w-fit items-start gap-1.5 rounded-sm text-sm lg:text-base hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                    <MapPinIcon
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0"
                    />
                    <span>{address}</span>
                </a>
            </div>
        </>
    );
}

function ListingCardMenu({
    listing,
    isPublished,
}: {
    listing: ListingMine;
    isPublished: boolean;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9"
                    aria-label="Opciones de la publicación"
                >
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={show(listing.id)}>Ver</Link>
                </DropdownMenuItem>
                {listing.can.update && (
                    <DropdownMenuItem asChild>
                        <Link href={edit(listing.id)}>Editar</Link>
                    </DropdownMenuItem>
                )}
                {listing.can.publish &&
                    (isPublished ? (
                        <Form {...unpublish.form(listing.id)}>
                            {({ processing }) => (
                                <DropdownMenuItem
                                    asChild
                                    className="w-full"
                                    disabled={processing}
                                >
                                    <button type="submit" disabled={processing}>
                                        Ocultar
                                    </button>
                                </DropdownMenuItem>
                            )}
                        </Form>
                    ) : (
                        <Form {...publish.form(listing.id)}>
                            {({ processing }) => (
                                <DropdownMenuItem
                                    asChild
                                    className="w-full"
                                    disabled={processing}
                                >
                                    <button type="submit" disabled={processing}>
                                        Publicar
                                    </button>
                                </DropdownMenuItem>
                            )}
                        </Form>
                    ))}
                {listing.can.delete && (
                    <Form
                        {...destroy.form(listing.id)}
                        onBefore={() =>
                            confirm(
                                '¿Borrar esta publicación? No se puede deshacer.',
                            )
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
