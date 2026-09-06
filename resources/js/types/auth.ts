export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone_number: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};
