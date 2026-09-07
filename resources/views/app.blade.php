@php
    $seo = $page['props']['seo'] ?? [];
    $seoTitle = $seo['title'] ?? config('app.name', 'Loja de Carros');
    $seoDescription = $seo['description'] ?? 'Compre seu carro seminovo com procedência garantida e atendimento direto pelo WhatsApp.';
    $seoImage = $seo['image'] ?? asset('android-chrome-512x512.png');
    $seoType = $seo['type'] ?? 'website';
    $canonical = url()->current();
    $isNoIndex = request()->routeIs('admin.*') || request()->routeIs('login');
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ $seoTitle }}</title>

        @if ($isNoIndex)
            <meta name="robots" content="noindex, nofollow">
        @else
            <meta name="description" content="{{ $seoDescription }}">
            <link rel="canonical" href="{{ $canonical }}">

            <meta property="og:type" content="{{ $seoType }}">
            <meta property="og:title" content="{{ $seoTitle }}">
            <meta property="og:description" content="{{ $seoDescription }}">
            <meta property="og:url" content="{{ $canonical }}">
            <meta property="og:image" content="{{ $seoImage }}">
            <meta property="og:site_name" content="{{ config('app.name', 'Loja de Carros') }}">
            <meta property="og:locale" content="pt_BR">

            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="{{ $seoTitle }}">
            <meta name="twitter:description" content="{{ $seoDescription }}">
            <meta name="twitter:image" content="{{ $seoImage }}">

            @if (!empty($seo['jsonLd']))
                <script type="application/ld+json">{!! json_encode($seo['jsonLd'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
            @endif
        @endif

        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#0b0c0e">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
        @viteReactRefresh
        @vite(["resources/css/app.css", "resources/js/app.jsx"])
        @inertiaHead
    </head>
    <body class="font-manrope antialiased bg-dark-950 text-dark-50">
        @inertia
    </body>
</html>
