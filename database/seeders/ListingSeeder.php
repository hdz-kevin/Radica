<?php

namespace Database\Seeders;

use App\Enums\ListingCategory;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\Finder\SplFileInfo;

class ListingSeeder extends Seeder
{
    /**
     * Listings assigned to each user in id order (20 users, 50 listings).
     *
     * @var list<int>
     */
    private const OWNER_COUNTS = [6, 6, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1];

    /**
     * Seed a varied Teziutlán catalog for filter work.
     */
    public function run(): void
    {
        $users = User::query()->orderBy('id')->get();
        $owners = $this->owners($users);

        foreach ($this->listings() as $index => $listing) {
            $factory = Listing::factory()->for($owners[$index]);

            $factory = match ($listing['type']) {
                'room' => $factory->room(),
                'house' => $factory->house(),
                default => $factory->apartment(),
            };

            if ($listing['unpublished'] ?? false) {
                $factory = $factory->unpublished();
            }

            $model = $factory->create([
                ...$listing['attributes'],
                'published_at' => now()->subDays($index),
            ]);

            $this->attachSeedImages($model, ($index % 5) + 1);
        }
    }

    /**
     * @param  Collection<int, User>  $users
     * @return list<User>
     */
    private function owners(Collection $users): array
    {
        $owners = [];

        foreach (self::OWNER_COUNTS as $index => $count) {
            for ($i = 0; $i < $count; $i++) {
                $owners[] = $users[$index];
            }
        }

        return $owners;
    }

    /**
     * @return list<array{type: string, unpublished?: bool, attributes: array<string, mixed>}>
     */
    private function listings(): array
    {
        return [
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento luminoso en Centro',
                    'description' => 'Departamento de dos recámaras a una cuadra del zócalo. Iluminación natural, cocina integral y agua constante.',
                    'zone' => 'Centro',
                    'street_address' => 'Hidalgo 24',
                    'rent_amount' => 7200,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto en El Carmen',
                    'description' => 'Habitación independiente con baño propio. Ideal para una persona. Incluye internet.',
                    'zone' => 'El Carmen',
                    'street_address' => null,
                    'rent_amount' => 1700,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => false,
                ],
            ],
            [
                'type' => 'house',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Casa amplia en Francia (no publicada)',
                    'description' => 'Casa de tres recámaras con patio y cochera. Tranquila, cerca de escuelas.',
                    'zone' => 'Francia',
                    'street_address' => 'Privada las Palmas 8',
                    'rent_amount' => 12000,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento amueblado en Aire Libre',
                    'description' => 'Listo para habitar: cama, refrigerador y estufa. Se aceptan mascotas pequeñas.',
                    'zone' => 'Aire Libre',
                    'street_address' => 'Av. México 112',
                    'rent_amount' => 6500,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => true,
                    'pets_allowed' => true,
                    'include_gas' => true,
                    'include_electricity' => true,
                ],
            ],
            [
                'type' => 'room',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Cuarto con baño compartido en Xoloco',
                    'description' => 'Cuarto amueblado en casa familiar. Baño y cocina compartidos. Ambiente tranquilo.',
                    'zone' => 'Xoloco',
                    'street_address' => null,
                    'rent_amount' => 1500,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa de cuatro recámaras en El Fresnillo',
                    'description' => 'Ideal para familia. Jardín, dos plantas y espacio para dos autos.',
                    'zone' => 'El Fresnillo',
                    'street_address' => 'Camino Real 45',
                    'rent_amount' => 15000,
                    'bedrooms' => 4,
                    'bathrooms' => 3,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento familiar en La Magdalena',
                    'description' => 'Tres recámaras, sala-comedor amplia y balcón. Sin estacionamiento.',
                    'zone' => 'La Magdalena',
                    'street_address' => 'Morelos 67',
                    'rent_amount' => 7800,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'contact_via_whatsapp' => false,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto independiente en Chignaulingo',
                    'description' => 'Entrada independiente y baño propio. Cerca de transporte. Solo llamadas.',
                    'zone' => 'Chignaulingo',
                    'street_address' => 'Calle 5 de Mayo s/n',
                    'rent_amount' => 1900,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'contact_via_whatsapp' => false,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa amueblada en El Carmen',
                    'description' => 'Se renta amueblada por temporada larga. Patio trasero y cochera techada.',
                    'zone' => 'El Carmen',
                    'street_address' => null,
                    'rent_amount' => 14000,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => true,
                    'pets_allowed' => true,
                    'include_internet' => true,
                    'include_cable' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Estudio céntrico en Centro',
                    'description' => 'Ideal para una o dos personas. Cocina compacta y clóset. Agua 24 horas.',
                    'zone' => 'Centro',
                    'street_address' => 'Juárez 9',
                    'rent_amount' => 4800,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'house',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Casa de dos recámaras en El Fresnillo (no publicada)',
                    'description' => 'Planta baja, patio de servicio y tinaco propio. Sin cochera.',
                    'zone' => 'El Fresnillo',
                    'street_address' => 'Andador 3, lote 12',
                    'rent_amount' => 8000,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento con vista en Chignaulingo',
                    'description' => 'Segundo piso, dos recámaras y estacionamiento. Cerca de comercios.',
                    'zone' => 'Chignaulingo',
                    'street_address' => 'Blvd. las Américas 210',
                    'rent_amount' => 6200,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Habitación amueblada en Centro',
                    'description' => 'Cama individual, escritorio y clóset. Cocina compartida. Ideal para estudiante.',
                    'zone' => 'Centro',
                    'street_address' => 'Allende 18',
                    'rent_amount' => 1650,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_water' => true,
                    'include_electricity' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento nuevo en El Carmen',
                    'description' => 'Recién remodelado. Dos recámaras, cocina integral y tinaco. Sin mascotas.',
                    'zone' => 'El Carmen',
                    'street_address' => 'Callejón del Carmen 5',
                    'rent_amount' => 7500,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => false,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_gas' => true,
                ],
            ],
            [
                'type' => 'house',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Casa con jardín en Aire Libre (no publicada)',
                    'description' => 'Tres recámaras, patio grande y cuarto de servicio. Pendiente de fotos finales.',
                    'zone' => 'Aire Libre',
                    'street_address' => 'Privada del Sol 3',
                    'rent_amount' => 13500,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto amplio en Francia',
                    'description' => 'Ventana al patio, baño propio y espacio para escritorio. Se aceptan mascotas chicas.',
                    'zone' => 'Francia',
                    'street_address' => null,
                    'rent_amount' => 1850,
                    'is_furnished' => true,
                    'pets_allowed' => true,
                    'include_internet' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => false,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento de tres recámaras en El Fresnillo',
                    'description' => 'Tercer piso, sala amplia y cocina con barra. Cerca de la secundaria.',
                    'zone' => 'El Fresnillo',
                    'street_address' => 'Calle San Juan 88',
                    'rent_amount' => 8000,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_water' => true,
                    'include_internet' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa de una planta en La Magdalena',
                    'description' => 'Dos recámaras, patio de servicio y portón eléctrico. Tranquila.',
                    'zone' => 'La Magdalena',
                    'street_address' => 'Andador las Flores 11',
                    'rent_amount' => 9000,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Departamento en Xoloco (no publicado)',
                    'description' => 'Una recámara y estudio. Aún se está pintando. Disponible pronto.',
                    'zone' => 'Xoloco',
                    'street_address' => 'Calle 16 de Septiembre 40',
                    'rent_amount' => 4200,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto con entrada propia en Francia',
                    'description' => 'Planta alta, baño propio y mini refrigerador. Incluye internet y agua.',
                    'zone' => 'Francia',
                    'street_address' => 'Camino a San Sebastián 22',
                    'rent_amount' => 2000,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa familiar en Xoloco',
                    'description' => 'Cuatro recámaras, dos baños y cochera para dos autos. Patio trasero.',
                    'zone' => 'Xoloco',
                    'street_address' => 'Av. Progreso 150',
                    'rent_amount' => 14500,
                    'bedrooms' => 4,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                    'include_gas' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento económico en Chignaulingo',
                    'description' => 'Dos recámaras, cocina sencilla y lavadero. Renta accesible.',
                    'zone' => 'Chignaulingo',
                    'street_address' => null,
                    'rent_amount' => 4500,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Habitación en El Fresnillo',
                    'description' => 'Casa de huéspedes, baño compartido y cocina común. Ambiente familiar.',
                    'zone' => 'El Fresnillo',
                    'street_address' => 'Lote 7, manzana 2',
                    'rent_amount' => 1400,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_electricity' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa moderna en Chignaulingo',
                    'description' => 'Tres recámaras, sala a doble altura y cochera techada. Recién pintada.',
                    'zone' => 'Chignaulingo',
                    'street_address' => 'Cerrada las Américas 14',
                    'rent_amount' => 14800,
                    'bedrooms' => 3,
                    'bathrooms' => 3,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_cable' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento céntrico de una recámara',
                    'description' => 'A dos cuadras del mercado. Balcón pequeño y clóset empotrado.',
                    'zone' => 'Centro',
                    'street_address' => 'Reforma 33',
                    'rent_amount' => 5200,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_water' => true,
                    'include_gas' => true,
                ],
            ],
            [
                'type' => 'room',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Cuarto en El Carmen (no publicado)',
                    'description' => 'Se está cambiando el colchón. Disponible la próxima semana.',
                    'zone' => 'El Carmen',
                    'street_address' => null,
                    'rent_amount' => 1600,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa de dos plantas en Francia',
                    'description' => 'Cinco recámaras, patio interior y espacio para tres autos. Ideal para familia grande.',
                    'zone' => 'Francia',
                    'street_address' => 'Calle Francia 19',
                    'rent_amount' => 15000,
                    'bedrooms' => 5,
                    'bathrooms' => 3,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                    'include_electricity' => false,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento amueblado en Aire Libre',
                    'description' => 'Dos recámaras, sala con sofá y cocina equipada. Listo para mudarse.',
                    'zone' => 'Aire Libre',
                    'street_address' => 'Av. Independencia 77',
                    'rent_amount' => 6800,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_gas' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto para estudiante en El Fresnillo',
                    'description' => 'Cerca de escuelas. Escritorio, cama y baño compartido. Incluye internet.',
                    'zone' => 'El Fresnillo',
                    'street_address' => 'Calle 2 de Abril 6',
                    'rent_amount' => 1450,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_electricity' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => false,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa sencilla en Xoloco',
                    'description' => 'Dos recámaras, patio chico y tinaco. Buen precio para pareja.',
                    'zone' => 'Xoloco',
                    'street_address' => 'Callejón Xoloco 9',
                    'rent_amount' => 7000,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => false,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento con balcón en La Magdalena',
                    'description' => 'Dos recámaras, vista a la calle y estacionamiento en planta baja.',
                    'zone' => 'La Magdalena',
                    'street_address' => 'Calle Magdalena 21',
                    'rent_amount' => 7000,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_cable' => true,
                ],
            ],
            [
                'type' => 'room',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Cuarto en La Magdalena (no publicado)',
                    'description' => 'Se está reparando la ventana. Amueblado, baño propio.',
                    'zone' => 'La Magdalena',
                    'street_address' => null,
                    'rent_amount' => 1750,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa con cochera en Chignaulingo',
                    'description' => 'Tres recámaras, cocina amplia y patio de lavado. Portón corrido.',
                    'zone' => 'Chignaulingo',
                    'street_address' => 'Carretera a Mexcalcuautla km 1',
                    'rent_amount' => 10500,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento de planta baja en Aire Libre',
                    'description' => 'Tres recámaras y patio chico. Ideal si no quieres escaleras.',
                    'zone' => 'Aire Libre',
                    'street_address' => 'Privada San Sebastián 4',
                    'rent_amount' => 7600,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => false,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_gas' => true,
                    'include_electricity' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Habitación independiente en Chignaulingo',
                    'description' => 'Entrada por el costado de la casa. Baño propio y clóset grande.',
                    'zone' => 'Chignaulingo',
                    'street_address' => 'Blvd. las Américas 88',
                    'rent_amount' => 1950,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'contact_via_whatsapp' => false,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa céntrica de tres recámaras',
                    'description' => 'A cinco minutos del zócalo. Patio interior y local comercial abajo (no incluido).',
                    'zone' => 'Centro',
                    'street_address' => 'Calle 5 de Mayo 14',
                    'rent_amount' => 12500,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => false,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento nuevo en Francia',
                    'description' => 'Dos recámaras, cocina integral y cisterna. Fraccionamiento cerrado.',
                    'zone' => 'Francia',
                    'street_address' => 'Cerrada Trinidad 7',
                    'rent_amount' => 7700,
                    'bedrooms' => 2,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto amueblado en Aire Libre',
                    'description' => 'Cama matrimonial, buró y ventilador. Baño compartido con otra habitación.',
                    'zone' => 'Aire Libre',
                    'street_address' => null,
                    'rent_amount' => 1550,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_electricity' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'house',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Casa de tres recámaras en La Magdalena (no publicada)',
                    'description' => 'Tres recámaras y jardín. El dueño aún vive ahí unas semanas.',
                    'zone' => 'La Magdalena',
                    'street_address' => 'Calle Magdalena 30',
                    'rent_amount' => 11800,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Loft en Centro cerca del zócalo',
                    'description' => 'Espacio abierto, cocina americana y baño completo. Ideal para una pareja.',
                    'zone' => 'Centro',
                    'street_address' => 'Portal Hidalgo 2',
                    'rent_amount' => 5800,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_cable' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto luminoso en Francia',
                    'description' => 'Segundo piso, mucha luz y baño propio. Se renta a persona sola.',
                    'zone' => 'Francia',
                    'street_address' => 'Privada Francia 2',
                    'rent_amount' => 1800,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_gas' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa de tres recámaras en El Carmen',
                    'description' => 'Barrio tranquilo. Patio, tinaco y espacio para un auto afuera.',
                    'zone' => 'El Carmen',
                    'street_address' => 'Calle del Carmen 41',
                    'rent_amount' => 11000,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento de dos recámaras en El Fresnillo',
                    'description' => 'Primer piso, cocina con estufa y refrigerador. Se aceptan mascotas.',
                    'zone' => 'El Fresnillo',
                    'street_address' => null,
                    'rent_amount' => 6400,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => false,
                    'is_furnished' => true,
                    'pets_allowed' => true,
                    'include_gas' => true,
                    'include_electricity' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Habitación con baño propio en Aire Libre',
                    'description' => 'Casa de dos niveles; el cuarto está en planta baja. Incluye internet y agua.',
                    'zone' => 'Aire Libre',
                    'street_address' => 'Calle Aire Libre 15',
                    'rent_amount' => 1880,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_water' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'house',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Casa en La Magdalena (no publicada)',
                    'description' => 'Dos recámaras y local anexo. Se publicará cuando terminen la bardita.',
                    'zone' => 'La Magdalena',
                    'street_address' => 'Calle Morelos 102',
                    'rent_amount' => 9800,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento amplio en Xoloco',
                    'description' => 'Tres recámaras, dos baños y lavandería. Buena ventilación.',
                    'zone' => 'Xoloco',
                    'street_address' => 'Calle Xoloco 27',
                    'rent_amount' => 7300,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => false,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                    'include_internet' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento de una recámara en Xoloco',
                    'description' => 'Planta alta, cocina compacta y clóset. Para una o dos personas.',
                    'zone' => 'Xoloco',
                    'street_address' => null,
                    'rent_amount' => 3000,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_gas' => true,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto en casa familiar en El Carmen',
                    'description' => 'Reglas de convivencia claras. Cocina y sala compartidas. Solo no fumadores.',
                    'zone' => 'El Carmen',
                    'street_address' => 'Calle Progreso 8',
                    'rent_amount' => 1480,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'include_internet' => true,
                    'include_electricity' => true,
                    'include_water' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento con estacionamiento en El Fresnillo',
                    'description' => 'Dos recámaras, segundo piso y cajón techado. Agua constante.',
                    'zone' => 'El Fresnillo',
                    'street_address' => 'Andador 1, lote 4',
                    'rent_amount' => 5500,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'include_water' => true,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => false,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento familiar en Chignaulingo',
                    'description' => 'Tres recámaras, patio de tendedero y cerca de transporte público.',
                    'zone' => 'Chignaulingo',
                    'street_address' => 'Calle Principal 55',
                    'rent_amount' => 7100,
                    'bedrooms' => 3,
                    'bathrooms' => 1,
                    'has_parking' => false,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                    'include_water' => true,
                    'include_gas' => true,
                    'include_electricity' => false,
                ],
            ],
        ];
    }

    private function attachSeedImages(Listing $listing, int $count): void
    {
        $fixtures = $this->fixturePaths($listing->category);

        for ($position = 0; $position < $count; $position++) {
            $fixture = $fixtures[($listing->id + $position) % count($fixtures)];
            $path = 'listings/'.$listing->id.'/'.Str::uuid().'.jpg';
            Storage::disk(ListingImage::DISK)->put($path, File::get($fixture));

            ListingImage::factory()->for($listing)->create([
                'path' => $path,
                'disk' => ListingImage::DISK,
                'position' => $position,
                'is_cover' => $position === 0,
            ]);
        }
    }

    /**
     * @return list<string>
     */
    private function fixturePaths(ListingCategory $category): array
    {
        $directory = database_path('seeders/fixtures/listings/'.$category->value);
        $paths = collect(File::files($directory))
            ->filter(fn (SplFileInfo $file): bool => $file->getExtension() === 'jpg')
            ->map(fn (SplFileInfo $file): string => $file->getPathname())
            ->values()
            ->all();

        if ($paths === []) {
            throw new RuntimeException('Missing listing image fixtures in '.$directory);
        }

        return $paths;
    }
}
