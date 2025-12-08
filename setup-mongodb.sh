#!/bin/bash

echo "Setting up MongoDB for Hotel Management System"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

echo "Installing dependencies..."
cd server
npm install

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Update server/.env file with your MongoDB Atlas connection string"
echo "2. Make sure to set:"
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database"
echo "3. Start the server:"
echo "   cd server && npm run dev"
echo "4. Start the client:"
echo "   cd client && npm start"
