<?php

namespace App\Http\Controllers;

use App\Actions\AuthenticateGoogleUser;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Laravel\Socialite\Two\User as GoogleUser;

class GoogleAuthController extends Controller
{
    /**
     * Send the guest to Google. Scopes stay limited to identity.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->setScopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    /**
     * Complete Google sign-in and open a Laravel session.
     */
    public function callback(AuthenticateGoogleUser $authenticate): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (InvalidStateException) {
            return $this->failed();
        } catch (Exception) {
            return $this->failed();
        }

        if (! $googleUser instanceof GoogleUser) {
            return $this->failed();
        }

        $user = $authenticate->handle($googleUser);

        if ($user === null) {
            return to_route('login')->with('error', $this->rejectionMessage($googleUser));
        }

        Auth::login($user);

        return redirect()->intended(config('fortify.home'));
    }

    /**
     * A missing or unproven email is a different problem from a broken callback.
     */
    private function rejectionMessage(GoogleUser $googleUser): string
    {
        $email = trim((string) $googleUser->getEmail());
        $verified = ($googleUser->getRaw()['email_verified'] ?? false) === true;

        if ($email === '' || ! $verified) {
            return 'Google no compartió un correo verificado.';
        }

        return 'No se pudo iniciar sesión con Google. Vuelve a intentarlo.';
    }

    private function failed(): RedirectResponse
    {
        return to_route('login')->with('error', 'No se pudo iniciar sesión con Google. Vuelve a intentarlo.');
    }
}
