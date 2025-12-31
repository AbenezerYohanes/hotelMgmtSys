<script src="{{ asset('heaven/js/jquery-3.2.1.min.js') }}"></script>
<script src="{{ asset('heaven/js/jquery-migrate-3.0.0.js') }}"></script>
<script src="{{ asset('heaven/js/popper.min.js') }}"></script>
<script src="{{ asset('heaven/js/bootstrap.min.js') }}"></script>
<script src="{{ asset('heaven/js/owl.carousel.min.js') }}"></script>
<script src="{{ asset('heaven/js/jquery.waypoints.min.js') }}"></script>
<script src="{{ asset('heaven/js/jquery.stellar.min.js') }}"></script>
<script src="{{ asset('heaven/js/jquery.magnific-popup.min.js') }}"></script>
<script src="{{ asset('heaven/js/magnific-popup-options.js') }}"></script>
<script src="{{ asset('heaven/js/main.js') }}"></script>
<script>
    (function () {
        var body = document.body;
        var toggle = document.querySelector('[data-ihms-sidebar-toggle]');
        var overlay = document.querySelector('.ihms-sidebar-overlay');
        if (!toggle) {
            return;
        }

        var collapsedClass = 'ihms-sidebar-collapsed';
        var openClass = 'ihms-sidebar-open';
        var storageKey = 'ihms.sidebar.collapsed';

        if (localStorage.getItem(storageKey) === '1') {
            body.classList.add(collapsedClass);
        }

        toggle.addEventListener('click', function () {
            if (window.matchMedia('(max-width: 991.98px)').matches) {
                body.classList.toggle(openClass);
                return;
            }

            body.classList.toggle(collapsedClass);
            localStorage.setItem(storageKey, body.classList.contains(collapsedClass) ? '1' : '0');
        });

        if (overlay) {
            overlay.addEventListener('click', function () {
                body.classList.remove(openClass);
            });
        }
    })();
</script>
@stack('scripts')
