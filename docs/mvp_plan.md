# MVP — Radica

Tablero de rentas: cualquiera ve el catálogo; con cuenta, publica. Sin pagos, chat, ni roles arrendador/inquilino.

Stack: Laravel 13, Inertia + React, Fortify. Por rebanadas (tests Pest de lo que acaba de nacer). **No** Socialite antes de que exista el dominio de listings. **No** mapa.

| # | Entrega | Estado |
| --- | --- | --- |
| 0 | Datos: enums, `listings`, `users.phone_number`, factory, visibilidad | Hecha |
| 1 | Catálogo público: listado (cards) + ficha | Hecha |
| 2 | Publicar / editar / despublicar (dueño) | Hecha |
| 3 | Fotos 1–15 (`listing_images`) | Hecha |
| 4 | Filtros en vivo: `LIKE` en `zone` (debounce + Inertia/`useHttp`) | Hecha |
| 5 | Google + Facebook (Socialite ^5.29+; [CVE-2026-73683](https://github.com/advisories/ghsa-cr46-5p72-vh72)) | |
| 6 | `users.is_admin` + Gate; tu usuario vía `ADMIN_EMAIL`. Sin panel | |

Esquema visual: [`docs/db-schema.drawio`](db-schema.drawio). Columnas vigentes: migraciones en `database/migrations`.

---

## Alcance

**Sí:** catálogo sin login; filtros de zona; CRUD de **propias** publicaciones; `is_published` (crear publicado; el dueño despublica a mano); Fortify + Google + Facebook; flag admin sin pantallas extra.

**No:** mapa/pines/coords/geocoding; catálogo de colonias (archivo o tablas); chat, favoritos, reseñas, pagos, contratos; roles; Reverb; panel para moderar ajenos; `Location` 1:1; país, CP, moneda en BD (renta en UI = MXN).

---

## Decisiones

**Acceso.** Visitante: catálogo, ficha, filtros. Usuario: eso + CRUD y publicar/despublicar de las suyas. Admin: `is_admin`; Gate listo, sin UI. Cualquiera autenticado puede publicar. Sin Spatie/roles.

**Ubicación.** Valor en `listings`: `state`, `city`, `zone`, `street_address`. Sin lat/lng. UI no pide estado/ciudad; al guardar: Puebla / Teziutlán. `zone` = texto libre obligatorio (etiqueta “Zona o colonia”; no `region`). Filtros: `LIKE` sobre `zone`. Inertia serializa esos campos planos, igual que el modelo.

**Categorías.** Enum PHP `room` \| `apartment` \| `house`, una tabla. Recámaras y baños obligatorios solo en depa/casa (`bedrooms`/`bathrooms` nullable en cuarto). Estacionamiento (`has_parking`) y servicios incluidos (`include_water`, `include_electricity`, `include_gas`, `include_internet`, `include_cable`) en todas las categorías; booleanos NOT NULL, default false. Sin `bathroom_type`, m², depósito, piso ni jardín.

**Contacto.** Número en `users.phone_number` (E.164, `521…`), solo en el perfil. Canales en el listing: WhatsApp y/o llamada (default ambos; al menos uno). La ficha usa el teléfono **actual** del dueño. Obligatorio al **crear** la primera publicación (`store` exige `hasPhone()`); despublicar/republicar y editar no. Si lo borran, las fichas se quedan sin WhatsApp/llamada. Sin chat.

**Visibilidad.** `is_published` default true; no Fillable (acción Publicar/Despublicar). `published_at` ordena el catálogo; despublicar no la limpia. Soft delete = el dueño borró, no pausó. Scope `published()` e `isPublished()`: `is_published` true (los trashed ya los oculta SoftDeletes). No hay available/rented ni ocultar a 7 días.

**Fotos.** 1–15, disco `public`, `position` más baja = portada (`is_cover` en esa fila). El límite vive en Form Request, no en CHECK SQL. Factories pueden ir sin fotos (cards usan placeholder).

**Auth (rebanada 5).** Fortify se queda. Socialite: Google y Facebook; `password` nullable; tabla `social_accounts` (`provider`+`provider_id` unique; un provider por usuario). Email ya verificado por el provider → `email_verified_at`. Mismo email → vincular, no duplicar. Facebook: App Review (`public_profile` + `email`); Google puede salir antes.

---

## Datos aún no migrados

Pendiente de rebanada, no de reabrir el diseño:

- **`social_accounts` (5):** sin guardar tokens de OAuth.
- **`users`:** `password` nullable (5); `is_admin` default false + index (6); `avatar_path` nullable (OAuth/futuro).

Índices de catálogo ya en `listings`: `(is_published, published_at)`, `(city, zone)`, `category`. SQLite ahora; portable a MySQL/PostgreSQL. Sin PostGIS.

No hay tablas `categories`, `roles`, `conversations`, `locations`, `settings`.

---

## Pantallas

- **Catálogo:** buscador de zona, chips de categoría, cards; vacío si no hay resultados.
- **Ficha:** galería, datos, WhatsApp/Llamar según flags; zona/dirección; 404 si no está publicado (el dueño sí la ve).
- **Publicar/editar:** un form; campos extra por categoría; fotos; canales; zona texto + dirección opcional. Teléfono solo en perfil (aviso al crear si falta).
- **Mis publicaciones:** propias, publicadas y no (sin soft-deleted).
- **Perfil:** `phone_number` (pega a todos los anuncios).
- **Login:** Fortify + botones Google/Facebook.

Policies: `view` si `isPublished` o dueño/admin; `update`/`delete`/publicar/despublicar dueño o admin.
