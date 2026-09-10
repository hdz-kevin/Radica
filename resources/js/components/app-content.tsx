import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main
            className="mx-auto flex h-full w-[95%] xl:max-w-350 3xl:max-w-450 flex-1 flex-col gap-4 rounded-xl px-2 sm:px-0 py-5"
            {...props}
        >
            {children}
        </main>
    );
}
