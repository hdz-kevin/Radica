import { Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/ListingController';
import { ListingForm } from '@/components/listing-form';
import { create } from '@/routes/listings';
import { home } from '@/routes';

export default function ListingsCreate({
    defaults,
}: {
    defaults: {
        state: string;
        city: string;
    };
}) {
    return (
        <>
            <Head title="Publicar" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Publicar vivienda
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Tu publicación aparecerá al principio de la lista de publicaciones.
                    </p>
                </div>

                <ListingForm
                    {...store.form()}
                    defaults={defaults}
                    submitLabel="Publicar"
                />
            </div>
        </>
    );
}

ListingsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Publicar',
            href: create(),
        },
    ],
};
