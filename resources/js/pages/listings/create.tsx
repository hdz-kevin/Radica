import { Head, Link, usePage } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/ListingController';
import InputError from '@/components/input-error';
import { ListingForm } from '@/components/listing-form';
import { create } from '@/routes/listings';
import { home } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { Auth } from '@/types';

export default function ListingsCreate({
    defaults,
}: {
    defaults: {
        state: string;
        city: string;
    };
}) {
    const { auth, errors } = usePage<{ auth: Auth }>().props;

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

                {auth.user?.phone_number == null ? (
                    <div className="grid gap-2">
                        <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
                            Guarda tu teléfono en el perfil para publicar.{' '}
                            <Link
                                href={editProfile()}
                                className="font-medium underline underline-offset-4"
                            >
                                Ir al perfil
                            </Link>
                        </p>
                        <InputError message={errors.phone_number} />
                    </div>
                ) : null}

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
