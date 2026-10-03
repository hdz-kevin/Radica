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
| 5 | Favoritos: pivote `listing_favorites`; corazón en card y ficha; página solo con publicadas | Hecha |
| 6 | Google (Socialite ^5.29+; `users.google_id`; sin Facebook) | Hecha |
| 7 | `users.is_admin` + Gate; tu usuario vía `ADMIN_EMAIL`. Sin panel | |

Esquema visual: [`docs/db-schema.drawio`](db-schema.drawio). Columnas vigentes: migraciones en `database/migrations`.

---

## Alcance

**Sí:** catálogo sin login; filtros de zona; CRUD de **propias** publicaciones; `is_published` (crear publicado; el dueño despublica a mano); favoritos personales de publicaciones publicadas; Fortify + Google; flag admin sin pantallas extra.

**No:** mapa/pines/coords/geocoding; catálogo de colonias (archivo o tablas); chat, reseñas, pagos, contratos; roles; Reverb; panel para moderar ajenos; `Location` 1:1; país, CP, moneda en BD (renta en UI = MXN).

---

## Decisiones

**Acceso.** Visitante: catálogo, ficha, filtros. Usuario: eso + CRUD y publicar/despublicar de las suyas. Admin: `is_admin`; Gate listo, sin UI. Cualquiera autenticado puede publicar. Sin Spatie/roles.

**Ubicación.** Valor en `listings`: `state`, `city`, `zone`, `street_address`. Sin lat/lng. UI no pide estado/ciudad; al guardar: Puebla / Teziutlán. `zone` = texto libre obligatorio (etiqueta “Zona o colonia”; no `region`). Filtros: `LIKE` sobre `zone`. Inertia serializa esos campos planos, igual que el modelo.

**Categorías.** Enum PHP `room` \| `apartment` \| `house`, una tabla. Recámaras y baños obligatorios solo en depa/casa (`bedrooms`/`bathrooms` nullable en cuarto). Estacionamiento (`has_parking`) y servicios incluidos (`include_water`, `include_electricity`, `include_gas`, `include_internet`, `include_cable`) en todas las categorías; booleanos NOT NULL, default false. Sin `bathroom_type`, m², depósito, piso ni jardín.

**Contacto.** Número en `users.phone_number` (E.164, `521…`), solo en el perfil. Canales en el listing: WhatsApp y/o llamada (default ambos; al menos uno). La ficha usa el teléfono **actual** del dueño. Obligatorio al **crear** la primera publicación (`store` exige `hasPhone()`); despublicar/republicar y editar no. Si lo borran, las fichas se quedan sin WhatsApp/llamada. Sin chat.

**Visibilidad.** `is_published` default true; no Fillable (acción Publicar/Despublicar). `published_at` ordena el catálogo; despublicar no la limpia. Soft delete = el dueño borró, no pausó. Scope `published()` e `isPublished()`: `is_published` true (los trashed ya los oculta SoftDeletes). No hay available/rented ni ocultar a 7 días.

**Fotos.** 1–15, disco `public`, `position` más baja = portada (`is_cover` en esa fila). El límite vive en Form Request, no en CHECK SQL. Factories pueden ir sin fotos (cards usan placeholder).

**Favoritos (rebanada 5).** Pivote `listing_favorites` (`user_id` + `listing_id` unique, timestamps; `created_at` = cuándo se guardó). Sin modelo extra y sin contador público. Solo una publicación `is_published`; si no, 404 (también el dueño). Despublicar no borra la fila: la página Favoritos usa `published()`, y al republicar vuelve. Soft delete sí suelta el favorito. Se puede guardar la propia si está publicada. Invitado ve el corazón; el clic guarda la página actual como destino de login y no marca solo. Tras iniciar sesión, lo guarda a mano.

**Auth (rebanada 6).** Fortify se queda. Solo Google, sin Facebook y sin `social_accounts`. `users.password` nullable; `users.google_id` unique nullable (el `sub`). No se guardan tokens. El correo de Google solo cuenta si `email_verified` es true; si no, no hay usuario nuevo. Mismo `google_id` entra a esa cuenta y no reescribe nombre, correo ni contraseña. Mismo correo sin `google_id`: se vincula. Si `email_verified_at` ya estaba puesto, la contraseña se conserva; si estaba vacío, se marca verificado y `password` pasa a null. Un correo que ya tiene otro `google_id` no se toca. Quien no tiene contraseña puede definir una en Seguridad y borrar la cuenta sin ella.

---

## Datos aún no migrados

Pendiente de rebanada, no de reabrir el diseño:

- **`users`:** `is_admin` default false + index (7); `avatar_path` nullable (futuro).

Índices de catálogo ya en `listings`: `(is_published, published_at)`, `(city, zone)`, `category`. SQLite ahora; portable a MySQL/PostgreSQL. Sin PostGIS.

No hay tablas `categories`, `roles`, `conversations`, `locations`, `settings`.

---

## Pantallas

- **Catálogo:** buscador de zona, chips de categoría, cards; vacío si no hay resultados.
- **Ficha:** galería, datos, WhatsApp/Llamar según flags; zona/dirección; 404 si no está publicado (el dueño sí la ve).
- **Publicar/editar:** un form; campos extra por categoría; fotos; canales; zona texto + dirección opcional. Teléfono solo en perfil (aviso al crear si falta).
- **Mis publicaciones:** propias, publicadas y no (sin soft-deleted).
- **Favoritos:** las que el usuario guardó y siguen publicadas, la más reciente primero. Vacío con enlace al catálogo. Corazón en la card del catálogo y en la ficha publicada; no en Mis publicaciones.
- **Perfil:** `phone_number` (pega a todos los anuncios).
- **Login:** Fortify + botón Google.

Policies: `view` si `isPublished` o dueño/admin; `update`/`delete`/publicar/despublicar dueño o admin; `favorite` solo si está publicada.
