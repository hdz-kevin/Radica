---
paths:
  - 'app/Actions/Fortify/**'
---

# Fortify

## Spanish validation messages live in the language file
Gendered validation sentences live in lang/es/validation.php under custom, so login, registration, profile, and listings share them. Do not add a per-form message trait or a validation block in lang/es/auth.php. Password complexity lines stay in validation.password because that rule does not read custom.password.mixed.
