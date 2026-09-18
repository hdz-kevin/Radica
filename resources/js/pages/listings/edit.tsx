import { Head, setLayoutProps } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/ListingController';
import { ListingForm } from '@/components/listing-form';
import { type ListingFormData } from '@/lib/listing';
import { home } from '@/routes';
import { edit } from '@/routes/listings';

export default function ListingsEdit({ listing }: { listing: ListingFormData }) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Inicio',
                href: home(),
            },
            {
                title: 'Editar',
                href: edit(listing.id!),
            },
        ],
    });

    return (
        <>
            <Head title={`Editar ${listing.title}`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Editar publicación
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Los cambios se guardan en esta publicación.
                    </p>
                </div>

                <ListingForm
                    {...update.form(listing.id!)}
                    listing={listing}
                    submitLabel="Guardar cambios"
                />
            </div>
        </>
    );
}

ListingsEdit.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Editar',
            href: home(),
        },
    ],
};
