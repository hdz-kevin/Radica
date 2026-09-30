import { Head, Link } from '@inertiajs/react';
import { ListingCard } from '@/components/listing-card';
import { type ListingCard as ListingCardData } from '@/lib/listing';
import { home } from '@/routes';
import { index as favorites } from '@/routes/favorites';

export default function FavoritesIndex({
    listings,
}: {
    listings: ListingCardData[];
}) {
    return (
        <>
            <Head title="Favoritos" />

            <div className="flex flex-col gap-6 sm:gap-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Favoritos
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Publicaciones que guardaste para ver más tarde.
                    </p>
                </div>

                {listings.length === 0 ? (
                    <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
                        Aún no tienes favoritos.{' '}
                        <Link
                            href={home()}
                            className="underline-offset-4 hover:underline"
                        >
                            Ver el catálogo
                        </Link>
                        .
                    </p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => (
                            <li key={listing.id} className="h-full">
                                <ListingCard listing={listing} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

FavoritesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Favoritos',
            href: favorites(),
        },
    ],
};
