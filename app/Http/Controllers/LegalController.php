<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Show the Terms and Conditions.
     */
    public function terms(): Response
    {
        return Inertia::render('legal/terms', ['legal' => $this->legalDetails()]);
    }

    /**
     * Show the Privacy Notice.
     */
    public function privacy(): Response
    {
        return Inertia::render('legal/privacy', ['legal' => $this->legalDetails()]);
    }

    /**
     * @return array{owner_name: string, contact_email: string, jurisdiction: string, updated_at: string}
     */
    private function legalDetails(): array
    {
        return [
            'owner_name' => config('legal.owner_name'),
            'contact_email' => config('legal.contact_email'),
            'jurisdiction' => config('legal.jurisdiction'),
            'updated_at' => config('legal.updated_at'),
        ];
    }
}
