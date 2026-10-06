<?php

use App\Rules\MexicanPhoneNumber;

test('a 10-digit national number is valid', function (string $phoneNumber) {
    expect(phoneRuleFailure($phoneNumber))->toBeNull();
})->with([
    'mexico city' => '5512345678',
    'teziutlan' => '2321234567',
]);

test('a number that is not 10 national digits is rejected', function (mixed $phoneNumber) {
    expect(phoneRuleFailure($phoneNumber))->toBe('validation.mexican_phone');
})->with([
    'too short' => '551234567',
    'too long' => '55123456789',
    'with the whatsapp prefix' => '5215512345678',
    'with letters' => '551234567a',
    'not a string' => 5512345678,
]);

function phoneRuleFailure(mixed $phoneNumber): ?string
{
    $message = null;

    (new MexicanPhoneNumber)->validate(
        'phone_number',
        $phoneNumber,
        function (string $failure) use (&$message) {
            $message = $failure;

            return new class
            {
                public function translate(): void {}
            };
        },
    );

    return $message;
}
