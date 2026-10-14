<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

        @php
            $openGraph = \App\Support\ListingOpenGraph::fromPage($page);
        @endphp
        @if ($openGraph)
            <meta property="og:type" content="website">
            <meta property="og:locale" content="es_MX">
            <meta property="og:site_name" content="{{ config('app.name') }}">
            <meta property="og:title" content="{{ $openGraph['title'] }}">
            <meta property="og:description" content="{{ $openGraph['description'] }}">
            <meta property="og:url" content="{{ $openGraph['url'] }}">
            @if ($openGraph['image'])
                <meta property="og:image" content="{{ $openGraph['image'] }}">
                @if (! empty($openGraph['image_width']) && ! empty($openGraph['image_height']))
                    <meta property="og:image:width" content="{{ $openGraph['image_width'] }}">
                    <meta property="og:image:height" content="{{ $openGraph['image_height'] }}">
                @endif
            @endif
        @endif

        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
