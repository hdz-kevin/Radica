import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { privacy, terms } from '@/routes/legal';

export function AppFooter({ className }: { className?: string }) {
    return (
        <footer
            className={cn(
                'text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs lg:text-sm',
                className,
            )}
        >
            <span>© {new Date().getFullYear()} Radica</span>
            <Link href={terms()} className="hover:text-foreground hover:underline">
                Términos y Condiciones
            </Link>
            <Link href={privacy()} className="hover:text-foreground hover:underline">
                Aviso de Privacidad
            </Link>
        </footer>
    );
}
