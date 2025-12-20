# Frontend Development Guide

This guide provides structure and templates for the remaining frontend SPAs (Receptionist, Admin, SuperAdmin).

## Structure Overview

All React SPAs follow a similar structure to the Staff dashboard:

```
frontend/[role]/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── App.css
    ├── index.js
    ├── index.css
    ├── context/
    │   └── AuthContext.js
    └── pages/
        ├── Login.js
        ├── Dashboard.js
        └── [other pages].js
```

## Receptionist Dashboard

### Key Features
- Guest management (view, search, update)
- Reservation management (create, update, check-in, check-out)
- Billing and payment processing
- Dashboard with today's check-ins/check-outs
- Room availability view

### Pages Needed
- `Login.js` - Authentication
- `Dashboard.js` - Overview with stats
- `Guests.js` - Guest list and management
- `Reservations.js` - Reservation management
- `CheckIn.js` - Check-in workflow
- `CheckOut.js` - Check-out workflow
- `Billing.js` - Billing and payments
- `Rooms.js` - Room availability

### API Endpoints Used
- `GET /api/v1/receptionists/dashboard` - Dashboard stats
- `GET /api/v1/guests` - List guests
- `GET /api/v1/reservations` - List reservations
- `POST /api/v1/reservations` - Create reservation
- `PUT /api/v1/reservations/:id/checkin` - Check-in
- `PUT /api/v1/reservations/:id/checkout` - Check-out
- `GET /api/v1/billing` - List billings
- `POST /api/v1/billing` - Create billing
- `PUT /api/v1/billing/:id/pay` - Process payment

## Admin Dashboard

### Key Features
- HR Management (employees, attendance, payroll, reviews)
- Hotel Management (rooms, reservations overview)
- Department management
- Leave request approval
- Performance review creation
- Analytics and reports

### Pages Needed
- `Login.js` - Authentication
- `Dashboard.js` - HR dashboard with stats
- `Employees.js` - Employee management
- `Attendance.js` - Attendance management
- `Leaves.js` - Leave request management
- `Payroll.js` - Payroll management
- `Reviews.js` - Performance reviews
- `Departments.js` - Department management
- `Rooms.js` - Room management
- `Reports.js` - Analytics and reports

### API Endpoints Used
- `GET /api/v1/admin/hr/dashboard` - HR dashboard stats
- `GET /api/v1/employees` - List employees
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/:id` - Update employee
- `POST /api/v1/admin/hr/attendance` - Create/update attendance
- `GET /api/v1/admin/hr/leaves` - List leave requests
- `PUT /api/v1/admin/hr/leaves/:id` - Approve/reject leave
- `POST /api/v1/admin/hr/payroll` - Create payroll
- `POST /api/v1/admin/hr/reviews` - Create performance review
- `GET /api/v1/admin/hr/departments` - List departments
- `POST /api/v1/admin/hr/departments` - Create department

## SuperAdmin Dashboard

### Key Features
- Multi-hotel management
- Role and permission management
- Global analytics
- System-wide employee management
- Hotel creation and management

### Pages Needed
- `Login.js` - Authentication
- `Dashboard.js` - Global analytics
- `Hotels.js` - Hotel management
- `Roles.js` - Role and permission management
- `Employees.js` - Global employee management
- `Analytics.js` - System-wide analytics

### API Endpoints Used
- `GET /api/v1/superadmin/analytics` - Global analytics
- `GET /api/v1/superadmin/hotels` - List hotels
- `POST /api/v1/superadmin/hotels` - Create hotel
- `PUT /api/v1/superadmin/hotels/:id` - Update hotel
- `DELETE /api/v1/superadmin/hotels/:id` - Delete hotel
- `GET /api/v1/superadmin/roles` - List roles
- `POST /api/v1/superadmin/roles` - Create role
- `PUT /api/v1/superadmin/roles/:id` - Update role

## Common Patterns

### Authentication Context
All SPAs use a similar `AuthContext` pattern:
- Token storage in localStorage
- Automatic token injection in axios headers
- User state management
- Login/logout functions

### API Configuration
Set `REACT_APP_API_URL` in `.env`:
```
REACT_APP_API_URL=http://localhost:4000/api/v1
```

### Routing
Use React Router for navigation:
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
```

### Private Routes
Protect routes with authentication:
```jsx
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};
```

## Next Steps

1. Copy the Staff dashboard structure
2. Update `AuthContext` to use correct login endpoint
3. Create role-specific pages
4. Implement CRUD operations for each entity
5. Add form validation
6. Style with CSS or Tailwind CSS
7. Add error handling and loading states
8. Implement real-time updates (optional, using Socket.io)

## Notes

- Each SPA runs on a different port to avoid conflicts
- All SPAs connect to the same backend API
- Role-based access is enforced by backend middleware
- Frontend should handle 401/403 errors gracefully
- Use consistent styling across all dashboards

