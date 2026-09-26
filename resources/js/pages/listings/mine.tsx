import { Head, Link } from '@inertiajs/react';
import { ListingCard } from '@/components/listing-card';
import { Button } from '@/components/ui/button';
import { type ListingMine } from '@/lib/listing';
import { home } from '@/routes';
import { create, mine } from '@/routes/listings';

export default function ListingsMine({ listings }: { listings: ListingMine[] }) {
    return (
        <>
            <Head title="Mis publicaciones" />

            <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Mis publicaciones
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Publicadas y ocultas. Las eliminadas no aparecen
                            aquí.
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href={create()}>Publicar</Link>
                    </Button>
                </div>

                {listings.length === 0 ? (
                    <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
                        Aún no tienes publicaciones.{' '}
                        <Link href={create()} className="underline-offset-4 hover:underline">
                            Publica la primera
                        </Link>
                        .
                    </p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => (
                            <li key={listing.id} className="h-full">
                                <ListingCard variant="mine" listing={listing} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

ListingsMine.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Mis publicaciones',
            href: mine(),
        },
    ],
};
