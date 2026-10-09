import { Link, usePage } from '@inertiajs/react';
import { LogIn, User2, UserPlus, UserPlus2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { mainNavItems } from '@/lib/main-nav';
import { cn } from '@/lib/utils';
import { home, login, register } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const navItems = mainNavItems();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    return (
        <>
            <div className="border-sidebar-border/80 border-b">
                <div className="mx-auto flex h-16 w-[96%] px-2 max-w-500 items-center justify-between gap-2 lg:h-18 lg:grid lg:grid-cols-[1fr_auto_1fr]">
                    <div className="flex items-center justify-start">
                        <Link
                            href={home()}
                            prefetch
                            className="flex items-center space-x-2"
                        >
                            <AppLogo />
                        </Link>
                    </div>

                    <div className="flex h-full items-center justify-center">
                        <div className="hidden h-full items-center lg:flex">
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                    {navItems.map((item, index) => (
                                        <NavigationMenuItem
                                            key={index}
                                            className="relative flex h-full items-center"
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    whenCurrentUrl(
                                                        item.href,
                                                        activeItemStyles,
                                                    ),
                                                    'h-9 cursor-pointer px-3 text-base',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="mr-2 size-4" />
                                                )}
                                                {item.title}
                                            </Link>
                                            {isCurrentUrl(item.href) && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-9 md:size-10 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-neutral-100 text-black dark:bg-neutral-700 dark:text-white">
                                                <User2 className="size-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-60 lg:w-64"
                                    align="end"
                                >
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex shrink-0 items-center md:gap-1">
                                <Button variant="ghost" asChild className="hidden xl:flex">
                                    <Link href={register()}>
                                        Crear cuenta
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href={login()}>
                                        Iniciar sesión
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
