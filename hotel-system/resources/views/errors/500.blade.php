<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Server Error</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f8f9fa;
            color: #212529;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 640px;
            margin: 80px auto;
            padding: 24px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            text-align: center;
        }
        a {
            color: #0d6efd;
            text-decoration: none;
        }
        .actions {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>500 - Something went wrong</h1>
        <p>We hit a snag while processing your request. Please try again shortly.</p>
        <div class="actions">
            <a href="{{ url('/') }}">Go to dashboard</a>
        </div>
    </div>
</body>
</html>
