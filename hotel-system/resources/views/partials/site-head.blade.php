<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>@yield('title', config('app.name', 'Hotel System'))</title>

<link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700,900|Rubik:300,400,700" rel="stylesheet">

<link rel="stylesheet" href="{{ asset('heaven/css/bootstrap.css') }}">
<link rel="stylesheet" href="{{ asset('heaven/css/animate.css') }}">
<link rel="stylesheet" href="{{ asset('heaven/css/owl.carousel.min.css') }}">

<link rel="stylesheet" href="{{ asset('heaven/fonts/ionicons/css/ionicons.min.css') }}">
<link rel="stylesheet" href="{{ asset('heaven/fonts/fontawesome/css/font-awesome.min.css') }}">
<link rel="stylesheet" href="{{ asset('heaven/css/magnific-popup.css') }}">

<link rel="stylesheet" href="{{ asset('heaven/css/style.css') }}">
<link rel="stylesheet" href="{{ asset('heaven/css/ihms.css') }}">
@stack('styles')
