import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-5 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-6">
                {/* <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                    </div>
                </Link> */}

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl lg:px-4">
                        <CardHeader className="pt-8 pb-0 text-center">
                            <CardTitle className="text-xl lg:text-2xl">{title}</CardTitle>
                            <CardDescription className='text-sm lg:text-base'>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="py-4">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
