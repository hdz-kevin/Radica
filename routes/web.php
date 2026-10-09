<?php

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ListingFavoriteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ListingController::class, 'index'])->name('home');

Route::get('favorites/login', [ListingFavoriteController::class, 'redirectToLogin'])->name('favorites.login');

Route::middleware(['guest', 'throttle:google-auth'])->group(function () {
    Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('listings/mine', [ListingController::class, 'mine'])->name('listings.mine');
    Route::resource('listings', ListingController::class)->except(['index', 'show']);
    Route::post('listings/{listing}/publish', [ListingController::class, 'publish'])->name('listings.publish');
    Route::post('listings/{listing}/unpublish', [ListingController::class, 'unpublish'])->name('listings.unpublish');

    Route::get('favorites', [ListingFavoriteController::class, 'index'])->name('favorites.index');
    Route::post('listings/{listing}/favorite', [ListingFavoriteController::class, 'store'])->name('listings.favorite.store');
    Route::delete('listings/{listing}/favorite', [ListingFavoriteController::class, 'destroy'])->name('listings.favorite.destroy');
});

Route::get('listings/{listing}', [ListingController::class, 'show'])->name('listings.show');

require __DIR__.'/settings.php';
