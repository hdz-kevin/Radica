import AuthLayoutTemplate from '@/layouts/auth/auth-card-layout';
import type { AuthLayoutProps } from '@/types';

export default function AuthLayout({
    title = '',
    description = '',
    alternate,
    showFooter = true,
    children,
}: AuthLayoutProps) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            alternate={alternate}
            showFooter={showFooter}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
