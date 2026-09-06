<?php

use App\Http\Controllers\ListingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ListingController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('listings/mine', [ListingController::class, 'mine'])->name('listings.mine');
    Route::resource('listings', ListingController::class)->except(['index', 'show']);
    Route::post('listings/{listing}/publish', [ListingController::class, 'publish'])->name('listings.publish');
    Route::post('listings/{listing}/unpublish', [ListingController::class, 'unpublish'])->name('listings.unpublish');
});

Route::get('listings/{listing}', [ListingController::class, 'show'])->name('listings.show');

require __DIR__.'/settings.php';
