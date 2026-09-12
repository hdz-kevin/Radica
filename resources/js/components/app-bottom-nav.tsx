import { Link } from '@inertiajs/react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { mainNavItems } from '@/lib/main-nav';
import { cn } from '@/lib/utils';

export function AppBottomNav() {
    const items = mainNavItems();
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <nav
            aria-label="Navegación principal"
            className="bg-background fixed inset-x-0 bottom-0 z-40 border-t border-t-neutral-200/50 dark:border-t-neutral-800/70 pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
            <ul className="mx-auto flex h-14 max-w-lg items-stretch">
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);

                    return (
                        <li key={item.title} className="flex-1">
                            <Link
                                href={item.href}
                                prefetch
                                className={cn(
                                    'flex h-full flex-col items-center justify-center gap-0.5 px-1 text-xs leading-tight font-medium',
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.icon && (
                                    <item.icon
                                        className="size-6"
                                        strokeWidth={isActive ? 2.4 : 1.8}
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
