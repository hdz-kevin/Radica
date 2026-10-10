<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Legal Documents
    |--------------------------------------------------------------------------
    |
    | Data shown on the Terms and Conditions and Privacy Notice pages. The
    | owner is the person legally responsible for the personal data (the
    | "responsable" under the LFPDPPP). Change updated_at whenever the
    | wording of either document changes.
    |
    */

    'owner_name' => env('LEGAL_OWNER_NAME', 'El responsable de Radica'),

    'contact_email' => env('LEGAL_CONTACT_EMAIL', 'contacto@example.com'),

    'jurisdiction' => env('LEGAL_JURISDICTION', 'Teziutlán, Puebla, México'),

    'updated_at' => '2026-10-09',

];
