# MySQL/XAMPP Setup Guide

## Issue: MySQL Connection Error (ERROR 2002)

This error means MySQL service is not running. Follow these steps:

## Step 1: Start XAMPP MySQL Service

### Option A: Using XAMPP Control Panel (Recommended)
1. Open **XAMPP Control Panel**
2. Find **MySQL** in the services list
3. Click **Start** button next to MySQL
4. Wait until the status shows "Running" (green)

### Option B: Using Windows Services
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find **MySQL** or **MySQL80** service
4. Right-click → **Start**

### Option C: Using Command Line
```bash
# If XAMPP is installed in default location:
"C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone --console
```

## Step 2: Verify MySQL is Running

```bash
# Check if MySQL port is listening
netstat -an | findstr 3306

# Or try connecting
mysql -u root -p
# Press Enter when prompted for password (if no password set)
```

## Step 3: Import Database Schema

Once MySQL is running:

```bash
# Option 1: Using MySQL command line (no password)
mysql -u root < schema.sql

# Option 2: Using MySQL command line (with password prompt)
mysql -u root -p < schema.sql
# Enter password when prompted (or press Enter if no password)

# Option 3: Using phpMyAdmin (XAMPP)
# 1. Open http://localhost/phpmyadmin
# 2. Click "New" to create database
# 3. Name it: hotel_hr_management
# 4. Click "Import" tab
# 5. Choose schema.sql file
# 6. Click "Go"
```

## Step 4: Generate JWT Secret

### Option A: Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Option B: Using Node.js (after npm install)
```bash
cd backend
npm install
node -e "const crypto=require('crypto'); console.log(crypto.randomBytes(32).toString('base64'))"
```

### Option C: Using Online Generator
Visit: https://generate-secret.vercel.app/32

### Option D: Manual Entry
Use a long random string (at least 32 characters)

## Step 5: Update .env File

After generating JWT secret, update `backend/.env`:

```env
JWT_SECRET=your-generated-secret-here
```

## Troubleshooting

### MySQL Still Not Connecting?

1. **Check XAMPP Installation Path**
   - Default: `C:\xampp\`
   - Verify MySQL exists: `C:\xampp\mysql\bin\mysql.exe`

2. **Check MySQL Port**
   - Default: 3306
   - Check if another service is using it: `netstat -an | findstr 3306`

3. **Check MySQL Configuration**
   - Config file: `C:\xampp\mysql\bin\my.ini`
   - Verify port setting: `port=3306`

4. **Try Alternative Connection**
   ```bash
   mysql -u root -h 127.0.0.1 -P 3306
   ```

5. **Check Windows Firewall**
   - May be blocking MySQL port 3306
   - Temporarily disable to test

### Common XAMPP MySQL Issues

- **Port Already in Use**: Another MySQL instance may be running
- **Service Won't Start**: Check XAMPP error logs
- **Access Denied**: Check MySQL user permissions

## Quick Test Commands

```bash
# Test MySQL connection
mysql -u root -e "SELECT VERSION();"

# Check if database exists
mysql -u root -e "SHOW DATABASES LIKE 'hotel_hr_management';"

# Create database manually if needed
mysql -u root -e "CREATE DATABASE IF NOT EXISTS hotel_hr_management;"
```

## Next Steps After MySQL is Running

1. ✅ MySQL service started
2. ✅ Database created/imported
3. ✅ JWT secret generated
4. ✅ .env file configured
5. ✅ Start backend: `cd backend && npm install && npm run seed && npm start`

