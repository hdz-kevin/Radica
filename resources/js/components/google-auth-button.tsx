import { Button } from '@/components/ui/button';
import { redirect } from '@/routes/auth/google';

export function GoogleAuthButton() {
    return (
        <Button variant="outline" size="lg" className="w-full" asChild>
            <a href={redirect.url()}>Continuar con Google</a>
        </Button>
    );
}
