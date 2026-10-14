export function nationalPhoneNumber(phoneNumber: string | null | undefined): string {
    if (!phoneNumber?.startsWith('521')) {
        return phoneNumber ?? '';
    }

    return phoneNumber.slice(3);
}
