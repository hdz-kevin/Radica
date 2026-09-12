import { House, List, Plus } from 'lucide-react';
import { home } from '@/routes';
import { create, mine } from '@/routes/listings';
import type { NavItem } from '@/types';

export function mainNavItems(): NavItem[] {
    return [
        {
            title: 'Catálogo',
            href: home(),
            icon: House,
        },
        {
            title: 'Publicar',
            href: create(),
            icon: Plus,
        },
        {
            title: 'Mis publicaciones',
            href: mine(),
            icon: List,
        },
    ];
}
