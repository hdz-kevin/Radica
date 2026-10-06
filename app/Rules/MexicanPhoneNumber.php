<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class MexicanPhoneNumber implements ValidationRule
{
    /**
     * Country code plus the mobile digit WhatsApp still requires.
     */
    public const WHATSAPP_PREFIX = '521';

    private const NATIONAL_PATTERN = '/^\d{10}$/';

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || preg_match(self::NATIONAL_PATTERN, $value) !== 1) {
            $fail('validation.mexican_phone')->translate();
        }
    }

    /**
     * Store a national number with the WhatsApp prefix. Values that already include it are unchanged.
     */
    public static function forStorage(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (preg_match(self::NATIONAL_PATTERN, $value) === 1) {
            return self::WHATSAPP_PREFIX.$value;
        }

        return $value;
    }
}
