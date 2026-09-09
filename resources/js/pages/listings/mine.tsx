import { Form, Head, Link } from '@inertiajs/react';
import {
    destroy,
    edit,
    publish,
    show,
    unpublish,
} from '@/actions/App/Http/Controllers/ListingController';
import { ListingCover } from '@/components/listing-cover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { categoryLabel, formatRent, type ListingMine } from '@/lib/listing';
import { home } from '@/routes';
import { create, mine } from '@/routes/listings';

export default function ListingsMine({ listings }: { listings: ListingMine[] }) {
    return (
        <>
            <Head title="Mis publicaciones" />

            <div className="flex flex-col gap-6 p-4">
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
                    <Button asChild>
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
                            <li key={listing.id}>
                                <Card className="h-full">
                                    <ListingCover url={listing.cover_url} alt={listing.title} className="mx-6" />
                                    <CardHeader>
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge variant="secondary">
                                                {categoryLabel(listing.category)}
                                            </Badge>
                                            <Badge variant={listing.is_published ? 'default' : 'outline'}>
                                                {listing.is_published ? 'Publicada' : 'Oculta'}
                                            </Badge>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-base">
                                            {listing.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <p className="text-muted-foreground text-sm">
                                            {formatRent(listing.rent_amount)} ·{' '}
                                            {listing.zone}, {listing.city}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={show(listing.id)}>
                                                    Ver
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={edit(listing.id)}>
                                                    Editar
                                                </Link>
                                            </Button>
                                            {listing.is_published ? (
                                                <Form {...unpublish.form(listing.id)}>
                                                    {({ processing }) => (
                                                        <Button type="submit" variant="outline" size="sm" disabled={processing}>
                                                            Despublicar
                                                        </Button>
                                                    )}
                                                </Form>
                                            ) : (
                                                <Form {...publish.form(listing.id)}>
                                                    {({ processing }) => (
                                                        <Button type="submit" variant="outline" size="sm" disabled={processing}>
                                                            Publicar
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                            <Form
                                                {...destroy.form(listing.id)}
                                                onBefore={() =>
                                                    confirm('¿Borrar esta publicación? No se puede deshacer.')
                                                }
                                            >
                                                {({ processing }) => (
                                                    <Button type="submit" variant="destructive" size="sm" disabled={processing}>
                                                        Borrar
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>
                                    </CardContent>
                                </Card>
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
