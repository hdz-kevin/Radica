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
            className="bg-background fixed inset-x-0 bottom-0 z-40 border-t border-t-neutral-200 dark:border-t-neutral-800 pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
            <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-between px-2.5">
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);

                    return (
                        <li key={item.title} className="">
                            <Link
                                href={item.href}
                                prefetch
                                className={cn(
                                    'flex h-full flex-col items-center justify-center gap-1 px-1 text-[12px] leading-none font-medium',
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.icon && (
                                    <item.icon
                                        className="size-6 shrink-0"
                                        strokeWidth={isActive ? 2.4 : 1.8}
                                    />
                                )}
                                <span className="max-w-full truncate">
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
