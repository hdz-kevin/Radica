import { Form, Link, usePage } from '@inertiajs/react';
import {
    EllipsisVertical,
    Eye,
    EyeOff,
    Heart,
    Pencil,
    Share2,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    destroy,
    edit,
    publish,
    show,
    unpublish,
} from '@/actions/App/Http/Controllers/ListingController';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    formatRent,
    listingShowCacheTag,
    type ListingPermissions,
} from '@/lib/listing';
import { cn } from '@/lib/utils';
import { intended } from '@/routes/login';
import {
    destroy as unfavorite,
    store as favorite,
} from '@/routes/listings/favorite';

export type ListingActionsListing = {
    id: number;
    title: string;
    rent_amount: number;
    zone: string;
    city: string;
    state: string;
    is_published: boolean;
};

export function ListingActionsMenu({
    listing,
    can,
    favorited = false,
}: {
    listing: ListingActionsListing;
    can?: ListingPermissions;
    favorited?: boolean;
}) {
    const isOwner = Boolean(can?.update || can?.delete || can?.publish);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 shrink-0"
                    aria-label="Opciones de la publicación"
                >
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {isOwner && can ? (
                    <OwnerActions listing={listing} can={can} />
                ) : (
                    <ViewerActions listing={listing} favorited={favorited} />
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function OwnerActions({
    listing,
    can,
}: {
    listing: ListingActionsListing;
    can: ListingPermissions;
}) {
    const Icon = listing.is_published ? EyeOff : Eye;

    return (
        <>
            <ShareMenuItem listing={listing} />
            {can.update ? (
                <DropdownMenuItem asChild>
                    <Link href={edit(listing.id)}>
                        <Pencil />
                        Editar
                    </Link>
                </DropdownMenuItem>
            ) : null}
            {can.publish ? (
                <Form
                    {...(listing.is_published ? unpublish : publish).form(
                        listing.id,
                    )}
                >
                    {({ processing }) => (
                        <DropdownMenuItem
                            asChild
                            className="w-full"
                            disabled={processing}
                        >
                            <button type="submit" disabled={processing}>
                                <Icon />
                                {listing.is_published ? 'Ocultar' : 'Publicar'}
                            </button>
                        </DropdownMenuItem>
                    )}
                </Form>
            ) : null}
            {can.delete ? (
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
                            asChild
                            className="w-full"
                            variant="destructive"
                            disabled={processing}
                        >
                            <button type="submit" disabled={processing}>
                                <Trash2 />
                                Eliminar
                            </button>
                        </DropdownMenuItem>
                    )}
                </Form>
            ) : null}
        </>
    );
}

function ViewerActions({
    listing,
    favorited,
}: {
    listing: ListingActionsListing;
    favorited: boolean;
}) {
    return (
        <>
            <SaveMenuItem listingId={listing.id} favorited={favorited} />
            <ShareMenuItem listing={listing} />
        </>
    );
}

function SaveMenuItem({
    listingId,
    favorited,
}: {
    listingId: number;
    favorited: boolean;
}) {
    const page = usePage();
    const heart = (
        <Heart className={cn(favorited && 'fill-[#eb163d] text-[#eb163d]')} />
    );

    if (!page.props.auth.user) {
        return (
            <DropdownMenuItem asChild>
                <Link href={intended({ query: { return: page.url } })}>
                    {heart}
                    Guardar
                </Link>
            </DropdownMenuItem>
        );
    }

    const action = favorited ? unfavorite : favorite;

    return (
        <Form
            {...action.form(listingId)}
            invalidateCacheTags={[listingShowCacheTag(listingId)]}
            options={{ preserveScroll: true }}
        >
            {({ processing }) => (
                <DropdownMenuItem
                    asChild
                    className="w-full"
                    disabled={processing}
                >
                    <button type="submit" disabled={processing}>
                        {heart}
                        Guardar
                    </button>
                </DropdownMenuItem>
            )}
        </Form>
    );
}

function ShareMenuItem({ listing }: { listing: ListingActionsListing }) {
    return (
        <DropdownMenuItem
            onSelect={() => {
                void shareListing(listing);
            }}
        >
            <Share2 />
            Compartir
        </DropdownMenuItem>
    );
}

async function shareListing(listing: ListingActionsListing): Promise<void> {
    const url = absoluteListingUrl(listing.id);
    const text = `${formatRent(listing.rent_amount)} / mes\n${listing.zone}, ${listing.city}, ${listing.state}`;

    if (typeof navigator.share === 'function') {
        try {
            await navigator.share({ title: listing.title, text, url });

            return;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }
        }
    }

    try {
        await navigator.clipboard.writeText(url);
        toast.success('Enlace copiado');
    } catch {
        toast.error('No se pudo copiar el enlace');
    }
}

function absoluteListingUrl(listingId: number): string {
    const path = show.url(listingId);

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    return new URL(path, window.location.origin).href;
}
