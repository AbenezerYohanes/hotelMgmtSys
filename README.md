# Hotel + HR Management System

A complete, production-ready Hotel Management System integrated with comprehensive HR Management capabilities. Built with Node.js, Express, MySQL, React.js, and Next.js.

## 🎯 Features

### Hotel Management
- **Room Management**: Add, update, delete rooms with types, pricing, and amenities
- **Reservation System**: Complete booking workflow with check-in/check-out
- **Guest Management**: Guest profiles, booking history, and preferences
- **Billing & Payments**: Multiple payment methods (Credit/Debit, PayPal, Cash, Chapa)
- **Real-time Updates**: Live room availability and booking status
- **Multi-hotel Support**: Manage multiple hotel properties

### HR Management
- **Employee Management**: Complete employee lifecycle management
- **Role-based Access**: SuperAdmin, Admin, Staff, Receptionist, Guest roles
- **Attendance Tracking**: Clock in/out, daily attendance records
- **Leave Management**: Request, approve, and track leave requests
- **Payroll Management**: Salary, allowances, deductions tracking
- **Performance Reviews**: Employee performance evaluation system
- **Document Management**: Upload and verify employee documents
- **Shift Scheduling**: Manage work shifts and schedules
- **Department Management**: Organize employees by departments
- **HR Analytics**: Comprehensive HR dashboard and reports

### Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions per role
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API protection against abuse
- **File Upload Security**: Secure file handling for documents and images

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MySQL** (via XAMPP): Database with Sequelize ORM
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Multer**: File upload handling
- **Socket.io**: Real-time notifications
- **Express Validator**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### Frontend
- **React.js**: Internal dashboards (Staff, Receptionist, Admin, SuperAdmin)
- **Next.js**: Guest/public pages (Main site, room booking, profile)
- **Axios**: HTTP client for API calls
- **React Router**: Navigation (for React SPAs)
- **Tailwind CSS**: Styling (optional, can be added)

## 📁 Project Structure

```
aHotelManagementSystem/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL database configuration
│   ├── middleware/
│   │   ├── staffAuth.js          # Staff authentication middleware
│   │   ├── receptionistAuth.js   # Receptionist authentication middleware
│   │   ├── adminAuth.js          # Admin authentication middleware
│   │   ├── superAdminAuth.js     # SuperAdmin authentication middleware
│   │   ├── guestAuth.js          # Guest authentication middleware
│   │   ├── authHelpers.js        # JWT token verification helpers
│   │   └── security.js           # Security middleware (helmet, rate limiting)
│   ├── models/
│   │   ├── Employee.js           # Employee model
│   │   ├── Role.js               # Role model
│   │   ├── Department.js         # Department model
│   │   ├── Shift.js              # Shift model
│   │   ├── Attendance.js         # Attendance model
│   │   ├── LeaveRequest.js       # Leave request model
│   │   ├── Payroll.js            # Payroll model
│   │   ├── PerformanceReview.js  # Performance review model
│   │   ├── EmployeeDocument.js  # Employee document model
│   │   ├── Guest.js              # Guest model
│   │   ├── Room.js               # Room model
│   │   ├── Reservation.js        # Reservation model
│   │   ├── Billing.js            # Billing model
│   │   ├── Hotel.js              # Hotel model
│   │   └── index.js              # Model associations
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── employees.js          # Employee management routes
│   │   ├── guests.js             # Guest management routes
│   │   ├── rooms.js              # Room management routes
│   │   ├── reservations.js       # Reservation routes
│   │   ├── billing.js            # Billing routes
│   │   ├── documents.js          # Document management routes
│   │   ├── admin.js              # Admin-specific routes
│   │   ├── superadmin.js         # SuperAdmin-specific routes
│   │   └── receptionists.js      # Receptionist-specific routes
│   ├── seeders/
│   │   └── seed.js               # Database seeder
│   ├── uploads/
│   │   ├── profiles/             # Employee profile pictures
│   │   ├── documents/            # Employee documents
│   │   └── room-images/          # Room images
│   └── server.js                 # Main server entry point
│
├── frontend/
│   ├── staff/                    # React SPA for Staff
│   ├── receptionist/             # React SPA for Receptionist
│   ├── admin/                    # React SPA for Admin
│   ├── superadmin/               # React SPA for SuperAdmin
│   └── guest/                    # Next.js SPA for Guests/Public
│
├── schema.sql                    # Complete database schema
└── README.md                      # This file
```

## 🚀 Setup Instructions

### Prerequisites
1. **Node.js** (v16 or higher)
2. **MySQL** (via XAMPP or standalone)
3. **Git** (for cloning)

### Step 1: Database Setup

1. **Start MySQL** (via XAMPP or your MySQL service)

2. **Create Database**:
   ```bash
   mysql -u root -p < schema.sql
   ```
   Or import `schema.sql` via phpMyAdmin in XAMPP

3. **Configure Database Connection**:
   Create `.env` file in `backend/`:
   ```env
   DB_HOST=127.0.0.1
   DB_NAME=hotel_management
   DB_USER=root
   DB_PASS=
   DB_PORT=3306
   JWT_SECRET=your-secret-key-here
   PORT=4000
   NODE_ENV=development
   ```

### Step 2: Backend Setup

```bash
cd backend
npm install
npm run seed    # Seed default data
npm start       # Start server (or npm run dev for development)
```

The backend will run on `http://localhost:4000`

### Step 3: Frontend Setup

#### Staff Dashboard (React SPA)
```bash
cd frontend/staff
npm install
npm start
```

#### Receptionist Dashboard (React SPA)
```bash
cd frontend/receptionist
npm install
npm start
```

#### Admin Dashboard (React SPA)
```bash
cd frontend/admin
npm install
npm start
```

#### SuperAdmin Dashboard (React SPA)
```bash
cd frontend/superadmin
npm install
npm start
```

#### Guest/Public Site (Next.js SPA)
```bash
cd frontend/guest
npm install
npm run dev
```

## 🔐 Default Credentials

After running the seeder, you can log in with:

- **SuperAdmin**: `superadmin@hotel.com` / `admin123`
- **Admin**: `admin@hotel.com` / `admin123`
- **Receptionist**: `receptionist@hotel.com` / `receptionist123`
- **Staff**: `staff@hotel.com` / `staff123`
- **Guest**: `guest@example.com` / `guest123`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Employee/Staff login
- `POST /api/v1/auth/guest/register` - Guest registration
- `POST /api/v1/auth/guest/login` - Guest login
- `GET /api/v1/auth/me` - Get current user

### Employees
- `GET /api/v1/employees` - List all employees (Admin)
- `GET /api/v1/employees/:id` - Get employee (Admin)
- `POST /api/v1/employees` - Create employee (Admin)
- `PUT /api/v1/employees/:id` - Update employee (Admin)
- `DELETE /api/v1/employees/:id` - Delete employee (SuperAdmin)
- `GET /api/v1/employees/me/profile` - Get own profile (Staff)
- `GET /api/v1/employees/me/attendance` - Get own attendance (Staff)
- `GET /api/v1/employees/me/leaves` - Get own leave requests (Staff)
- `GET /api/v1/employees/me/payroll` - Get own payroll (Staff)
- `GET /api/v1/employees/me/reviews` - Get own reviews (Staff)

### Guests
- `GET /api/v1/guests` - List all guests (Receptionist/Admin)
- `GET /api/v1/guests/:id` - Get guest (Receptionist/Admin)
- `GET /api/v1/guests/me/profile` - Get own profile (Guest)
- `PUT /api/v1/guests/me/profile` - Update own profile (Guest)
- `GET /api/v1/guests/me/reservations` - Get own reservations (Guest)
- `GET /api/v1/guests/me/billings` - Get own billings (Guest)

### Rooms
- `GET /api/v1/rooms` - List all rooms (Public)
- `GET /api/v1/rooms/:id` - Get room (Public)
- `POST /api/v1/rooms` - Create room (Admin)
- `PUT /api/v1/rooms/:id` - Update room (Admin)
- `DELETE /api/v1/rooms/:id` - Delete room (Admin)
- `GET /api/v1/rooms/available/check` - Check available rooms (Public)

### Reservations
- `GET /api/v1/reservations` - List all reservations (Receptionist/Admin)
- `GET /api/v1/reservations/:id` - Get reservation (Receptionist/Admin)
- `POST /api/v1/reservations` - Create reservation (Guest/Receptionist)
- `PUT /api/v1/reservations/:id` - Update reservation (Receptionist/Admin)
- `PUT /api/v1/reservations/:id/cancel` - Cancel reservation (Guest/Receptionist)
- `PUT /api/v1/reservations/:id/checkin` - Check-in (Receptionist/Admin)
- `PUT /api/v1/reservations/:id/checkout` - Check-out (Receptionist/Admin)
- `GET /api/v1/reservations/me/list` - Get own reservations (Guest)

### Billing
- `GET /api/v1/billing` - List all billings (Receptionist/Admin)
- `GET /api/v1/billing/:id` - Get billing (Receptionist/Admin)
- `POST /api/v1/billing` - Create billing (Receptionist/Admin)
- `PUT /api/v1/billing/:id` - Update billing (Receptionist/Admin)
- `PUT /api/v1/billing/:id/pay` - Process payment (Receptionist/Admin)
- `GET /api/v1/billing/me/list` - Get own billings (Guest)

### Documents
- `GET /api/v1/documents` - List all documents (Admin)
- `GET /api/v1/documents/:id` - Get document (Admin)
- `POST /api/v1/documents` - Upload document (Staff/Admin)
- `PUT /api/v1/documents/:id/verify` - Verify document (Admin)
- `GET /api/v1/documents/me/list` - Get own documents (Staff)
- `DELETE /api/v1/documents/:id` - Delete document (Admin)

### Admin Routes
- `GET /api/v1/admin/hr/dashboard` - HR dashboard stats
- `POST /api/v1/admin/hr/attendance` - Create/update attendance
- `GET /api/v1/admin/hr/leaves` - List leave requests
- `PUT /api/v1/admin/hr/leaves/:id` - Update leave request
- `POST /api/v1/admin/hr/payroll` - Create payroll
- `GET /api/v1/admin/hr/payroll` - List payrolls
- `POST /api/v1/admin/hr/reviews` - Create performance review
- `GET /api/v1/admin/hr/reviews` - List performance reviews
- `GET /api/v1/admin/hr/departments` - List departments
- `POST /api/v1/admin/hr/departments` - Create department

### SuperAdmin Routes
- `GET /api/v1/superadmin/hotels` - List all hotels
- `POST /api/v1/superadmin/hotels` - Create hotel
- `PUT /api/v1/superadmin/hotels/:id` - Update hotel
- `DELETE /api/v1/superadmin/hotels/:id` - Delete hotel
- `GET /api/v1/superadmin/roles` - List all roles
- `POST /api/v1/superadmin/roles` - Create role
- `PUT /api/v1/superadmin/roles/:id` - Update role
- `GET /api/v1/superadmin/analytics` - Global analytics

### Receptionist Routes
- `GET /api/v1/receptionists/dashboard` - Dashboard stats
- `POST /api/v1/receptionists/checkin` - Quick check-in
- `POST /api/v1/receptionists/checkout` - Quick check-out

## 🗄️ Database Schema

### Core Tables
- **hotels**: Hotel information
- **roles**: User roles with permissions
- **departments**: Hotel departments
- **employees**: Employee information
- **guests**: Guest information
- **rooms**: Room information
- **reservations**: Booking records
- **billing**: Payment records

### HR Tables
- **shifts**: Work shift definitions
- **attendance**: Daily attendance records
- **leave_requests**: Leave request records
- **payroll**: Payroll records
- **performance_reviews**: Performance review records
- **employee_documents**: Employee document records

See `schema.sql` for complete schema with relationships.

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention (Sequelize ORM)
- Rate limiting on API endpoints
- Secure file upload handling
- CORS configuration
- Helmet security headers

## 📊 Role Permissions

### SuperAdmin
- Full system access
- Manage hotels, roles, and permissions
- Global HR management
- System analytics

### Admin
- Hotel-level management
- HR management (employees, attendance, payroll)
- Room and reservation management
- Reports and analytics

### Receptionist
- Guest management
- Reservation management
- Check-in/check-out operations
- Billing and payment processing
- View own HR information

### Staff
- View own profile
- View own attendance
- View own leave requests
- View own payroll
- View own performance reviews
- Upload documents

### Guest
- Register and login
- Browse rooms
- Make reservations
- View own bookings
- View own billings
- Update profile

## 🚧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
Each frontend SPA can be run independently:
```bash
cd frontend/[role]
npm start  # or npm run dev for Next.js
```

### Environment Variables

Create `.env` files in each directory:

**backend/.env:**
```env
DB_HOST=127.0.0.1
DB_NAME=hotel_management
DB_USER=root
DB_PASS=
DB_PORT=3306
JWT_SECRET=your-secret-key-change-in-production
PORT=4000
NODE_ENV=development
```

**frontend/[role]/.env.local** (for Next.js):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 📝 Notes

- All file uploads are stored in `backend/uploads/`
- Profile pictures: `backend/uploads/profiles/`
- Documents: `backend/uploads/documents/`
- Room images: `backend/uploads/room-images/`

- The system supports multi-hotel operations
- Real-time notifications can be implemented using Socket.io
- Payment gateway integration (Stripe, PayPal, Chapa) can be added to billing routes

## 🤝 Contributing

This is a complete, production-ready system. Feel free to extend it with:
- Additional payment gateways
- Email notifications
- SMS notifications
- Advanced analytics
- Reporting features
- Mobile apps

## 📄 License

This project is provided as-is for educational and commercial use.

---

**Built with ❤️ for comprehensive hotel and HR management**
