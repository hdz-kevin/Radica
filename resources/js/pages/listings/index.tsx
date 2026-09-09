import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { show } from '@/actions/App/Http/Controllers/ListingController';
import { ListingCover } from '@/components/listing-cover';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
    categoryLabel,
    formatRent,
    listingCategories,
    type CatalogFilters,
    type ListingCard,
    type ListingCategoryValue,
} from '@/lib/listing';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

function visitCatalog(
    zone: string,
    category: ListingCategoryValue | '',
    setFiltering: (value: boolean) => void,
): void {
    const query: Record<string, string> = {};
    const trimmed = zone.trim();

    if (trimmed !== '') {
        query.zone = trimmed;
    }

    if (category !== '') {
        query.category = category;
    }

    router.get(home.url(), query, {
        only: ['listings', 'filters'],
        preserveState: true,
        preserveScroll: true,
        replace: true,
        showProgress: false,
        onStart: () => setFiltering(true),
        onFinish: () => setFiltering(false),
    });
}

export default function ListingsIndex({
    listings,
    filters,
}: {
    listings: ListingCard[];
    filters: CatalogFilters;
}) {
    const [zone, setZone] = useState(filters.zone);
    const [category, setCategory] = useState<ListingCategoryValue | ''>(filters.category ?? '');
    const [filtering, setFiltering] = useState(false);
    const debouncedZone = useDebouncedValue(zone);
    const categoryRef = useRef(category);

    categoryRef.current = category;

    const hasActiveFilters = zone.trim() !== '' || category !== '';

    useEffect(() => {
        if (debouncedZone.trim() === filters.zone) {
            return;
        }

        visitCatalog(debouncedZone, categoryRef.current, setFiltering);
    }, [debouncedZone, filters.zone]);

    function handleCategoryChange(value: string): void {
        const next = (value === 'all' || value === '')
                ? ''
                : (value as ListingCategoryValue);

        setCategory(next);
        visitCatalog(zone, next, setFiltering);
    }

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

                <div className="flex flex-col gap-4">
                    <div className="grid max-w-md gap-2">
                        <Label htmlFor="zone">Zona o colonia</Label>
                        <Input
                            id="zone"
                            value={zone}
                            maxLength={255}
                            placeholder="Centro, El Carmen…"
                            onChange={(event) => setZone(event.target.value)}
                        />
                    </div>

                    <ToggleGroup
                        type="single"
                        variant="outline"
                        size="sm"
                        value={category || 'all'}
                        onValueChange={handleCategoryChange}
                        className="w-fit flex-wrap justify-start"
                    >
                        <ToggleGroupItem value="all">Todas</ToggleGroupItem>
                        {listingCategories.map((listingCategory) => (
                            <ToggleGroupItem key={listingCategory} value={listingCategory}>
                                {categoryLabel(listingCategory)}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {listings.length === 0 ? (
                    <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
                        {hasActiveFilters
                            ? 'No hay publicaciones que coincidan.'
                            : 'No hay publicaciones todavía.'}
                    </p>
                ) : (
                    <ul
                        className={cn(
                            'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
                            filtering && 'opacity-60',
                        )}
                    >
                        {listings.map((listing) => (
                            <li key={listing.id}>
                                <Link
                                    href={show(listing.id)}
                                    prefetch
                                    className="block h-full"
                                >
                                    <Card className="h-full transition-colors hover:bg-accent/40">
                                        <ListingCover
                                            url={listing.cover_url}
                                            alt={listing.title}
                                            className="mx-6"
                                        />
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
