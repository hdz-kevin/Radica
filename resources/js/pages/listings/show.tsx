import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    destroy,
    edit,
    publish,
    show,
    unpublish,
} from '@/actions/App/Http/Controllers/ListingController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    bathroomLabel,
    categoryLabel,
    formatRent,
    telUrl,
    type ListingPermissions,
    type ListingShow,
    whatsAppUrl,
    yesNo,
} from '@/lib/listing';
import { home } from '@/routes';

export default function ListingsShow({
    listing,
    can,
}: {
    listing: ListingShow;
    can: ListingPermissions;
}) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Inicio',
                href: home(),
            },
            {
                title: listing.title,
                href: show(listing.id),
            },
        ],
    });

    const phoneNumber = listing.user.phone_number;
    const showWhatsApp =
        listing.contact_via_whatsapp && phoneNumber !== null;
    const showPhone = listing.contact_via_phone && phoneNumber !== null;

    return (
        <>
            <Head title={listing.title} />

            <article className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
                {!listing.is_published && (
                    <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
                        Esta publicación no está visible en el catálogo.
                    </p>
                )}

                {(can.update || can.delete || can.publish) && (
                    <div className="flex flex-wrap gap-2">
                        {can.update && (
                            <Button variant="outline" asChild>
                                <Link href={edit(listing.id)}>Editar</Link>
                            </Button>
                        )}
                        {can.publish &&
                            (listing.is_published ? (
                                <Form {...unpublish.form(listing.id)}>
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            Despublicar
                                        </Button>
                                    )}
                                </Form>
                            ) : (
                                <Form {...publish.form(listing.id)}>
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Publicar
                                        </Button>
                                    )}
                                </Form>
                            ))}
                        {can.delete && (
                            <Form
                                {...destroy.form(listing.id)}
                                onBefore={() =>
                                    confirm(
                                        '¿Borrar esta publicación? No se puede deshacer.',
                                    )
                                }
                            >
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={processing}
                                    >
                                        Borrar
                                    </Button>
                                )}
                            </Form>
                        )}
                    </div>
                )}

                <div className="relative aspect-video overflow-hidden rounded-xl border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                            {categoryLabel(listing.category)}
                        </Badge>
                        <span className="text-xl font-semibold">
                            {formatRent(listing.rent_amount)}
                            <span className="text-muted-foreground text-sm font-normal">
                                {' '}
                                / mes
                            </span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {listing.title}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {listing.zone}, {listing.city}, {listing.state}
                        {listing.street_address
                            ? ` · ${listing.street_address}`
                            : null}
                    </p>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {listing.description}
                </p>

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    {listing.category === 'room' && listing.bathroom_type ? (
                        <Detail
                            label="Baño"
                            value={bathroomLabel(listing.bathroom_type)}
                        />
                    ) : null}
                    {listing.category !== 'room' ? (
                        <>
                            <Detail
                                label="Recámaras"
                                value={listing.bedrooms?.toString() ?? '—'}
                            />
                            <Detail
                                label="Baños"
                                value={listing.bathrooms?.toString() ?? '—'}
                            />
                            <Detail
                                label="Metros cuadrados"
                                value={
                                    listing.square_meters
                                        ? `${listing.square_meters} m²`
                                        : '—'
                                }
                            />
                            <Detail
                                label="Estacionamiento"
                                value={
                                    listing.has_parking === null
                                        ? '—'
                                        : yesNo(listing.has_parking)
                                }
                            />
                        </>
                    ) : null}
                    <Detail
                        label="Amueblado"
                        value={yesNo(listing.is_furnished)}
                    />
                    <Detail
                        label="Mascotas"
                        value={yesNo(listing.pets_allowed)}
                    />
                </dl>

                {(showWhatsApp || showPhone) && (
                    <div className="flex flex-wrap gap-2">
                        {showWhatsApp && phoneNumber ? (
                            <Button asChild>
                                <a
                                    href={whatsAppUrl(phoneNumber)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp
                                </a>
                            </Button>
                        ) : null}
                        {showPhone && phoneNumber ? (
                            <Button variant="outline" asChild>
                                <a href={telUrl(phoneNumber)}>Llamar</a>
                            </Button>
                        ) : null}
                    </div>
                )}

                <p>
                    <Link
                        href={home()}
                        className="text-muted-foreground text-sm underline-offset-4 hover:underline"
                    >
                        Volver al catálogo
                    </Link>
                </p>
            </article>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value}</dd>
        </div>
    );
}

ListingsShow.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Publicación',
            href: home(),
        },
    ],
};
