# 🏨 Hotel Management System - XAMPP Integration Complete!

## ✅ What I've Done

1. **Updated Configuration**: Modified `config.env` to work with XAMPP's default MySQL settings
2. **Created Setup Scripts**: Added automated setup scripts for both Windows and Linux/Mac
3. **Added Connection Testing**: Created a test script to verify XAMPP connection
4. **Updated Package Scripts**: Added new npm scripts for easy setup and testing
5. **Created Comprehensive Guide**: Detailed setup instructions in `XAMPP_SETUP_GUIDE.md`

## 🚀 Quick Start (Choose Your Method)

### Method 1: Automated Setup (Recommended)
```bash
# For Windows
npm run setup-xampp-win

# For Linux/Mac
npm run setup-xampp
```

### Method 2: Manual Setup
```bash
# 1. Install dependencies
npm run install-all

# 2. Test XAMPP connection
npm run test-connection

# 3. Create database
npm run create-db

# 4. Setup database schema
npm run setup-db

# 5. Start the application
npm run dev
```

## 🔧 XAMPP Setup Steps

### 1. Start XAMPP Services
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Verify both show green status

### 2. Verify MySQL Access
- Open browser: `http://localhost/phpmyadmin`
- Login with: username `root`, password (leave empty)
- You should see the phpMyAdmin interface

### 3. Create Database (if needed)
- In phpMyAdmin, click "New" → Enter "hotel_management" → Click "Create"
- Or run: `npm run create-db`

## 🧪 Testing Your Setup

```bash
# Test XAMPP connection
npm run test-connection

# Check server health
curl http://localhost:5000/api/health
```

## 📊 Default Login Credentials

After setup, you can login with:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator

## 🔍 Troubleshooting

### Connection Issues
1. **MySQL not connecting**: Ensure XAMPP MySQL service is running
2. **Port conflicts**: Change PORT in config.env if 5000 is busy
3. **Database not found**: Run `npm run create-db`
4. **Permission errors**: Run XAMPP as administrator

### Common Commands
```bash
# Test connection
npm run test-connection

# Create database
npm run create-db

# Setup schema
npm run setup-db

# Start development
npm run dev

# Start server only
npm run server

# Start client only
npm run client
```

## 📁 Files Created/Modified

- ✅ `config.env` - Updated for XAMPP
- ✅ `XAMPP_SETUP_GUIDE.md` - Comprehensive guide
- ✅ `setup-xampp.sh` - Linux/Mac setup script
- ✅ `setup-xampp.bat` - Windows setup script
- ✅ `test-xampp-connection.js` - Connection tester
- ✅ `package.json` - Added new scripts

## 🎯 Next Steps

1. **Start XAMPP** services
2. **Run setup script** or follow manual steps
3. **Test connection** with `npm run test-connection`
4. **Start application** with `npm run dev`
5. **Access the app** at `http://localhost:3000`

## 🔐 Security Notes

⚠️ **For Production Use**:
- Change JWT_SECRET in config.env
- Set strong MySQL password
- Create dedicated database user
- Use environment variables for secrets

---

**Your hotel management system is now ready to work with XAMPP! 🎉**

For detailed instructions, see `XAMPP_SETUP_GUIDE.md`
