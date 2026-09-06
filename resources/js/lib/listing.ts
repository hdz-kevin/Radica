export type ListingCategoryValue = 'room' | 'apartment' | 'house';

export type BathroomTypeValue = 'own' | 'shared';

export type ListingCard = {
    id: number;
    title: string;
    category: ListingCategoryValue;
    rent_amount: number;
    zone: string;
    city: string;
};

export type ListingMine = ListingCard & {
    is_published: boolean;
};

export type ListingPermissions = {
    update: boolean;
    delete: boolean;
    publish: boolean;
};

export type ListingFormData = {
    id?: number;
    title: string;
    description: string;
    category: ListingCategoryValue;
    rent_amount: number;
    is_furnished: boolean;
    pets_allowed: boolean;
    bathroom_type: BathroomTypeValue | null;
    bedrooms: number | null;
    bathrooms: number | null;
    square_meters: number | null;
    has_parking: boolean | null;
    state: string;
    city: string;
    zone: string;
    street_address: string | null;
    contact_via_whatsapp: boolean;
    contact_via_phone: boolean;
};

export type ListingShow = {
    id: number;
    title: string;
    description: string;
    category: ListingCategoryValue;
    rent_amount: number;
    is_furnished: boolean;
    pets_allowed: boolean;
    bathroom_type: BathroomTypeValue | null;
    bedrooms: number | null;
    bathrooms: number | null;
    square_meters: number | null;
    has_parking: boolean | null;
    is_published: boolean;
    state: string;
    city: string;
    zone: string;
    street_address: string | null;
    contact_via_whatsapp: boolean;
    contact_via_phone: boolean;
    user: {
        phone_number: string | null;
    };
};

const categoryLabels: Record<ListingCategoryValue, string> = {
    room: 'Cuarto',
    apartment: 'Departamento',
    house: 'Casa',
};

const bathroomLabels: Record<BathroomTypeValue, string> = {
    own: 'Baño propio',
    shared: 'Baño compartido',
};

const rentFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
});

export function categoryLabel(category: ListingCategoryValue): string {
    return categoryLabels[category];
}

export function bathroomLabel(bathroomType: BathroomTypeValue): string {
    return bathroomLabels[bathroomType];
}

export function formatRent(amount: number): string {
    return rentFormatter.format(amount);
}

export function yesNo(value: boolean): string {
    return value ? 'Sí' : 'No';
}

export function whatsAppUrl(phoneNumber: string): string {
    return `https://wa.me/${phoneNumber}`;
}

export function telUrl(phoneNumber: string): string {
    return `tel:+${phoneNumber}`;
}
