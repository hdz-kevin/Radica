import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export type LegalDetails = {
    owner_name: string;
    contact_email: string;
    jurisdiction: string;
    updated_at: string;
};

export function formatLegalDate(date: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(
        new Date(`${date}T00:00:00`),
    );
}

export function LegalDocument({
    title,
    updatedAt,
    children,
}: PropsWithChildren<{ title: string; updatedAt: string }>) {
    return (
        <>
            <Head title={title} />

            <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 text-sm leading-7 lg:text-base lg:leading-8">
                <header>
                    <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">
                        {title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Última actualización: {formatLegalDate(updatedAt)}
                    </p>
                </header>

                {children}
            </article>
        </>
    );
}

export function LegalSection({
    title,
    children,
}: PropsWithChildren<{ title: string }>) {
    return (
        <section className="flex flex-col gap-3 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc">
            <h2 className="text-base font-semibold lg:text-lg">{title}</h2>
            {children}
        </section>
    );
}

export function LegalEmail({ email }: { email: string }) {
    return (
        <a
            href={`mailto:${email}`}
            className="font-medium underline underline-offset-4"
        >
            {email}
        </a>
    );
}
