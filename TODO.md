# TODO: Make All Frontends Interactive

## Information Gathered
- All frontends (admin, guest, receptionist, staff, superadmin) have basic dashboards with data fetching and display.
- They lack interactive forms for CRUD operations (Create, Read, Update, Delete).
- Common components like Modal, Confirm, Table, ToastProvider are available in frontend/common/components.
- FRONTEND_GUIDE.md outlines the required pages and features for each role.
- Receptionist: Needs forms for reservations, guests, billing, check-in/out.
- Admin: Needs forms for employees, attendance, payroll, reviews, departments.
- Guest: Needs booking forms for rooms.
- Staff: Needs forms for attendance, leave requests, profile updates.
- Superadmin: Needs forms for hotels, roles, employees.

## Plan
## Receptionist Frontend
- [x] Update Reservations.js: Add form to create new reservations, edit existing ones using Modal.
- [x] Update Guests.js: Add form to add/edit guests.
- [x] Update Billing.js: Add form to create billings and process payments.
- [x] Update Rooms.js: Add availability toggle or management forms.
- [ ] Add routing for individual views (e.g., /reservations/:id, /guests/:id).

### Admin Frontend
- [x] Update Employees.js: Add form to add/edit employees.
- [x] Update Attendance.js: Add form to mark attendance.
- [ ] Update Payroll.js: Add form to create payroll entries.
- [ ] Update Reviews.js: Add form to create performance reviews.
- [ ] Update Departments.js: Add form to add/edit departments.
- [ ] Update Rooms.js: Add form to manage rooms.

### Guest Frontend
- [x] Update rooms.js: Add booking modal/form for selecting dates and booking rooms.
- [ ] Update dashboard.js: Add booking history and management.

### Staff Frontend
- [x] Update Attendance.js: Add form to clock in/out.
- [ ] Update Leaves.js: Add form to request leave.
- [ ] Update Profile.js: Add form to update profile.

### Superadmin Frontend
- [x] Update Hotels.js: Add form to create/edit hotels.
- [ ] Update Roles.js: Add form to create/edit roles.
- [ ] Update Employees.js: Add form to manage global employees.

## Dependent Files to be edited
- All page files in each frontend (e.g., frontend/receptionist/src/pages/*.js)
- Possibly update common components if needed.
- Ensure API calls are implemented in apiService.

## Followup Steps
- [ ] Test each frontend by running npm start in their directories.
- [ ] Verify API endpoints are working.
- [ ] Check for any missing dependencies or imports.
- [ ] Ensure forms have validation and error handling.
