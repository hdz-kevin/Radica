<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LoginRedirectController extends Controller
{
    /**
     * Send a guest to login and bring them back to the page they were on.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        redirect()->setIntendedUrl($this->safeReturnUrl($request->string('return')->toString()));

        return to_route('login');
    }

    /**
     * Accept only a same-app relative path. Anything else returns to the catalog.
     */
    private function safeReturnUrl(string $return): string
    {
        if (
            $return === ''
            || ! str_starts_with($return, '/')
            || str_starts_with($return, '//')
            || str_contains($return, '\\')
            || str_contains($return, '://')
            || str_contains($return, '..')
        ) {
            return url('/');
        }

        return url($return);
    }
}
