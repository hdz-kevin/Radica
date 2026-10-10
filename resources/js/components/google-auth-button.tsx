import { Button } from '@/components/ui/button';
import { redirect } from '@/routes/auth/google';
import { privacy, terms } from '@/routes/legal';

export function GoogleAuthButton() {
    return (
        <div className="grid gap-2.5">
            <Button variant="outline" size="lg" className="w-full" asChild>
                <a href={redirect.url()}>Continuar con Google</a>
            </Button>
            <p className="text-muted-foreground text-center text-[13px] lg:text-sm">
                Al continuar con Google aceptas los{' '}
                <a
                    href={terms.url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4"
                >
                    Términos
                </a>{' '}
                y el{' '}
                <a
                    href={privacy.url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4"
                >
                    Aviso de Privacidad
                </a>
                .
            </p>
        </div>
    );
}
