import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';
import {
    caretAfterDigits,
    formatNationalPhone,
    nationalDigits,
    nationalPhoneNumber,
} from '@/lib/phone';
import { cn } from '@/lib/utils';

type PhoneInputProps = {
    id: string;
    name?: string;
    defaultValue?: string | null;
    required?: boolean;
    className?: string;
};

export function PhoneInput({
    id,
    name = 'phone_number',
    defaultValue,
    required = false,
    className,
}: PhoneInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const caretRef = useRef<number | null>(null);
    const [digits, setDigits] = useState(() =>
        nationalDigits(nationalPhoneNumber(defaultValue)),
    );
    const formatted = formatNationalPhone(digits);

    useLayoutEffect(() => {
        const input = inputRef.current;
        const caret = caretRef.current;

        if (input === null || caret === null) {
            return;
        }

        input.setSelectionRange(caret, caret);
        caretRef.current = null;
    });

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const input = event.currentTarget;
        const selection = input.selectionStart ?? input.value.length;
        const previousFormatted = formatted;
        const nextRaw = input.value;
        const deletedSeparator =
            nextRaw.length === previousFormatted.length - 1 &&
            previousFormatted[selection] === ' ';

        let nextDigits = nationalDigits(nextRaw);
        let digitsBeforeCaret = nextRaw
            .slice(0, selection)
            .replace(/\D/g, '').length;

        if (deletedSeparator) {
            const digitsBeforeSeparator = previousFormatted
                .slice(0, selection)
                .replace(/\D/g, '').length;

            nextDigits =
                digits.slice(0, Math.max(0, digitsBeforeSeparator - 1)) +
                digits.slice(digitsBeforeSeparator);
            digitsBeforeCaret = Math.max(0, digitsBeforeSeparator - 1);
        }

        const nextFormatted = formatNationalPhone(nextDigits);
        const caret = caretAfterDigits(
            nextFormatted,
            Math.min(digitsBeforeCaret, nextDigits.length),
        );

        if (nextDigits === digits) {
            input.value = formatted;
            input.setSelectionRange(caret, caret);

            return;
        }

        caretRef.current = caret;
        setDigits(nextDigits);
    }

    return (
        <div
            className={cn(
                'border-input focus-within:border-ring focus-within:ring-ring/50 flex h-10 w-full overflow-hidden rounded-md border bg-transparent shadow-xs focus-within:ring-[3px] lg:h-11',
                className,
            )}
        >
            <span className="bg-muted flex shrink-0 items-center border-r border-gray-300 px-3 text-sm select-none lg:text-base">
                +52
            </span>
            <input
                ref={inputRef}
                id={id}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required={required}
                value={formatted}
                onChange={handleChange}
                className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-3 text-sm outline-none lg:text-base"
            />
            <input type="hidden" name={name} value={digits} />
        </div>
    );
}
