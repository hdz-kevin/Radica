export function nationalPhoneNumber(
    phoneNumber: string | null | undefined,
): string {
    if (!phoneNumber?.startsWith('521')) {
        return phoneNumber ?? '';
    }

    return phoneNumber.slice(3);
}

/**
 * Ten national digits from typed or pasted text. A leading 52 or 521 is
 * dropped only when the paste is longer than a national number.
 */
export function nationalDigits(value: string): string {
    let digits = value.replace(/\D/g, '');

    if (digits.length > 10 && digits.startsWith('521')) {
        digits = digits.slice(3);
    } else if (digits.length > 10 && digits.startsWith('52')) {
        digits = digits.slice(2);
    }

    return digits.slice(0, 10);
}

export function formatNationalPhone(digits: string): string {
    const value = digits.slice(0, 10);
    const groups = [value.slice(0, 3), value.slice(3, 6), value.slice(6, 10)];

    return groups.filter((group) => group.length > 0).join(' ');
}

export function caretAfterDigits(
    formatted: string,
    digitCount: number,
): number {
    if (digitCount <= 0) {
        return 0;
    }

    let seen = 0;

    for (let index = 0; index < formatted.length; index++) {
        if (/\d/.test(formatted[index] ?? '')) {
            seen++;

            if (seen === digitCount) {
                return index + 1;
            }
        }
    }

    return formatted.length;
}
