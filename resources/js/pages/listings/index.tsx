import { Head, Link } from '@inertiajs/react';
import { show } from '@/actions/App/Http/Controllers/ListingController';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    categoryLabel,
    formatRent,
    type CatalogListingCard,
} from '@/lib/listing';
import { home } from '@/routes';

export default function ListingsIndex({
    listings,
}: {
    listings: CatalogListingCard[];
}) {
    return (
        <>
            <Head title="Rentas en Teziutlán" />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Rentas en Teziutlán
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Publicaciones de cuartos, departamentos y casas.
                    </p>
                </div>

                {listings.length === 0 ? (
                    <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
                        No hay publicaciones todavía.
                    </p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => (
                            <li key={listing.id}>
                                <Link
                                    href={show(listing.id)}
                                    prefetch
                                    className="block h-full"
                                >
                                    <Card className="h-full transition-colors hover:bg-accent/40">
                                        <div className="relative mx-6 aspect-video overflow-hidden rounded-lg border">
                                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                        </div>
                                        <CardHeader>
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge variant="secondary">
                                                    {categoryLabel(
                                                        listing.category,
                                                    )}
                                                </Badge>
                                                <span className="text-sm font-semibold">
                                                    {formatRent(
                                                        listing.rent_amount,
                                                    )}
                                                </span>
                                            </div>
                                            <CardTitle className="line-clamp-2 text-base">
                                                {listing.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">
                                                {listing.zone}, {listing.city}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

ListingsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
    ],
};
