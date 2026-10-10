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

## Terms acceptance and legal pages
Registration requires terms (accepted) and stores users.terms_accepted_at; Google sets it only when creating a new user, never on link or repeat login. terms_accepted_at is not Fillable (forceFill). Owner name, contact email, jurisdiction and version date live in config/legal.php (LEGAL_OWNER_NAME, LEGAL_CONTACT_EMAIL); LegalController passes them as the legal prop to legal/terms and legal/privacy. Bump legal.updated_at when the wording changes. If data collection or sharing changes (analytics, new providers), update the Aviso de Privacidad too.
