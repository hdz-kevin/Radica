export type ListingCategoryValue = 'room' | 'apartment' | 'house';

export const includedUtilities = [
    { name: 'include_water', label: 'Agua' },
    { name: 'include_electricity', label: 'Luz' },
    { name: 'include_gas', label: 'Gas' },
    { name: 'include_internet', label: 'Internet' },
    { name: 'include_cable', label: 'Cable' },
] as const;

export type IncludedUtilityName = (typeof includedUtilities)[number]['name'];

export const MAX_LISTING_PHOTOS = 15;

export const MAX_LISTING_PHOTO_BYTES = 10 * 1024 * 1024;

export type ListingCard = {
    id: number;
    title: string;
    category: ListingCategoryValue;
    rent_amount: number;
    zone: string;
    city: string;
    state: string;
    street_address: string | null;
    cover_url: string | null;
    is_favorited: boolean;
};

export type CatalogFilters = {
    zone: string;
    category: ListingCategoryValue | null;
};

export type ListingMine = ListingCard & {
    is_published: boolean;
    can: ListingPermissions;
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
    phone_number: string | null;
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
    phone_number: string | null;
    contact_via_whatsapp: boolean;
    contact_via_phone: boolean;
    images: ListingShowImage[];
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

const categoryFilterLabels: Record<ListingCategoryValue, string> = {
    room: 'Cuartos',
    apartment: 'Departamentos',
    house: 'Casas',
};

const rentFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
});

export function categoryLabel(category: ListingCategoryValue): string {
    return categoryLabels[category];
}

export function categoryFilterLabel(category: ListingCategoryValue): string {
    return categoryFilterLabels[category];
}

export function formatRent(amount: number): string {
    return rentFormatter.format(amount);
}

export function listingShowCacheTag(listingId: number): string {
    return `listing-${listingId}`;
}

export function formatListingAddress(
    streetAddress: string | null,
    zone: string,
    city: string,
    state: string,
): string {
    return [streetAddress, zone, city, state]
        .filter((part) => part !== null && part !== '')
        .join(', ');
}

export function googleMapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, México`)}`;
}

export function yesNo(value: boolean): string {
    return value ? 'Sí' : 'No';
}

const WHATSAPP_MOBILE_NUMBER = /^521\d{10}$/;

const whatsAppInquiry =
    'Hola, vi tu publicación en radicaMX. ¿Sigue disponible?';

export function whatsAppUrl(phoneNumber: string, listingUrl: string): string {
    const text = `${whatsAppInquiry}\n\n${listingUrl}`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}

export function absoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    if (typeof window === 'undefined') {
        return path;
    }

    return new URL(path, window.location.origin).href;
}

export function telUrl(phoneNumber: string): string {
    const dialable = WHATSAPP_MOBILE_NUMBER.test(phoneNumber)
        ? `52${phoneNumber.slice(3)}`
        : phoneNumber;

    return `tel:+${dialable}`;
}
