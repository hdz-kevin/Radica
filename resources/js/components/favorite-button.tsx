import { Form, Link, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { login } from '@/routes/favorites';
import { destroy, store } from '@/routes/listings/favorite';

type FavoriteButtonProps = {
    listingId: number;
    favorited: boolean;
    className?: string;
};

function favoriteControlClassName(className?: string): string {
    return cn(
        'inline-flex size-9 shrink-0 items-center justify-center bg-transparent focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        className,
    );
}

function FavoriteHeart({ favorited }: { favorited: boolean }) {
    return (
        <Heart
            strokeWidth={1.5}
            className={cn(
                'size-7 overflow-visible hover:cursor-pointer',
                favorited
                    ? 'fill-[#eb163d] stroke-white/90'
                    : 'fill-black/50 stroke-white/90'
            )}
        />
    );
}

export function FavoriteButton({
    listingId,
    favorited,
    className,
}: FavoriteButtonProps) {
    const page = usePage();
    const { auth } = page.props;

    if (!auth.user) {
        return (
            <Link
                href={login({ query: { return: page.url } })}
                aria-label="Inicia sesión para guardar en favoritos"
                className={favoriteControlClassName(className)}
            >
                <FavoriteHeart favorited={false} />
            </Link>
        );
    }

    const action = favorited ? destroy : store;

    return (
        <Form {...action.form(listingId)} options={{ preserveScroll: true }}>
            {({ processing }) => (
                <button
                    type="submit"
                    disabled={processing}
                    aria-pressed={favorited}
                    aria-label={
                        favorited
                            ? 'Quitar de favoritos'
                            : 'Guardar en favoritos'
                    }
                    className={favoriteControlClassName(className)}
                >
                    <FavoriteHeart favorited={favorited} />
                </button>
            )}
        </Form>
    );
}
