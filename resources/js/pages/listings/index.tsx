import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ListingCard } from '@/components/listing-card';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
    categoryLabel,
    listingCategories,
    type CatalogFilters,
    type ListingCard as ListingCardData,
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

const categoryChipClassName =
    'rounded-full px-4 sm:px-6 sm:h-10 sm:min-w-10 first:rounded-full last:rounded-full border-gray-300 dark:border-input data-[variant=outline]:border-l data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:data-[state=on]:bg-primary/90 hover:data-[state=on]:text-primary-foreground dark:data-[state=on]:border-primary-foreground dark:data-[state=on]:bg-primary-foreground dark:data-[state=on]:text-primary dark:hover:data-[state=on]:bg-primary-foreground/90 dark:hover:data-[state=on]:text-primary';

export default function ListingsIndex({
    listings,
    filters,
}: {
    listings: ListingCardData[];
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

            <div className="flex flex-col gap-6 sm:gap-8 mt-4">
                <section className="flex flex-col items-center gap-6 lg:flex-row lg:items-center" aria-label="Filtros">
                    <div className="w-full max-w-lg lg:max-w-md">
                        <div className="relative">
                            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="size-4" aria-hidden />
                            </span>
                            <Input
                                id="zone"
                                value={zone}
                                maxLength={255}
                                placeholder="Centro, El Fresnillo, Xoloco…"
                                aria-label="Zona o colonia"
                                onChange={(event) => setZone(event.target.value)}
                                className="h-10 pl-9 sm:pl-9 lg:text-[15px] lg:placeholder:text-[15px] rounded-full border-gray-300 dark:border-input"
                            />
                        </div>
                    </div>

                    <div className="w-full min-w-0 overflow-x-auto [scrollbar-width:none] lg:w-max lg:max-w-full [&::-webkit-scrollbar]:hidden">
                        <ToggleGroup
                            id="category-filter"
                            type="single"
                            variant="outline"
                            size="default"
                            value={category || 'all'}
                            onValueChange={handleCategoryChange}
                            className="flex w-max min-w-full flex-nowrap justify-center gap-2 lg:min-w-0"
                        >
                            <ToggleGroupItem
                                value="all"
                                className={categoryChipClassName}
                            >
                                Todas
                            </ToggleGroupItem>
                            {listingCategories.map((listingCategory) => (
                                <ToggleGroupItem
                                    key={listingCategory}
                                    value={listingCategory}
                                    className={categoryChipClassName}
                                >
                                    {categoryLabel(listingCategory)}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                </section>

                {listings.length === 0 ? (
                    <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
                        {hasActiveFilters
                            ? 'No hay publicaciones que coincidan.'
                            : 'No hay publicaciones todavía.'}
                    </p>
                ) : (
                    <ul
                        className={cn(
                            'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 3xl:grid-cols-4',
                            filtering && 'opacity-60',
                        )}
                    >
                        {listings.map((listing) => (
                            <li key={listing.id} className="h-full">
                                <ListingCard variant="public" listing={listing} />
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
