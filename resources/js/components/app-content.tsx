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
            className="mx-auto flex h-full w-[96%] flex-1 flex-col gap-4 rounded-xl px-4 pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-10 xl:max-w-360 3xl:max-w-460"
            {...props}
        >
            {children}
        </main>
    );
}
