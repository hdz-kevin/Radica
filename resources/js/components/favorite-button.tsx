import { Form, Link, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { intended } from '@/routes/login';
import { destroy, store } from '@/routes/listings/favorite';

type FavoriteButtonProps = {
    listingId: number;
    favorited: boolean;
    variant?: 'overlay' | 'plain';
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
    variant = 'overlay',
    className,
}: FavoriteButtonProps) {
    const page = usePage();
    const { auth } = page.props;
    const controlClassName =
        variant === 'plain'
            ? cn(
                  buttonVariants({ variant: 'outline', size: 'icon' }),
                  'size-9 shrink-0 shadow',
                  className,
              )
            : favoriteControlClassName(className);

    if (!auth.user) {
        return (
            <Link
                href={intended({ query: { return: page.url } })}
                aria-label="Inicia sesión para guardar en favoritos"
                className={controlClassName}
            >
                <FavoriteIcon favorited={false} variant={variant} />
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
                    className={controlClassName}
                >
                    <FavoriteIcon favorited={favorited} variant={variant} />
                </button>
            )}
        </Form>
    );
}

function FavoriteIcon({
    favorited,
    variant,
}: {
    favorited: boolean;
    variant: 'overlay' | 'plain';
}) {
    if (variant === 'plain') {
        return (
            <Heart
                className={cn(
                    'size-4',
                    favorited && 'fill-[#eb163d] stroke-[#eb163d]',
                )}
            />
        );
    }

    return <FavoriteHeart favorited={favorited} />;
}
