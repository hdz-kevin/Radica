import { Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { home, login, register } from '@/routes';
import { index as listingsIndex } from '@/routes/listings';

export function LandingHeader() {
    const { auth } = usePage().props;

    return (
        <header>
            <div className="3xl:max-w-460 mx-auto flex h-15 lg:pt-5 w-[96%] items-center justify-between gap-4 px-4 xl:max-w-370">
                <Link
                    href={home()}
                    prefetch
                    className="flex items-center gap-2 rounded-md"
                >
                    <AppLogo />
                </Link>

                <div className="flex items-center gap-1 sm:gap-2">
                    {auth.user ? (
                        null
                    ) : (
                        <>
                            <Button asChild variant="ghost" className="rounded-full px-4 hidden sm:block">
                                <Link href={register()}>Crear cuenta</Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                className="rounded-full px-3"
                            >
                                <Link href={login()}>
                                    <span>
                                        Iniciar sesión
                                    </span>
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
