# Hotel & HR Management System - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Installation & Setup](#installation--setup)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Frontend Structure](#frontend-structure)
9. [Authentication & Authorization](#authentication--authorization)
10. [Payment Integration](#payment-integration)
11. [Configuration](#configuration)
12. [Usage Guide](#usage-guide)
13. [Development](#development)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Contributing](#contributing)
17. [Troubleshooting](#troubleshooting)
18. [License](#license)

## 🎯 Project Overview

The Hotel & HR Management System is a comprehensive full-stack application designed to manage hotel operations and human resources. Built with modern web technologies, it provides a complete solution for hotel management including booking management, room management, guest management, payment processing, employee management, and advanced analytics.

### Key Capabilities

- **Multi-role System**: Super Admin, Admin, Manager, Staff, and Client roles
- **Real-time Operations**: Live booking management and availability tracking
- **Payment Processing**: Integrated Stripe and Chapa payment gateways
- **Dynamic Pricing**: Seasonal and demand-based pricing system
- **HR Management**: Complete employee lifecycle management
- **Analytics & Reporting**: Comprehensive business intelligence
- **Mobile Responsive**: Works across all devices

## ✨ Features

### 🏨 Core Hotel Management

#### Booking Management

- Real-time room availability checking
- Online booking system for clients
- Booking status tracking (pending, confirmed, checked-in, checked-out)
- Automated conflict prevention
- Booking history and analytics

#### Room Management

- Multiple room types (Single, Double, Suite, Family)
- Dynamic inventory management
- Room status tracking (Available, Occupied, Maintenance)
- Amenities management with JSON configuration
- Room pricing and availability calendar

#### Guest Management

- Comprehensive guest profiles
- Guest preferences and loyalty programs
- Booking history tracking
- Guest communication system
- Demographics and analytics

#### Cabin Management

- Mountain View, Lake View, Forest, and Luxury cabins
- Location-based management
- Capacity and pricing management
- Availability calendar
- Amenity customization

### 💳 Payment & Financial Management

#### Payment Gateway Integration

- **Stripe Integration**: Credit/Debit cards, digital wallets
- **Chapa Integration**: Local payment methods
- **Multi-currency Support**: USD, ETB, and more
- **Payment Analytics**: Transaction tracking and reporting
- **Refund Management**: Automated refund processing

#### Financial Reporting

- Revenue analytics by period
- Payment method breakdown
- Occupancy rate calculations
- Profit margin analysis
- Financial forecasting

### 👥 Human Resources Management

#### Employee Management

- Employee profiles and information
- Department organization
- Role-based access control
- Performance tracking
- Training records

#### Attendance & Payroll

- Daily attendance tracking
- Shift management (Morning, Evening, Night, Weekend)
- Automated payroll calculation
- Overtime tracking
- Salary management

#### Department Management

- Hierarchical department structure
- Manager assignments
- Department performance metrics
- Resource allocation

### 📊 Analytics & Reporting

#### Dashboard Analytics

- Real-time metrics and KPIs
- Interactive charts and graphs
- Custom date range filtering
- Export capabilities

#### Business Intelligence

- Revenue trends and forecasting
- Occupancy rate analysis
- Guest demographics
- Employee performance metrics
- Payment gateway analytics

### 🔐 Security & Access Control

#### Authentication System

- JWT-based authentication
- Secure password hashing (bcrypt)
- Session management
- Password reset functionality

#### Role-Based Access Control (RBAC)

- **Super Admin**: Full system access, user management
- **Admin**: Hotel operations management
- **Manager**: Department oversight
- **Staff**: Operational tasks
- **Client**: Booking and profile management

#### Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- Audit logging

### 🔔 Notification System

#### Real-time Notifications

- Booking confirmations
- Payment updates
- System alerts
- Maintenance notifications
- Priority-based messaging

#### Communication Channels

- In-app notifications
- Email notifications
- SMS integration (future)
- Push notifications (future)

## 🛠 Tech Stack

### Backend

```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "mongoose",
  "authentication": "JWT (jsonwebtoken)",
  "password_hashing": "bcryptjs",
  "validation": "express-validator, Joi",
  "file_upload": "multer",
  "logging": "Winston",
  "payment_stripe": "@stripe/stripe-js",
  "payment_chapa": "chapa",
  "email": "nodemailer",
  "cors": "cors",
  "security": "helmet",
  "compression": "compression",
  "rate_limiting": "express-rate-limit"
}
```

### Frontend

```json
{
  "framework": "React.js",
  "routing": "React Router DOM",
  "styling": "Tailwind CSS",
  "ui_components": "Material-UI, Lucide React",
  "forms": "React Hook Form",
  "validation": "Zod",
  "http_client": "Axios",
  "notifications": "React Hot Toast",
  "charts": "Recharts",
  "tables": "React Table",
  "animations": "Framer Motion",
  "date_handling": "date-fns"
}
```

### Development Tools

```json
{
  "version_control": "Git",
  "package_manager": "npm",
  "process_manager": "PM2 (production)",
  "testing": "Jest, React Testing Library",
  "linting": "ESLint",
  "code_formatting": "Prettier",
  "database_migration": "Custom scripts"
}
```

## 🏗 System Architecture

### Application Structure

```
hotel-management-system/
├── server/                          # Backend application
│   ├── database/                   # Database configuration
│   │   ├── config.js              # Database connection
│   │   ├── mongo.js               # MongoDB connection (optional)
│   │   └── archive/schema.sql     # Database schema
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                # Authentication middleware
│   │   ├── audit.js               # Audit logging
│   │   ├── errorHandler.js        # Error handling
│   │   ├── logger.js              # Request logging
│   │   └── rbac.js                # Role-based access control
│   ├── models/                    # Data models
│   │   ├── Booking.js
│   │   ├── Employee.js
│   │   ├── Hotel.js
│   │   ├── Payment.js
│   │   ├── Room.js
│   │   ├── RoomType.js
│   │   ├── User.js
│   │   └── ...
│   ├── routes/                    # API routes
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── cabins.js
│   │   ├── employees.js
│   │   ├── guests.js
│   │   ├── hr.js
│   │   ├── notifications.js
│   │   ├── payments.js
│   │   ├── pricing.js
│   │   ├── reports.js
│   │   ├── rooms.js
│   │   ├── stripe.js
│   │   ├── uploads.js
│   │   └── users.js
│   ├── services/                  # Business logic services
│   │   ├── chapaService.js
│   │   └── ...
│   ├── scripts/                   # Utility scripts
│   ├── uploads/                   # File uploads directory
│   ├── logs/                      # Application logs
│   ├── index.js                   # Server entry point
│   └── package.json
├── client/                         # Frontend application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── Cards/
│   │   │   ├── Carousel/
│   │   │   ├── Copyright/
│   │   │   ├── Footer/
│   │   │   ├── Layout.jsx
│   │   │   └── Payments/
│   │   ├── contexts/              # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── About/
│   │   │   ├── AdminManagement.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── ClientBooking.jsx
│   │   │   ├── ClientHome.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeDetail.jsx
│   │   │   ├── Guests.jsx
│   │   │   ├── HR.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── PriceTracking.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── SuperAdminDashboard.jsx
│   │   │   └── Users.jsx
│   │   ├── services/              # API services
│   │   │   ├── api.jsx
│   │   │   ├── apiClient.js
│   │   │   ├── auth.js
│   │   │   ├── hr.js
│   │   │   └── rooms.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.jsx
│   └── package.json
├── setup-scripts/                  # Setup utilities
├── documentation/                  # Project documentation
└── package.json                    # Root package.json
```

### Database Architecture

```
MySQL Database: hotel_management
├── users                     # System users and authentication
├── hotels                    # Hotel properties
├── rooms                     # Room inventory
├── room_types               # Room categories
├── bookings                 # Reservation records
├── guests                   # Guest information
├── employees                # Staff information
├── departments              # Organizational structure
├── payments                 # Payment transactions
├── attendance               # Daily attendance
├── payroll                  # Salary records
├── audit_logs               # System audit trail
├── admin_privileges         # Role permissions
├── staff_documents          # Employee documents
├── invoices                 # Booking invoices
└── notifications            # System notifications
```

## 🚀 Installation & Setup

### Prerequisites

#### System Requirements

- **Node.js**: v14.0.0 or higher
- **MySQL**: v5.7 or higher (or XAMPP)
- **npm**: v6.0.0 or higher
- **Git**: Latest version

#### Development Environment

- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Memory**: Minimum 4GB RAM
- **Storage**: 500MB free space

### Quick Start

#### 1. Clone Repository

```bash
git clone <repository-url>
cd hotel-management-system
```

#### 2. Environment Setup

**Backend Configuration:**

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=hotel_management
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=10485760
```

**Frontend Configuration:**
The frontend uses a proxy to the backend, configured in `client/package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

#### 3. Database Setup

**Using XAMPP (Recommended for Windows):**

```bash
# Start XAMPP MySQL service
# Then run setup script
setup-xampp.bat
```

**Using Direct MySQL:**

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE hotel_management;"

# Run setup script
./setup-mysql.sh
```

**Manual Database Setup:**

```bash
# Apply schema
mysql -u your_user -p hotel_management < server/database/archive/schema.sql
```

#### 4. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

#### 5. Start Development Servers

**Option A: Start Both Servers (Recommended)**

```bash
# From project root
npm run dev
```

**Option B: Start Separately**

**Backend:**

```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

**Frontend:**

```bash
cd client
npm start
# Client will start on http://localhost:3000
```

#### 6. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Default Credentials

After setup, login with:

- **Super Admin**: `superadmin@hotel.com` / `superadmin123`
- **Admin**: `admin@hotel.com` / `admin123`

## 🗄 Database Schema

### Core Tables

#### users

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    role ENUM('super_admin','admin','manager','staff','client') DEFAULT 'client',
    privileges JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

#### hotels

```sql
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    address VARCHAR(255),
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

#### rooms

```sql
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    inventory INT DEFAULT 1,
    amenities JSON,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);
```

#### bookings

```sql
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    nights INT NOT NULL,
    status ENUM('pending','confirmed','cancelled','checked_in','checked_out') DEFAULT 'pending',
    stripe_payment_intent VARCHAR(100),
    payment_status ENUM('pending','succeeded','refunded') DEFAULT 'pending',
    receipt_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Additional Tables

#### employees

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    title VARCHAR(100),
    salary DECIMAL(10,2),
    status ENUM('active','on_leave','terminated') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL
);
```

#### payments

```sql
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);
```

#### audit_logs

```sql
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(100) NOT NULL,
    performed_by INT NOT NULL,
    target_id INT,
    meta JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE CASCADE
);
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "client"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "client"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login

Authenticate user and return JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Booking Endpoints

#### GET /api/bookings

Get all bookings (admin) or user bookings (client).

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `start_date`: Filter by check-in date
- `end_date`: Filter by check-out date

#### POST /api/bookings

Create a new booking.

**Request Body:**

```json
{
  "hotel_id": 1,
  "room_id": 1,
  "check_in_date": "2024-12-01",
  "check_out_date": "2024-12-03",
  "guests": 2,
  "special_requests": "Late check-in requested"
}
```

#### PUT /api/bookings/:id

Update booking information.

#### DELETE /api/bookings/:id

Cancel a booking.

### Room Management Endpoints

#### GET /api/rooms

Get all rooms with availability.

**Query Parameters:**

- `hotel_id`: Filter by hotel
- `type`: Filter by room type
- `status`: Filter by availability status
- `check_in`: Check availability from date
- `check_out`: Check availability to date

#### POST /api/rooms

Add a new room.

**Request Body:**

```json
{
  "hotel_id": 1,
  "title": "Deluxe Suite",
  "type": "Suite",
  "price_per_night": 250.0,
  "inventory": 5,
  "amenities": ["WiFi", "TV", "Mini Bar", "Balcony"],
  "description": "Spacious suite with city view"
}
```

### Payment Endpoints

#### POST /api/stripe/create-checkout-session

Create Stripe checkout session.

**Request Body:**

```json
{
  "booking_id": 1,
  "amount": 500.0,
  "currency": "usd",
  "success_url": "http://localhost:3000/payment/success",
  "cancel_url": "http://localhost:3000/payment/cancel"
}
```

#### POST /api/stripe/webhook

Handle Stripe webhooks (server-side only).

### HR Management Endpoints

#### GET /api/hr/employees

Get all employees.

#### POST /api/hr/employees

Add new employee.

**Request Body:**

```json
{
  "hotel_id": 1,
  "name": "Jane Smith",
  "department": "Housekeeping",
  "title": "Housekeeping Supervisor",
  "salary": 35000.0,
  "email": "jane@hotel.com",
  "phone": "+1234567890"
}
```

### Analytics Endpoints

#### GET /api/reports/dashboard

Get dashboard statistics.

**Response:**

```json
{
  "total_bookings": 150,
  "total_revenue": 45000.0,
  "occupancy_rate": 85.5,
  "total_guests": 320,
  "monthly_revenue": [
    { "month": "2024-01", "revenue": 35000.0 },
    { "month": "2024-02", "revenue": 42000.0 }
  ]
}
```

#### GET /api/reports/revenue

Get revenue analytics.

**Query Parameters:**

- `period`: "month", "quarter", "year"
- `start_date`: Start date for custom range
- `end_date`: End date for custom range

## 🎨 Frontend Structure

### Component Architecture

#### Layout Components

- **Layout.jsx**: Main application layout with navigation
- **Header**: Top navigation bar with user menu
- **Sidebar**: Role-based navigation menu
- **Footer**: Application footer

#### Page Components

**Authentication Pages:**

- **Login.jsx**: User authentication
- **Register.jsx**: New user registration
- **Landing.jsx**: Public landing page

**Admin Pages:**

- **SuperAdminDashboard.jsx**: System overview for super admins
- **AdminManagement.jsx**: User and role management
- **Dashboard.jsx**: Administrative dashboard
- **Users.jsx**: User management interface

**Operational Pages:**

- **Bookings.jsx**: Booking management
- **Rooms.jsx**: Room inventory management
- **Guests.jsx**: Guest information management
- **HR.jsx**: Human resources dashboard
- **EmployeeDetail.jsx**: Individual employee profile
- **Payments.jsx**: Payment processing and history
- **Reports.jsx**: Analytics and reporting

**Client Pages:**

- **ClientHome.jsx**: Customer dashboard
- **ClientBooking.jsx**: Booking interface for customers
- **ClientProfile.jsx**: Customer profile management
- **ClientBookings.jsx**: Customer booking history

### State Management

#### AuthContext

Centralized authentication state management.

```jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication methods
  const login = async (credentials) => { ... };
  const logout = async () => { ... };
  const register = async (userData) => { ... };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Routing Structure

```jsx
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin"
          element={
            <SuperAdminRoute>
              <Layout />
            </SuperAdminRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="admins" element={<AdminManagement />} />
          {/* ... other super admin routes */}
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* ... other admin routes */}
        </Route>

        {/* Client Routes */}
        <Route
          path="/client"
          element={
            <ClientRoute>
              <ClientHome />
            </ClientRoute>
          }
        >
          {/* ... client routes */}
        </Route>
      </Routes>
    </AuthProvider>
  );
};
```

## 🔐 Authentication & Authorization

### JWT Authentication Flow

1. **Registration/Login**: User credentials validated
2. **Token Generation**: JWT created with user info and expiration
3. **Token Storage**: Stored in localStorage/sessionStorage
4. **Request Authorization**: Token included in Authorization header
5. **Token Validation**: Server validates token on protected routes
6. **Token Refresh**: Automatic token refresh before expiration

### Role-Based Access Control

#### User Roles Hierarchy

```
Super Admin (super_admin)
├── Full system access
├── User management across all hotels
├── System configuration
└── Audit logging

Admin (admin)
├── Hotel-specific management
├── Staff management
├── Financial operations
└── Reporting

Manager (manager)
├── Department oversight
├── Team management
├── Operational decisions
└── Limited reporting

Staff (staff)
├── Operational tasks
├── Guest services
├── Basic reporting
└── Limited data access

Client (client)
├── Personal bookings
├── Profile management
├── Booking history
└── Payment management
```

#### Permission System

```javascript
const permissions = {
  super_admin: {
    manage_hotels: true,
    manage_admins: true,
    manage_rooms: true,
    manage_hr: true,
    process_refunds: true,
    view_audit_logs: true,
  },
  admin: {
    manage_rooms: true,
    manage_bookings: true,
    manage_staff: true,
    view_reports: true,
    process_payments: true,
  },
  // ... other roles
};
```

## 💳 Payment Integration

### Stripe Integration

#### Payment Flow

1. **Create PaymentIntent**: Server creates Stripe PaymentIntent
2. **Client Confirmation**: Frontend collects payment method
3. **Payment Processing**: Stripe processes the payment
4. **Webhook Handling**: Server receives payment confirmation
5. **Database Update**: Booking and payment status updated

#### Stripe Configuration

```javascript
// Frontend - Stripe Provider
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>;
```

```javascript
// Backend - Payment Intent Creation
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentIntent = await stripe.paymentIntents.create({
  amount: amount * 100, // Convert to cents
  currency: "usd",
  metadata: { booking_id: bookingId },
});
```

### Chapa Integration

#### Ethiopian Payment Gateway

- Local payment methods
- Mobile money integration
- Bank transfer support
- Currency: ETB (Ethiopian Birr)

## ⚙ Configuration

### Environment Variables

#### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_USER=hotel_user
DB_PASSWORD=secure_password
DB_NAME=hotel_management
DB_PORT=3306

# JWT
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=app-specific-password

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=12

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

#### Frontend (Environment)

```javascript
// .env.local
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Database Configuration

#### mongoose Connection

```javascript
const mongoose = require("mongoose");

const pool = mongoose.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

#### Connection Options

- **Connection Pooling**: Efficient connection management
- **SSL**: Encrypted connections for production
- **Timeout Settings**: Connection and query timeouts
- **Retry Logic**: Automatic reconnection on failure

## 📖 Usage Guide

### For Super Administrators

#### System Setup

1. **Initial Login**: Use default super admin credentials
2. **Create Hotels**: Add hotel properties to the system
3. **Configure Admins**: Create admin accounts for each hotel
4. **Set Permissions**: Configure role-based access controls

#### System Monitoring

1. **Dashboard Overview**: Monitor system-wide metrics
2. **User Management**: View all users across hotels
3. **Audit Logs**: Review system activities
4. **System Settings**: Configure global settings

### For Hotel Administrators

#### Daily Operations

1. **Check Dashboard**: Review daily metrics and alerts
2. **Manage Bookings**: Process reservations and check-ins
3. **Room Management**: Update room status and availability
4. **Staff Management**: Assign shifts and track attendance

#### Financial Management

1. **Payment Processing**: Handle guest payments
2. **Revenue Tracking**: Monitor daily/monthly revenue
3. **Expense Management**: Track operational costs
4. **Financial Reports**: Generate profit/loss statements

### For Staff Members

#### Guest Services

1. **Check-in Process**: Verify reservations and process arrivals
2. **Room Assignments**: Assign rooms based on preferences
3. **Guest Requests**: Handle special requests and amenities
4. **Check-out Process**: Process departures and final billing

#### Operational Tasks

1. **Room Maintenance**: Report and track maintenance issues
2. **Inventory Management**: Monitor supplies and amenities
3. **Shift Management**: Clock in/out and manage schedules

### For Clients

#### Making Reservations

1. **Browse Availability**: Check room availability and rates
2. **Select Dates**: Choose check-in and check-out dates
3. **Choose Room**: Select room type and preferences
4. **Payment**: Complete secure payment process

#### Account Management

1. **Profile Updates**: Manage personal information
2. **Booking History**: View past and upcoming reservations
3. **Payment Methods**: Save payment information
4. **Preferences**: Set booking preferences

## 💻 Development

### Development Workflow

#### Code Standards

```json
// .eslintrc.js
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Code review and merge
git checkout main
git pull origin main
git merge feature/new-feature
```

### API Development

#### Route Structure

```javascript
// routes/bookings.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const bookingController = require("../controllers/bookingController");

// Public routes
router.get("/availability", bookingController.checkAvailability);

// Protected routes
router.use(authenticateToken);
router.get("/", bookingController.getBookings);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
```

#### Controller Pattern

```javascript
// controllers/bookingController.js
const bookingService = require("../services/bookingService");

const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const bookings = await bookingService.getBookings({ page, limit });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const booking = await bookingService.createBooking(
      bookingData,
      req.user.id
    );
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### Frontend Development

#### Component Structure

```jsx
// components/BookingsTable.jsx
import React, { useState, useEffect } from "react";
import { bookingsService } from "../services/api";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return <div className="bookings-table">{/* Table implementation */}</div>;
};

export default BookingsTable;
```

#### Custom Hooks

```jsx
// hooks/useBookings.js
import { useState, useEffect } from "react";
import { bookingsService } from "../services/api";

export const useBookings = (filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsService.getBookings(filters);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  return { bookings, loading, error, refetch: fetchBookings };
};
```

## 🧪 Testing

### Backend Testing

#### Unit Tests

```javascript
// tests/controllers/bookingController.test.js
const bookingController = require("../../controllers/bookingController");
const bookingService = require("../../services/bookingService");

jest.mock("../../services/bookingService");

describe("Booking Controller", () => {
  describe("getBookings", () => {
    it("should return bookings with pagination", async () => {
      const mockBookings = [{ id: 1, guest_name: "John Doe" }];
      bookingService.getBookings.mockResolvedValue(mockBookings);

      const req = { query: { page: 1, limit: 10 } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await bookingController.getBookings(req, res);

      expect(res.json).toHaveBeenCalledWith(mockBookings);
    });
  });
});
```

#### Integration Tests

```javascript
// tests/routes/auth.test.js
const request = require("supertest");
const app = require("../../index");
const User = require("../../models/User");

describe("Auth Routes", () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        first_name: "Test",
        last_name: "User",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("id");
    });
  });
});
```

### Frontend Testing

#### Component Tests

```jsx
// src/components/__tests__/LoginForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { AuthContext } from '../../contexts/AuthContext';

const mockLogin = jest.fn();

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginForm />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  it('renders login form', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits form with valid
```
