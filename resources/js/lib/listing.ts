export type ListingCategoryValue = 'room' | 'apartment' | 'house';

export const includedUtilities = [
    { name: 'include_water', label: 'Agua' },
    { name: 'include_electricity', label: 'Luz' },
    { name: 'include_gas', label: 'Gas' },
    { name: 'include_internet', label: 'Internet' },
    { name: 'include_cable', label: 'Cable' },
] as const;

export type IncludedUtilityName = (typeof includedUtilities)[number]['name'];

export type ListingCard = {
    id: number;
    title: string;
    category: ListingCategoryValue;
    rent_amount: number;
    zone: string;
    city: string;
    cover_url: string | null;
};

export type CatalogFilters = {
    zone: string;
    category: ListingCategoryValue | null;
};

export type ListingMine = ListingCard & {
    is_published: boolean;
};

export type ListingPermissions = {
    update: boolean;
    delete: boolean;
    publish: boolean;
};

export type ListingImagePreview = {
    id: number;
    url: string;
};

export type ListingShowImage = ListingImagePreview & {
    is_cover: boolean;
};

type IncludedUtilities = Record<IncludedUtilityName, boolean>;

export type ListingFormData = {
    id?: number;
    title: string;
    description: string;
    category: ListingCategoryValue;
    rent_amount: number;
    is_furnished: boolean;
    pets_allowed: boolean;
    bedrooms: number | null;
    bathrooms: number | null;
    has_parking: boolean;
    state: string;
    city: string;
    zone: string;
    street_address: string | null;
    contact_via_whatsapp: boolean;
    contact_via_phone: boolean;
    images: ListingImagePreview[];
} & IncludedUtilities;

export type ListingShow = {
    id: number;
    title: string;
    description: string;
    category: ListingCategoryValue;
    rent_amount: number;
    is_furnished: boolean;
    pets_allowed: boolean;
    bedrooms: number | null;
    bathrooms: number | null;
    has_parking: boolean;
    is_published: boolean;
    state: string;
    city: string;
    zone: string;
    street_address: string | null;
    contact_via_whatsapp: boolean;
    contact_via_phone: boolean;
    images: ListingShowImage[];
    user: {
        phone_number: string | null;
    };
} & IncludedUtilities;

export const listingCategories: ListingCategoryValue[] = [
    'room',
    'apartment',
    'house',
];

const categoryLabels: Record<ListingCategoryValue, string> = {
    room: 'Cuarto',
    apartment: 'Departamento',
    house: 'Casa',
};

const rentFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
});

export function categoryLabel(category: ListingCategoryValue): string {
    return categoryLabels[category];
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
