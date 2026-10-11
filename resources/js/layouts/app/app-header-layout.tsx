import { usePage } from '@inertiajs/react';
import { AppBottomNav } from '@/components/app-bottom-nav';
import { AppContent } from '@/components/app-content';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { LandingHeader } from '@/components/landing-header';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({ children }: AppLayoutProps) {
    const isLandingPage = usePage().component === 'home';

    return (
        <AppShell variant="header">
            {isLandingPage ? <LandingHeader /> : <AppHeader />}
            <AppContent variant="header">
                {children}
                <AppFooter className="mt-auto pt-10" />
            </AppContent>
            {!isLandingPage && <AppBottomNav />}
        </AppShell>
    );
}
