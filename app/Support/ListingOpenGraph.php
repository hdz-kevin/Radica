<?php

namespace App\Support;

class ListingOpenGraph
{
    /**
     * Open Graph tags for a public page. Crawlers read the first HTML
     * response and do not run the React head tags.
     *
     * @param  array<string, mixed>  $page
     * @return array{title: string, description: string, url: string, image: string|null, image_width?: int, image_height?: int}|null
     */
    public static function fromPage(array $page): ?array
    {
        if (($page['component'] ?? null) === 'home') {
            return self::forHome();
        }

        if (($page['component'] ?? null) !== 'listings/show') {
            return null;
        }

        $listing = $page['props']['listing'] ?? null;

        if (! is_array($listing) || ! isset($listing['id']) || ! is_string($listing['title'] ?? null)) {
            return null;
        }

        return [
            'title' => $listing['title'],
            'description' => self::description($listing),
            'url' => route('listings.show', $listing['id']),
            'image' => self::coverUrl($listing),
        ];
    }

    /**
     * A wide capture of the landing hero. Without it, crawlers use the site icon as the preview image.
     *
     * @return array{title: string, description: string, url: string, image: string, image_width: int, image_height: int}
     */
    private static function forHome(): array
    {
        return [
            'title' => 'Rentas en Teziutlán',
            'description' => 'Encuentra o publica cuartos, departamentos y casas en renta en Teziutlán. Publicar en Radica es gratis.',
            'url' => route('home'),
            'image' => url('/images/og-home.png'),
            'image_width' => 1200,
            'image_height' => 600,
        ];
    }

    /**
     * Price and place only. The description and the phone stay out of the preview.
     *
     * @param  array<string, mixed>  $listing
     */
    private static function description(array $listing): string
    {
        $amount = is_numeric($listing['rent_amount'] ?? null) ? (int) $listing['rent_amount'] : 0;
        $zone = is_string($listing['zone'] ?? null) ? $listing['zone'] : '';
        $city = is_string($listing['city'] ?? null) ? $listing['city'] : '';
        $state = is_string($listing['state'] ?? null) ? $listing['state'] : '';

        return '$'.number_format($amount, 0)." / mes\n".$zone.', '.$city.', '.$state;
    }

    /**
     * @param  array<string, mixed>  $listing
     */
    private static function coverUrl(array $listing): ?string
    {
        $images = $listing['images'] ?? null;

        if (! is_array($images)) {
            return null;
        }

        $url = null;

        foreach ($images as $image) {
            if (! is_array($image) || ! is_string($image['url'] ?? null) || $image['url'] === '') {
                continue;
            }

            if (($image['is_cover'] ?? false) === true) {
                $url = $image['url'];

                break;
            }

            $url ??= $image['url'];
        }

        if ($url === null) {
            return null;
        }

        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        return url($url);
    }
}
