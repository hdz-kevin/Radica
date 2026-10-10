import { privacy, terms } from '@/routes/legal';

export function AuthConsentNotice() {
    return (
        <p className="text-muted-foreground text-center text-sm leading-5">
            Al continuar aceptas los{' '}
            <a
                href={terms.url()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
            >
                Términos y Condiciones
            </a>{' '}
            y el{' '}
            <a
                href={privacy.url()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
            >
                Aviso de Privacidad
            </a>.
        </p>
    );
}
