import { AppBottomNav } from '@/components/app-bottom-nav';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import TextLink from '@/components/text-link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { AuthLayoutProps } from '@/types';

export default function AuthCardLayout({
    children,
    title,
    description,
    alternate,
    showFooter = true,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col">
            <div className="hidden lg:block">
                <AppHeader />
            </div>

            <div className="bg-muted flex flex-1 flex-col items-center justify-center gap-6 px-5 pt-5 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-10 md:pt-10 lg:pb-10">
                <div className="flex w-full max-w-md flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <Card className="rounded-xl lg:px-4">
                            <CardHeader className="pt-8 pb-0 text-center">
                                <CardTitle className="text-xl lg:text-2xl">
                                    {title}
                                </CardTitle>
                                {description ? (
                                    <CardDescription className="text-sm lg:text-base">
                                        {description}
                                    </CardDescription>
                                ) : null}
                                {alternate ? (
                                    <CardDescription className="text-sm lg:text-base">
                                        {alternate.prompt}{' '}
                                        <TextLink href={alternate.href}>
                                            {alternate.label}
                                        </TextLink>
                                    </CardDescription>
                                ) : null}
                            </CardHeader>
                            <CardContent className="py-4">
                                {children}
                            </CardContent>
                        </Card>
                    </div>

                    {showFooter ? <AppFooter /> : null}
                </div>
            </div>

            <AppBottomNav />
        </div>
    );
}
