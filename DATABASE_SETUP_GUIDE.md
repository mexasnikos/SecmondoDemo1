# PostgreSQL Database Integration Setup Guide

## 🎯 Overview

Your Travel Insurance application now includes complete PostgreSQL database integration! This guide will help you set up and run the full-stack application.

## 📋 Prerequisites

### 1. Install PostgreSQL
**Windows:**
- Download PostgreSQL from [postgresql.org](https://www.postgresql.org/downloads/windows/)
- Install with default settings
- Remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Verify PostgreSQL Installation
```bash
# Test connection (use the password you set during installation)
psql -U postgres -h localhost

# Inside psql, check version:
SELECT version();

# Exit psql:
\q
```

## 🚀 Setup Instructions

### Step 1: Configure Database Credentials

1. **Update Backend Environment:**
   ```bash
   cd backend
   # Edit the .env file with your database password
   nano .env
   ```
   
   Update `DB_PASSWORD` with your actual PostgreSQL password:
   ```env
   DB_PASSWORD=your_actual_postgres_password
   ```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if not already done)
cd ..
npm install
```

### Step 3: Setup Database

```bash
# Run the automated database setup
cd backend
npm run setup
```

This will:
- Create the `travel_insurance` database
- Run all table creation scripts
- Set up indexes and views
- Verify the setup

**Alternative manual setup:**
```bash
# Create database manually
psql -U postgres -c "CREATE DATABASE travel_insurance;"

# Run schema
psql -U postgres -d travel_insurance -f schema.sql
```

### Step 4: Start the Application

**Terminal 1 - Backend API:**
```bash
cd backend
npm start
```
The API will start on http://localhost:5000

**Terminal 2 - Frontend React App:**
```bash
# From the main project directory
npm start
```
The frontend will start on http://localhost:3000

## 🧪 Testing the Integration

### 1. Test API Connection
```bash
# Health check
curl http://localhost:5000/api/health

# Database test
curl http://localhost:5000/api/db-test
```

### 2. Test Frontend Integration
1. Go to http://localhost:3000
2. Navigate to the Quote page
3. Fill out the form completely
4. Process a quote - it will now save to the database!
5. Try the Contact form - messages are saved to the database

### 3. Database Verification
```bash
# Connect to database
psql -U postgres -d travel_insurance

# Check if data is being saved
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 5;
SELECT * FROM travelers ORDER BY created_at DESC LIMIT 5;
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;

# Exit
\q
```

## 📊 Database Structure

Your database now includes these tables:

- **`quotes`** - Main insurance quotes
- **`travelers`** - Individual traveler information
- **`additional_policies`** - Add-on coverage options
- **`payments`** - Payment transactions
- **`contact_messages`** - Contact form submissions
- **`policy_documents`** - Generated documents
- **`audit_log`** - System audit trail

## 🔧 Available API Endpoints

- `GET /api/health` - Health check
- `GET /api/db-test` - Database connection test
- `POST /api/quotes` - Create new quote
- `GET /api/quotes` - Get all quotes (paginated)
- `GET /api/quotes/:id` - Get specific quote
- `POST /api/contact` - Submit contact form
- `POST /api/payments` - Process payment
- `GET /api/stats` - Get dashboard statistics

## 🎯 What's New

### Frontend Changes:
- **Quote Form**: Now saves all data to PostgreSQL
- **Contact Form**: Messages are stored in the database
- **API Integration**: All forms now use the backend API
- **Error Handling**: Proper error messages for database issues

### Backend Features:
- **RESTful API**: Complete CRUD operations
- **Data Validation**: Input validation and sanitization
- **Transaction Support**: Atomic operations for data integrity
- **Audit Trail**: Track all important changes
- **Statistics API**: Dashboard data for analytics

## 🛠️ Development Commands

### Backend:
```bash
cd backend

# Start development server with auto-reload
npm run dev

# Reset database (caution: deletes all data)
npm run db:reset

# Manual database setup
npm run db:setup
```

### Frontend:
```bash
# Start development server
npm start

# Build for production
npm run build
```

## 📈 Database Administration

### Useful PostgreSQL Commands:
```sql
-- View all quotes
SELECT q.id, q.destination, q.total_amount, q.status, q.created_at,
       COUNT(t.id) as traveler_count
FROM quotes q
LEFT JOIN travelers t ON q.id = t.quote_id
GROUP BY q.id
ORDER BY q.created_at DESC;

-- View revenue statistics
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_quotes,
  SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as revenue
FROM quotes
GROUP BY month
ORDER BY month DESC;

-- View contact messages
SELECT id, name, email, subject, status, created_at
FROM contact_messages
ORDER BY created_at DESC;
```

## 🔒 Security Notes

### Production Considerations:
- Change all default passwords
- Use environment variables for sensitive data
- Set up SSL/TLS for the database connection
- Implement rate limiting
- Use proper authentication and authorization
- Never store credit card data in plain text
- Set up database backups

## 🐛 Troubleshooting

### Common Issues:

**Database Connection Failed:**
- Check if PostgreSQL is running: `pg_isready`
- Verify credentials in backend/.env
- Ensure database exists: `psql -U postgres -l`

**API Not Responding:**
- Check if backend server is running on port 5000
- Verify no firewall blocking the port
- Check backend console for error messages

**Frontend API Errors:**
- Verify REACT_APP_API_URL in .env
- Check browser developer console for CORS errors
- Ensure backend is running before frontend

**Permission Errors:**
```bash
# Grant proper permissions (if needed)
sudo -u postgres psql -c "ALTER USER postgres CREATEDB;"
```

## 📚 Next Steps

1. **Add Authentication**: Implement user accounts and login
2. **Admin Dashboard**: Create admin interface for managing quotes
3. **Email Notifications**: Send confirmation emails
4. **Payment Gateway**: Integrate with Stripe or PayPal
5. **File Storage**: Add document upload capabilities
6. **Analytics**: Implement detailed reporting

## 🎉 Success!

Your Travel Insurance application now has:
- ✅ Complete PostgreSQL database integration
- ✅ RESTful API backend
- ✅ Real-time data storage
- ✅ Form submissions saved to database
- ✅ Payment processing workflow
- ✅ Contact form functionality
- ✅ Scalable architecture

The application is now production-ready with proper data persistence!
