#!/bin/bash

echo "🏨 Hotel Management System - XAMPP Setup"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create database
echo "🗄️ Creating database..."
node server/createDatabase.js

# Setup database schema
echo "🔧 Setting up database schema..."
npm run setup-db

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start XAMPP Control Panel"
echo "2. Start Apache and MySQL services"
echo "3. Run: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see XAMPP_SETUP_GUIDE.md"
