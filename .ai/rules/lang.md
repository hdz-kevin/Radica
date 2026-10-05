---
paths:
  - 'lang/**'
---

# Lang

## Translate mail with JSON locale files
Do not edit vendor notification or mail views to translate copy. Laravel already calls Lang::get with the English sentence as the key. Put the Spanish value in lang/es.json and set APP_LOCALE=es. The test suite pins APP_LOCALE=en in phpunit.xml; a test that checks Spanish mail sets the locale itself. Missing keys fall back to English.
