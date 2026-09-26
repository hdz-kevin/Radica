import { Head, Link, usePage } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/ListingController';
import InputError from '@/components/input-error';
import { ListingForm } from '@/components/listing-form';
import { create } from '@/routes/listings';
import { home } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { Auth } from '@/types';

export default function ListingsCreate() {
    const { auth, errors } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Publicar" />

            <div className="flex flex-col gap-6 w-full">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
                        Publicar vivienda
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                        Tu publicación aparecerá al principio de la lista de publicaciones.
                    </p>
                </div>

                {auth.user?.phone_number == null ? (
                    <div className="grid gap-2">
                        <p className="rounded-md text-sm border border-red-200 bg-red-50 px-3 py-2 text-red-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50">
                            Antes debes guardar tu teléfono de contacto en tu perfil para poder publicar.{' '}
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

                <ListingForm {...store.form()} submitLabel="Crear publicación" />
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
