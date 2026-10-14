<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a per-listing phone and copy each owner's current number.
     */
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('phone_number')->nullable();
        });

        $phones = DB::table('users')
            ->whereNotNull('phone_number')
            ->pluck('phone_number', 'id');

        foreach ($phones as $userId => $phoneNumber) {
            DB::table('listings')
                ->where('user_id', $userId)
                ->update(['phone_number' => $phoneNumber]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('phone_number');
        });
    }
};
