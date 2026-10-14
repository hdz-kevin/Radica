import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { caretAfterDigits } from '@/lib/phone';

type DigitsInputProps = {
    id: string;
    name: string;
    defaultValue?: string | number | null;
    placeholder?: string;
    prefix?: string;
    grouped?: boolean;
};

function digitsFrom(value: string): string {
    const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');

    return /^0+$/.test(digits) ? '0' : digits;
}

function groupDigits(digits: string): string {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function DigitsInput({
    id,
    name,
    defaultValue,
    placeholder,
    prefix,
    grouped = false,
}: DigitsInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const caretRef = useRef<number | null>(null);
    const [digits, setDigits] = useState(() =>
        digitsFrom(defaultValue == null ? '' : String(defaultValue)),
    );
    const formatted = grouped ? groupDigits(digits) : digits;

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
        const nextRaw = input.value;
        const deletedSeparator =
            grouped &&
            nextRaw.length === formatted.length - 1 &&
            formatted[selection] === ',';

        let nextDigits = digitsFrom(nextRaw);
        let digitsBeforeCaret = nextRaw
            .slice(0, selection)
            .replace(/\D/g, '').length;

        if (deletedSeparator) {
            const digitsBeforeSeparator = formatted
                .slice(0, selection)
                .replace(/\D/g, '').length;

            nextDigits = digitsFrom(
                digits.slice(0, Math.max(0, digitsBeforeSeparator - 1)) +
                    digits.slice(digitsBeforeSeparator),
            );
            digitsBeforeCaret = Math.max(0, digitsBeforeSeparator - 1);
        }

        const nextFormatted = grouped ? groupDigits(nextDigits) : nextDigits;
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

    const inputProps = {
        ref: inputRef,
        id,
        type: 'text' as const,
        inputMode: 'numeric' as const,
        autoComplete: 'off',
        placeholder,
        value: formatted,
        onChange: handleChange,
    };

    if (!grouped) {
        return <Input {...inputProps} name={name} />;
    }

    const formattedField = prefix ? (
        <div className="border-input focus-within:border-ring focus-within:ring-ring/50 flex h-10 w-full overflow-hidden rounded-md border bg-transparent shadow-xs focus-within:ring-[3px] lg:h-11">
            <span className="bg-muted flex shrink-0 items-center border-r border-gray-300 px-3 text-sm select-none lg:text-base">
                {prefix}
            </span>
            <input
                {...inputProps}
                className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-3 text-sm outline-none lg:text-base"
            />
        </div>
    ) : (
        <Input {...inputProps} />
    );

    return (
        <>
            {formattedField}
            <input type="hidden" name={name} value={digits} />
        </>
    );
}
