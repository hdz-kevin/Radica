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
            className="mx-auto flex h-full w-[93%] flex-1 flex-col gap-4 rounded-xl pt-5 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-5 xl:max-w-360 3xl:max-w-460"
            {...props}
        >
            {children}
        </main>
    );
}
