<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the demo landlords, including the known test account.
     */
    public function run(): void
    {
        User::factory()->withPhone()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        foreach ($this->landlords() as $index => $name) {
            User::factory()->withPhone($this->phoneNumber($index + 1))->create([
                'name' => $name,
                'email' => 'user'.($index + 1).'@example.com',
            ]);
        }
    }

    /**
     * @return list<string>
     */
    private function landlords(): array
    {
        return [
            'María Elena Hernández',
            'José Luis García',
            'Ana Patricia Morales',
            'Carlos Alberto Jiménez',
            'Lucía Fernández',
            'Miguel Ángel Ramos',
            'Sofía Guadalupe Díaz',
            'Fernando Castillo',
            'Paola Martínez',
            'Ricardo Vázquez',
            'Gabriela Ortiz',
            'Alejandro Mendoza',
            'Karina López',
            'Diego Armando Cruz',
            'Valeria Sánchez',
            'Roberto Navarro',
            'Itzel Ramírez',
            'Héctor Aguilar',
            'Montserrat Peña',
        ];
    }

    private function phoneNumber(int $index): string
    {
        return '52155'.str_pad((string) (10000000 + $index), 8, '0', STR_PAD_LEFT);
    }
}
