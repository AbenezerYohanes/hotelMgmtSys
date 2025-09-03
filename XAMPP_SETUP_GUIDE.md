# XAMPP Setup Guide for Hotel Management System

## Prerequisites
- XAMPP installed on your system
- Node.js and npm installed
- Git (optional, for version control)

## Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
   - Launch XAMPP Control Panel
   - Start Apache and MySQL services
   - Make sure both services show green status

2. **Verify MySQL is Running**
   - Open your browser and go to: `http://localhost/phpmyadmin`
   - You should see the phpMyAdmin interface
   - Default credentials: username `root`, password (leave empty)

## Step 2: Create Database

### Option A: Using phpMyAdmin (Recommended)
1. Open `http://localhost/phpmyadmin`
2. Click "New" on the left sidebar
3. Enter database name: `hotel_management`
4. Click "Create"
5. The database will be created automatically

### Option B: Using Node.js Script
```bash
# Run the database creation script
node server/createDatabase.js
```

## Step 3: Setup Database Schema

```bash
# Install dependencies (if not already done)
npm run install-all

# Setup database tables and initial data
npm run setup-db
```

## Step 4: Start the Application

```bash
# Start both server and client in development mode
npm run dev

# Or start only the server
npm run server

# Or start only the client
npm run client
```

## Step 5: Verify Everything is Working

1. **Server Health Check**: Visit `http://localhost:5000/api/health`
2. **Client Application**: Visit `http://localhost:3000`
3. **Database Connection**: Check server logs for "✅ Connected to MySQL database successfully"

## Troubleshooting

### Common Issues:

1. **Port Already in Use**
   - Change PORT in config.env to another port (e.g., 5001)
   - Or kill the process using the port

2. **MySQL Connection Failed**
   - Ensure XAMPP MySQL service is running
   - Check if MySQL port 3306 is not blocked
   - Verify credentials in config.env

3. **Database Not Found**
   - Run `node server/createDatabase.js` to create the database
   - Check if database name matches in config.env

4. **Permission Issues**
   - Ensure XAMPP has proper permissions
   - Run XAMPP as administrator if needed

## Configuration Details

The system is configured to work with XAMPP's default MySQL settings:
- Host: localhost
- Port: 3306
- User: root
- Password: (empty)
- Database: hotel_management

## Security Notes

⚠️ **Important**: For production use:
1. Change the JWT_SECRET to a strong, unique key
2. Set a strong password for MySQL root user
3. Create a dedicated database user with limited permissions
4. Use environment variables for sensitive data

## API Endpoints

Once running, the following endpoints will be available:
- Authentication: `/api/auth`
- Users: `/api/users`
- HR: `/api/hr`
- Bookings: `/api/bookings`
- Rooms: `/api/rooms`
- Guests: `/api/guests`
- Payments: `/api/payments`
- Reports: `/api/reports`
- Chapa Integration: `/api/chapa`

## Development Workflow

1. Start XAMPP services
2. Run `npm run dev` to start both server and client
3. Make changes to code
4. Server will auto-restart with nodemon
5. Client will auto-reload with hot reload

## Production Deployment

For production deployment:
1. Set NODE_ENV=production in config.env
2. Configure proper database credentials
3. Set up a production MySQL server
4. Use `npm run build` to build the client
5. Use `npm start` to run the server
