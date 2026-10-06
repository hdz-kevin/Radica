---
paths:
  - 'lang/**'
---

# Lang

## Gendered validation sentences live in validation.php
Field messages such as "El nombre es obligatorio." belong in lang/es/validation.php custom. One entry covers every form that validates that field. Do not duplicate them in lang/es/auth.php or a message trait. Password complexity (letters, mixed, numbers, symbols, uncompromised) stays under validation.password. The test suite uses APP_LOCALE=en; a test that checks a Spanish validation sentence sets the locale itself.

## Translate mail with JSON locale files
Do not edit vendor notification or mail views to translate copy. Laravel already calls Lang::get with the English sentence as the key. Put the Spanish value in lang/es.json and set APP_LOCALE=es. The test suite pins APP_LOCALE=en in phpunit.xml; a test that checks Spanish mail sets the locale itself. Missing keys fall back to English.
