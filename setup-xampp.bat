@echo off
echo 🏨 Hotel Management System - XAMPP Setup
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

REM Create database
echo 🗄️ Creating database...
node server/createDatabase.js

REM Setup database schema
echo 🔧 Setting up database schema...
call npm run setup-db

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Start XAMPP Control Panel
echo 2. Start Apache and MySQL services
echo 3. Run: npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see XAMPP_SETUP_GUIDE.md
pause
