<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Invoice')</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #212529;
            margin: 32px;
        }
        h1, h2, h3 {
            margin: 0;
        }
        .text-muted {
            color: #6c757d;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }
        .table th,
        .table td {
            border: 1px solid #dee2e6;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background: #f8f9fa;
        }
        .text-end {
            text-align: right;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 12px;
        }
        .badge-paid {
            background: #198754;
            color: #fff;
        }
        .badge-partial {
            background: #ffc107;
            color: #212529;
        }
        .badge-unpaid {
            background: #6c757d;
            color: #fff;
        }
        .no-print {
            margin-bottom: 16px;
        }
        @media print {
            .no-print {
                display: none;
            }
            body {
                margin: 0;
            }
        }
    </style>
</head>
<body>
    @yield('content')
</body>
</html>
