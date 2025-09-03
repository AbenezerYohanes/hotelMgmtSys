@echo off
echo 🏨 Hotel Management System - Status Check
echo ==========================================

REM Check if XAMPP is running
echo 🔍 Checking XAMPP services...
curl -s http://localhost/phpmyadmin >nul 2>&1
if errorlevel 1 (
    echo ❌ XAMPP Apache is not running
) else (
    echo ✅ XAMPP Apache is running
)

REM Check if MySQL is accessible
echo 🔍 Checking MySQL connection...
node test-xampp-connection.js >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL connection failed
) else (
    echo ✅ MySQL connection is working
)

REM Check if server is running
echo 🔍 Checking server status...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Server is not running on port 5000
) else (
    echo ✅ Server is running on port 5000
)

REM Check if client is running
echo 🔍 Checking client status...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Client is not running on port 3000
) else (
    echo ✅ Client is running on port 3000
)

echo.
echo 📋 Summary:
echo - XAMPP: Make sure Apache and MySQL are started
echo - Server: Run 'npm run server' from root directory
echo - Client: Run 'npm run client' from root directory
echo - Or use: 'npm run dev' to start both
echo.
echo 🌐 Access URLs:
echo - Client: http://localhost:3000
echo - Server API: http://localhost:5000/api/health
echo - phpMyAdmin: http://localhost/phpmyadmin
pause
