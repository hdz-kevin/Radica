import { Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/ListingController';
import { ListingForm } from '@/components/listing-form';
import { home } from '@/routes';
import { create } from '@/routes/listings';

export default function ListingsCreate() {
    return (
        <>
            <Head title="Publicar" />

            <div className="flex w-full flex-col gap-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">
                        Crear publicación
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                        Tu publicación aparecerá al principio de todas las publicaciones.
                    </p>
                </div>

                <ListingForm
                    {...store.form()}
                    submitLabel="Crear publicación"
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
