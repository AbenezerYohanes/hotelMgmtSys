#!/bin/bash

echo "🏨 Hotel Management System - Status Check"
echo "=========================================="

# Check if XAMPP is running
echo "🔍 Checking XAMPP services..."
if curl -s http://localhost/phpmyadmin > /dev/null 2>&1; then
    echo "✅ XAMPP Apache is running"
else
    echo "❌ XAMPP Apache is not running"
fi

# Check if MySQL is accessible
echo "🔍 Checking MySQL connection..."
if node test-xampp-connection.js > /dev/null 2>&1; then
    echo "✅ MySQL connection is working"
else
    echo "❌ MySQL connection failed"
fi

# Check if server is running
echo "🔍 Checking server status..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Server is running on port 5000"
else
    echo "❌ Server is not running on port 5000"
fi

# Check if client is running
echo "🔍 Checking client status..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Client is running on port 3000"
else
    echo "❌ Client is not running on port 3000"
fi

echo ""
echo "📋 Summary:"
echo "- XAMPP: Make sure Apache and MySQL are started"
echo "- Server: Run 'npm run server' from root directory"
echo "- Client: Run 'npm run client' from root directory"
echo "- Or use: 'npm run dev' to start both"
echo ""
echo "🌐 Access URLs:"
echo "- Client: http://localhost:3000"
echo "- Server API: http://localhost:5000/api/health"
echo "- phpMyAdmin: http://localhost/phpmyadmin"
