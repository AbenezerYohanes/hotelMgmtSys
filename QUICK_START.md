# Quick Start Guide

## 🚀 Complete Setup in 5 Steps

### Step 1: Database Setup
```bash
# Start MySQL (XAMPP or standalone MySQL service)
# Then import the schema:

# Option A: Using MySQL command line
mysql -u root -p < schema.sql

# Option B: Using phpMyAdmin (XAMPP)
# 1. Open phpMyAdmin (http://localhost/phpmyadmin)
# 2. Create new database: hotel_management
# 3. Import schema.sql file
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "DB_HOST=127.0.0.1
DB_NAME=hotel_management
DB_USER=root
DB_PASS=
DB_PORT=3306
JWT_SECRET=your-secret-key-change-in-production
PORT=4000
NODE_ENV=development" > .env

# Seed database with default data
npm run seed

# Start backend server
npm start
# Server will run on http://localhost:4000
```

### Step 3: Frontend Setup

#### Staff Dashboard
```bash
cd frontend/staff
npm install
echo "REACT_APP_API_URL=http://localhost:4000/api/v1" > .env
npm start
# Runs on http://localhost:3000
```

#### Receptionist Dashboard
```bash
cd frontend/receptionist
npm install
echo "REACT_APP_API_URL=http://localhost:4000/api/v1" > .env
npm start
# Runs on http://localhost:3000 (change port if needed)
```

#### Admin Dashboard
```bash
cd frontend/admin
npm install
echo "REACT_APP_API_URL=http://localhost:4000/api/v1" > .env
npm start
# Runs on http://localhost:3000 (change port if needed)
```

#### SuperAdmin Dashboard
```bash
cd frontend/superadmin
npm install
echo "REACT_APP_API_URL=http://localhost:4000/api/v1" > .env
npm start
# Runs on http://localhost:3000 (change port if needed)
```

#### Guest Portal (Next.js)
```bash
cd frontend/guest
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local
npm run dev
# Runs on http://localhost:3000
```

### Step 4: Test Login

Use these default credentials (created by seeder):

- **SuperAdmin**: `superadmin@hotel.com` / `admin123`
- **Admin**: `admin@hotel.com` / `admin123`
- **Receptionist**: `receptionist@hotel.com` / `receptionist123`
- **Staff**: `staff@hotel.com` / `staff123`
- **Guest**: `guest@example.com` / `guest123`

### Step 5: Verify Everything Works

1. ✅ Backend API: http://localhost:4000/api/v1/health
2. ✅ Staff Dashboard: Login and view profile
3. ✅ Receptionist Dashboard: View guests and reservations
4. ✅ Admin Dashboard: View HR dashboard
5. ✅ SuperAdmin Dashboard: View global analytics
6. ✅ Guest Portal: Browse rooms and register

## 🎯 What's Included

### Backend (Complete ✅)
- All models, routes, middleware
- Database schema with relationships
- Seeder with default data
- File upload handling
- JWT authentication
- Role-based access control

### Frontend (Complete ✅)
- Staff Dashboard (React SPA)
- Receptionist Dashboard (React SPA)
- Admin Dashboard (React SPA)
- SuperAdmin Dashboard (React SPA)
- Guest Portal (Next.js SPA)

## 📝 Notes

- Each frontend SPA can run on different ports
- All SPAs connect to the same backend API
- File uploads are stored in `backend/uploads/`
- Default JWT secret should be changed in production
- Database credentials should be updated in `.env`

## 🐛 Troubleshooting

**Database connection fails:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `hotel_management` exists

**Frontend can't connect to backend:**
- Verify backend is running on port 4000
- Check `REACT_APP_API_URL` or `NEXT_PUBLIC_API_URL` in frontend `.env`
- Check CORS settings in backend

**Seeder fails:**
- Ensure database is created
- Check database connection
- Verify all models are properly defined

---

**System is ready to use! 🎉**

