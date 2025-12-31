# Heaven Landing + Template Guide

## Overview
- Template assets live in `public/heaven` and are used globally.
- Shared UI pieces:
  - Head includes: `resources/views/partials/site-head.blade.php`
  - Header nav: `resources/views/partials/site-header.blade.php`
  - Footer: `resources/views/partials/site-footer.blade.php`
  - Scripts: `resources/views/partials/site-scripts.blade.php`
- Layouts using the template:
  - `resources/views/layouts/app.blade.php`
  - `resources/views/layouts/guest.blade.php`
  - `resources/views/welcome.blade.php`
- Pagination uses Bootstrap 4 markup via `Paginator::useBootstrap()` in `app/Providers/AppServiceProvider.php`.

## Quick Book Flow
1. The landing form posts to `route('quick-book')` for guests.
2. `app/Http/Controllers/LandingController.php`:
   - Validates booking search fields.
   - Creates a guest user (or signs in if the email already exists).
   - Redirects to `route('guest.bookings.search')` with the search criteria.
3. If the user is already authenticated, the form uses GET and goes straight to search.

## Navigation + CTAs
- Corner CTA is now Log In for guests and Dashboard for authenticated users.
- The hero "Book Now" button stays centered and:
  - links to `#quick-book` for guests
  - links to `route('guest.bookings.search')` for signed-in users
- Update nav items in `resources/views/partials/site-header.blade.php`.

## Sidebar Styling
- The navigation sidebar uses template styles via:
  - `resources/views/partials/sidebar.blade.php`
  - `public/heaven/css/ihms.css`

## Custom Styles
- Add app-specific overrides in `public/heaven/css/ihms.css`.
- Compatibility helpers (e.g., `.text-end`, `.gap-2`) also live there.

## Next Phase
- Convert admin/frontdesk/housekeeping pages to template section/cards.
- Replace Bootstrap 5-only utilities in module views.

## Sidebar + Dashboard (Phase 2)
- Sidebar groups are collapsible with icons in `resources/views/partials/sidebar.blade.php`.
- Dashboard layout uses a wider container via:
  - `@section('body-class', 'ihms-dashboard')`
  - `@section('container-class', 'container-fluid ihms-dashboard-container')`
- Module cards and chips are styled in `public/heaven/css/ihms.css` (`.ihms-module-card`, `.ihms-chip`).
