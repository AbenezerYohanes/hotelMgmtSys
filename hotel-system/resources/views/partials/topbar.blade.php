<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="{{ url('/') }}">{{ config('app.name', 'Hotel System') }}</a>
        <div class="ms-auto d-flex align-items-center">
            <div class="text-white-50 text-end me-3">
                <div>{{ auth()->user()->name }}</div>
                <small>
                    {{ auth()->user()->getRoleNames()->implode(', ') ?: 'User' }}
                </small>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button class="btn btn-outline-light btn-sm" type="submit">Sign out</button>
            </form>
        </div>
    </div>
</nav>
