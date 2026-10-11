import { Heart, House, List, Plus } from 'lucide-react';
import { index as favorites } from '@/routes/favorites';
import { create, index, mine } from '@/routes/listings';
import type { NavItem } from '@/types';

export function mainNavItems(): NavItem[] {
    return [
        {
            title: 'Publicaciones',
            href: index(),
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
