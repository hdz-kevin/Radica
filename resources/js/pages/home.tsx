import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Camera,
    Eye,
    Heart,
    MessageCircle,
    ClipboardList,
    Search,
    SlidersHorizontal,
    Sparkles,
    House,
    Building2,
} from 'lucide-react';
import { ListingCard } from '@/components/listing-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ListingCard as ListingCardData } from '@/lib/listing';
import { cn } from '@/lib/utils';
import { create, index } from '@/routes/listings';

const seekerBenefits = [
    {
        icon: Search,
        title: 'Explora opciones',
        description:
            'Explora cuartos, departamentos y casas disponibles en la zona que desees.',
    },
    {
        icon: SlidersHorizontal,
        title: 'Encuentra lo que buscas',
        description:
            'Filtra por zona y categoría para llegar más rápido a una buena opción.',
    },
    {
        icon: Heart,
        title: 'Guarda tus favoritos',
        description:
            'Conserva las publicaciones que te interesan y compáralas cuando quieras.',
    },
    {
        icon: MessageCircle,
        title: 'Contacta directamente',
        description:
            'Habla con el arrendador por llamada o WhatsApp, sin intermediarios.',
    },
];

const publisherBenefits = [
    {
        icon: BadgeCheck,
        title: 'Publica gratis',
        description:
            'Da a conocer tu inmueble sin comisiones ni cargos por publicar.',
    },
    {
        icon: Camera,
        title: 'Muéstralo bien',
        description:
            'Agrega hasta 15 fotos y los detalles que una persona necesita para decidir.',
    },
    {
        icon: Eye,
        title: 'Tú tienes el control',
        description:
            'Actualiza, oculta o vuelve a publicar tu inmueble cuando lo necesites.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Crea tu publicación',
        description:
            'Agrega fotos, precio, dirección y las características principales.',
    },
    {
        number: '02',
        title: 'Recibe personas interesadas',
        description:
            'Quienes buscan pueden descubrir tu inmueble y contactar contigo.',
    },
    {
        number: '03',
        title: 'Administra a tu ritmo',
        description:
            'Actualiza la información o deja de mostrar la publicación cuando se rente.',
    },
];

export default function Home({
    featuredListings,
}: {
    featuredListings: ListingCardData[];
}) {
    return (
        <>
            <Head title="Rentas en Teziutlán">
                <meta
                    name="description"
                    content="Encuentra o publica cuartos, departamentos y casas en renta en Teziutlán. Publicar en Radica es gratis."
                />
            </Head>

            <div className="flex flex-col gap-18 overflow-hidden pb-4 sm:gap-24 lg:gap-32 lg:mt-8">
                <section className="flex flex-col items-center gap-6 pt-4 text-center lg:gap-10 lg:pt-12">
                    <div className="flex max-w-3xl flex-col items-center gap-5 lg:gap-8">
                        <h1 className="text-3xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                            Buscas departamento para rentar en {' '}
                            <span className="text-muted-foreground">
                                    Teziutlán?
                                </span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg lg:text-xl">
                            Buscar un inmueble para rentar puede ser muy tedioso y tardado.
                            Radica acelera ese proceso y mejora la experiencia tanto
                            para arrendadores como para arrendatarios.
                        </p>
                    </div>

                    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="h-11 rounded-full px-6"
                        >
                            <Link href={index()} prefetch>
                                Ver publicaciones
                                <ArrowRight />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-11 rounded-full px-6"
                        >
                            <Link href={create()} prefetch>
                                Publicar inmueble
                            </Link>
                        </Button>
                    </div>

                    <ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs sm:gap-x-7 sm:text-base">
                        <li className="flex items-center gap-1.5">
                            <BadgeCheck
                                className="size-4 shrink-0"
                                aria-hidden
                            />
                            Sin comisiones
                        </li>
                        <li className="flex items-center gap-1.5">
                            <ClipboardList
                                className="size-4 shrink-0"
                                aria-hidden
                            />
                            Información clara
                        </li>
                        <li className="flex items-center gap-1.5">
                            <MessageCircle
                                className="size-4 shrink-0"
                                aria-hidden
                            />
                            Contacto directo
                        </li>
                    </ul>
                </section>

                {/* Publicaciones recientes */}
                <section
                    className="bg-muted/50 flex w-full flex-col items-center gap-8 rounded-2xl border p-5 py-6 sm:p-8 lg:p-10"
                    aria-labelledby="publicaciones-recientes-title"
                >
                    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
                        <span className="text-muted-foreground text-sm font-medium">
                            Las últimas publicaciones
                        </span>
                        <h2
                            id="publicaciones-recientes-title"
                            className="text-2xl font-semibold tracking-tight sm:text-4xl"
                        >
                            Publicaciones recientes
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg">
                            Las publicaciones están categorizadas como cuartos, departamentos y casas.
                        </p>
                    </div>

                    <div className="flex w-full flex-col items-center gap-6 lg:gap-8">
                        {featuredListings.length === 0 ? (
                            <p className="text-muted-foreground w-full rounded-xl p-8 py-10 text-center text-sm sm:text-base">
                                Aún no hay publicaciones. Explora el catálogo
                                pronto o publica tu inmueble.
                            </p>
                        ) : (
                            <ul className="3xl:grid-cols-3 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {featuredListings.map((listing, index) => (
                                    <li
                                        key={listing.id}
                                        className={cn(
                                            'h-full',
                                            index >= 3 && 'hidden sm:block',
                                        )}
                                    >
                                        <ListingCard
                                            variant="public"
                                            listing={listing}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Button
                            asChild
                            size="lg"
                            className="rounded-full"
                        >
                            <Link href={index()} prefetch>
                                Ver todas las publicaciones
                                <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Ventajas arrendatarios */}
                <section
                    className="flex flex-col gap-8"
                    aria-labelledby="buscar-title"
                >
                    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
                        <span className="text-muted-foreground text-sm font-medium">
                            Un espacio dedicado
                        </span>
                        <h2
                            id="buscar-title"
                            className="text-2xl font-semibold tracking-tight sm:text-4xl"
                        >
                            Encuentra el inmueble que buscas
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg">
                            Explora, filtra, compara y contacta desde un mismo lugar.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {seekerBenefits.map((benefit) => (
                            <Card
                                key={benefit.title}
                                className="gap-4 rounded-2xl p-5 shadow-sm"
                            >
                                <span className="bg-muted flex size-10 items-center justify-center rounded-xl">
                                    <benefit.icon className="size-5" />
                                </span>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Ventajas arrendadores */}
                <section
                    className="bg-muted/60 grid gap-10 rounded-2xl border p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-14"
                    aria-labelledby="publicar-title"
                >
                    <div className="flex flex-col items-start gap-5">
                        <span className="bg-background inline-flex size-11 items-center justify-center rounded-2xl border shadow-sm">
                            <House className="size-5" />
                        </span>
                        <div className="flex flex-col gap-3">
                            <h2
                                id="publicar-title"
                                className="text-2xl font-semibold tracking-tight sm:text-4xl"
                            >
                                Haz visible tu inmueble
                            </h2>
                            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                                Publica tu inmueble y llega a personas
                                que ya están buscando rentar en Teziutlán.
                            </p>
                        </div>
                        <Button asChild className="rounded-full">
                            <Link href={create()} prefetch>
                                Empezar a publicar
                                <ArrowRight />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {publisherBenefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="bg-background flex flex-col gap-4 rounded-2xl border p-5 shadow-sm"
                            >
                                <benefit.icon className="size-5" />
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className="flex flex-col gap-10"
                    aria-labelledby="pasos-title"
                >
                    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
                        <span className="text-muted-foreground text-sm font-medium">
                            Así de fácil
                        </span>
                        <h2
                            id="pasos-title"
                            className="text-2xl font-semibold tracking-tight sm:text-4xl"
                        >
                            Tu publicación lista en pocos pasos
                        </h2>
                    </div>

                    <ol className="grid gap-8 md:grid-cols-3">
                        {steps.map((step) => (
                            <li key={step.number} className="flex gap-4">
                                <span className="text-muted-foreground text-sm font-semibold">
                                    {step.number}
                                </span>
                                <div className="flex flex-col gap-2 border-l pl-4">
                                    <h3 className="font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="bg-primary text-primary-foreground flex flex-col items-center gap-6 rounded-2xl px-6 py-12 text-center sm:px-10 sm:py-16">
                    <div className="flex max-w-2xl flex-col gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                            Rentar inmuebles puede ser más sencillo
                        </h2>
                        <p className="text-primary-foreground/75 text-base sm:text-lg">
                            Estudiantes, trabajadores y familias están en busca de un lugar para rentar.
                            El objetivo de Radica es facilitar ese proceso.
                        </p>
                    </div>
                    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="rounded-full"
                        >
                            <Link href={create()} prefetch>
                                Publicar inmueble
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-full border bg-transparent"
                        >
                            <Link href={index()} prefetch>
                                Ver publicaciones
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </>
    );
}
