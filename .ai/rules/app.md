---
paths:
  - 'app/**'
  - 'app/**/*.php'
---

# App

## MVP is built in teaching slices
Canonical spec: docs/mvp_plan.md. Build one numbered slice at a time (data, catalog, publish, photos, filters, OAuth, admin). After each slice, explain architecture and Laravel/backend concepts for Kevin. Do not skip to Socialite before the listing domain exists. Do not add Mapbox, listing coordinates, or a colonia catalog. Do not implement the full MVP in one pass.

## Google login stays on users
Google is the only social login. Store the Google sub in users.google_id (unique, nullable). Do not add social_accounts or store OAuth tokens. password is nullable. Link an existing email only when Google email_verified is true. If that local email was unverified, set email_verified_at and clear password. If it was already verified, keep the password. A repeated login for the same google_id does not rewrite name, email, or password.

## Terms acceptance is notice, not a checkbox
Login and register show “Al continuar aceptas los Términos y el Aviso de Privacidad” under the form. There is no terms checkbox and registration does not validate a terms field. Email registration still stores users.terms_accepted_at on create via forceFill (not fillable). Google sets it only when creating a new user, never on link or repeat login. Owner name, contact email, jurisdiction and version date live in config/legal.php; LegalController passes them as the legal prop. Bump legal.updated_at when the wording changes. If data collection or sharing changes, update the Aviso de Privacidad too.

## Email registration redirects to verification
Email registration redirects to verification.notice (/email/verify) via App\Http\Responses\RegisterResponse, bound in FortifyServiceProvider. Do not point fortify.home at that route: login, successful verification, and Google default to /listings. Logout and account deletion return to the landing page at /. Google sets email_verified_at when it creates the user.

## Google login always remembers the user
Google sign-in calls Auth::login($user, remember: true). There is no remember checkbox on that path, and the session cookie alone expires after SESSION_LIFETIME (120 minutes). The remember cookie is what keeps the user signed in afterwards.
