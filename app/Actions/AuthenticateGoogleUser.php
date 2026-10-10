<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\User as GoogleUser;

class AuthenticateGoogleUser
{
    /**
     * Find, link, or create the local user for a verified Google account.
     *
     * Returns null when Google did not prove the email, or when that email
     * already belongs to a different Google account.
     */
    public function handle(GoogleUser $googleUser): ?User
    {
        $email = Str::lower(trim((string) $googleUser->getEmail()));
        $googleId = trim((string) $googleUser->getId());

        if ($email === '' || $googleId === '' || ! $this->emailIsVerified($googleUser)) {
            return null;
        }

        try {
            return DB::transaction(fn (): ?User => $this->resolve($googleUser, $email, $googleId));
        } catch (UniqueConstraintViolationException) {
            return DB::transaction(fn (): ?User => $this->resolve($googleUser, $email, $googleId));
        }
    }

    /**
     * Google's userinfo marks a proven address with boolean true.
     */
    private function emailIsVerified(GoogleUser $googleUser): bool
    {
        return ($googleUser->getRaw()['email_verified'] ?? false) === true;
    }

    /**
     * Resolve the user by Google ID or email.
     */
    private function resolve(GoogleUser $googleUser, string $email, string $googleId): ?User
    {
        $linked = User::query()->where('google_id', $googleId)->lockForUpdate()->first();

        if ($linked !== null) {
            return $linked;
        }

        $byEmail = User::query()->where('email', $email)->lockForUpdate()->first();

        if ($byEmail !== null) {
            // If email belongs to a different Google account, return null.
            if ($byEmail->google_id !== null) {
                return null;
            }

            $byEmail->google_id = $googleId;

            if ($byEmail->email_verified_at === null) {
                $byEmail->email_verified_at = now();
                $byEmail->password = null;
            }

            $byEmail->save();

            return $byEmail;
        }

        $user = new User;
        $user->forceFill([
            'name' => $this->name($googleUser, $email),
            'email' => $email,
            'password' => null,
            'google_id' => $googleId,
            'email_verified_at' => now(),
            'terms_accepted_at' => now(),
        ]);
        $user->save();

        return $user;
    }

    /**
     * users.name is required. Fall back to the mailbox when Google omits a name.
     */
    private function name(GoogleUser $googleUser, string $email): string
    {
        $name = trim((string) $googleUser->getName());

        if ($name !== '') {
            return $name;
        }

        $local = Str::before($email, '@');

        return $local !== '' ? $local : 'User';
    }
}
