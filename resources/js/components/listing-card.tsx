import { Link } from '@inertiajs/react';
import { Eye, EyeOff, MapPinIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { show } from '@/actions/App/Http/Controllers/ListingController';
import { FavoriteButton } from '@/components/favorite-button';
import { ListingActionsMenu } from '@/components/listing-actions-menu';
import { ListingCover } from '@/components/listing-cover';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import {
    categoryLabel,
    formatListingAddress,
    formatRent,
    googleMapsUrl,
    listingShowCacheTag,
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
                cacheTags={listingShowCacheTag(listing.id)}
                aria-label={`${listing.title}, ${formatRent(listing.rent_amount)}, ${address}`}
                className="absolute inset-0 z-0"
            />
            <div className="pointer-events-none relative z-10 flex h-full flex-col">
                <ListingCardBody
                    listing={listing}
                    address={address}
                    variant={variant}
                    menu={
                        props.variant === 'mine' ? (
                            <div className="pointer-events-auto">
                                <ListingActionsMenu
                                    listing={props.listing}
                                    can={props.listing.can}
                                    favorited={props.listing.is_favorited}
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
                    className="aspect-[16/10.9] lg:aspect-16/9.5 rounded-none border-0"
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
            <div className="flex flex-col gap-1.5 px-4 py-4 lg:gap-2">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base font-semibold lg:text-[17px]">
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
                    className="focus-visible:ring-ring pointer-events-auto inline-flex w-fit items-start gap-1.5 rounded-sm text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none lg:text-base"
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
