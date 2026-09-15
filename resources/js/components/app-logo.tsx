import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Home, House } from 'lucide-react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <House className="size-5 text-white dark:text-black" />
            </div>
            <div className="grid flex-1 text-left text-base">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    RadicaMX
                </span>
            </div>
        </>
    );
}
