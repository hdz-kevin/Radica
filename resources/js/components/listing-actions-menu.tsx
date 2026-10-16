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
    absoluteUrl,
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
    const PublishIcon = listing.is_published ? EyeOff : Eye;

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
                <ShareMenuItem listing={listing} />
                <SaveMenuItem listing={listing} favorited={favorited} />
                {can?.update ? (
                    <DropdownMenuItem asChild>
                        <Link href={edit(listing.id)}>
                            <Pencil />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                {can?.publish ? (
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
                                    <PublishIcon />
                                    {listing.is_published
                                        ? 'Ocultar'
                                        : 'Publicar'}
                                </button>
                            </DropdownMenuItem>
                        )}
                    </Form>
                ) : null}
                {can?.delete ? (
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SaveMenuItem({
    listing,
    favorited,
}: {
    listing: ListingActionsListing;
    favorited: boolean;
}) {
    const page = usePage();
    const heart = (
        <Heart className={cn(favorited && 'fill-[#eb163d] text-[#eb163d]')} />
    );

    if (!listing.is_published) {
        return (
            <DropdownMenuItem disabled>
                {heart}
                Guardar
            </DropdownMenuItem>
        );
    }

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
            {...action.form(listing.id)}
            invalidateCacheTags={[listingShowCacheTag(listing.id)]}
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
    if (!listing.is_published) {
        return (
            <DropdownMenuItem disabled>
                <Share2 />
                Compartir
            </DropdownMenuItem>
        );
    }

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

    if (typeof navigator.share === 'function') {
        try {
            await navigator.share({ title: listing.title, url });

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
    return absoluteUrl(show.url(listingId));
}
