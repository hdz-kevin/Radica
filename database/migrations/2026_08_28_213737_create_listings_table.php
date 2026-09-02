<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('category');
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('rent_amount');
            $table->boolean('is_furnished')->default(false);
            $table->boolean('pets_allowed')->default(false);
            $table->string('bathroom_type')->nullable();
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->unsignedInteger('square_meters')->nullable();
            $table->boolean('has_parking')->nullable();
            $table->string('state');
            $table->string('city');
            $table->string('zone');
            $table->string('street_address')->nullable();
            $table->boolean('contact_via_whatsapp')->default(true);
            $table->boolean('contact_via_phone')->default(true);
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->useCurrent();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['city', 'zone']);
            $table->index(['is_published', 'published_at']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
