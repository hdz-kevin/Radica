import { Heart, House, List, Plus } from 'lucide-react';
import { home } from '@/routes';
import { index as favorites } from '@/routes/favorites';
import { create, mine } from '@/routes/listings';
import type { NavItem } from '@/types';

export function mainNavItems(): NavItem[] {
    return [
        {
            title: 'Inicio',
            href: home(),
            icon: House,
        },
        {
            title: 'Favoritos',
            href: favorites(),
            icon: Heart,
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
