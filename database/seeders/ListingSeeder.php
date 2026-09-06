<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $listings = [
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento luminoso en Centro',
                    'description' => 'Departamento de dos recámaras a una cuadra del zócalo. Iluminación natural, cocina integral y agua constante.',
                    'zone' => 'Centro',
                    'street_address' => 'Hidalgo 24',
                    'rent_amount' => 8500,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto en El Carmen',
                    'description' => 'Habitación independiente con baño propio. Ideal para una persona. Incluye internet.',
                    'zone' => 'El Carmen',
                    'street_address' => null,
                    'rent_amount' => 3500,
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
                ],
            ],
            [
                'type' => 'room',
                'attributes' => [
                    'title' => 'Cuarto con baño compartido en Xoloco',
                    'description' => 'Cuarto amueblado en casa familiar. Baño y cocina compartidos. Ambiente tranquilo.',
                    'zone' => 'Xoloco',
                    'street_address' => null,
                    'rent_amount' => 2800,
                    'is_furnished' => true,
                    'pets_allowed' => false,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa de cuatro recámaras en San Juan',
                    'description' => 'Ideal para familia. Jardín, dos plantas y espacio para dos autos.',
                    'zone' => 'San Juan',
                    'street_address' => 'Camino Real 45',
                    'rent_amount' => 18000,
                    'bedrooms' => 4,
                    'bathrooms' => 3,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Departamento familiar en La Magdalena',
                    'description' => 'Tres recámaras, sala-comedor amplia y balcón. Sin estacionamiento.',
                    'zone' => 'La Magdalena',
                    'street_address' => 'Morelos 67',
                    'rent_amount' => 9500,
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
                    'title' => 'Cuarto independiente en Mexcalcuautla',
                    'description' => 'Entrada independiente y baño propio. Cerca de transporte. Solo llamadas.',
                    'zone' => 'Mexcalcuautla',
                    'street_address' => 'Calle 5 de Mayo s/n',
                    'rent_amount' => 4000,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'contact_via_whatsapp' => false,
                    'contact_via_phone' => true,
                ],
            ],
            [
                'type' => 'house',
                'attributes' => [
                    'title' => 'Casa amueblada en San Sebastián',
                    'description' => 'Se renta amueblada por temporada larga. Patio trasero y cochera techada.',
                    'zone' => 'San Sebastián',
                    'street_address' => null,
                    'rent_amount' => 15000,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'has_parking' => true,
                    'is_furnished' => true,
                    'pets_allowed' => true,
                ],
            ],
            [
                'type' => 'apartment',
                'attributes' => [
                    'title' => 'Estudio céntrico en El Progreso',
                    'description' => 'Ideal para una o dos personas. Cocina compacta y clóset. Agua 24 horas.',
                    'zone' => 'El Progreso',
                    'street_address' => 'Juárez 9',
                    'rent_amount' => 5500,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                ],
            ],
            [
                'type' => 'house',
                'unpublished' => true,
                'attributes' => [
                    'title' => 'Casa de dos recámaras en La Cantera (no publicada)',
                    'description' => 'Planta baja, patio de servicio y tinaco propio. Sin cochera.',
                    'zone' => 'La Cantera',
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
                    'title' => 'Departamento con vista en Las Américas',
                    'description' => 'Segundo piso, dos recámaras y estacionamiento. Cerca de comercios.',
                    'zone' => 'Las Américas',
                    'street_address' => 'Blvd. las Américas 210',
                    'rent_amount' => 7200,
                    'bedrooms' => 2,
                    'bathrooms' => 1,
                    'has_parking' => true,
                    'is_furnished' => false,
                    'pets_allowed' => false,
                    'contact_via_whatsapp' => true,
                    'contact_via_phone' => true,
                ],
            ],
        ];

        $user = User::first();

        foreach ($listings as $index => $listing) {
            $factory = Listing::factory()->for($user);

            $factory = match ($listing['type']) {
                'room' => $factory->room(),
                'house' => $factory->house(),
                default => $factory->apartment(),
            };

            if ($listing['unpublished'] ?? false) {
                $factory = $factory->unpublished();
            }

            $factory->create([
                ...$listing['attributes'],
                'published_at' => now()->subDays($index),
            ]);
        }
    }
}
