# Travel Insurance Backend

This is the backend API server for the Travel Insurance application, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/downloads/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

#### Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE travel_insurance;

-- Create user (optional)
CREATE USER travel_app WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE travel_insurance TO travel_app;

-- Exit
\q
```

#### Run Schema
```bash
# Navigate to backend directory
cd backend

# Run the schema file
psql -U postgres -d travel_insurance -f schema.sql
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your database credentials
nano .env
```

Update the following variables in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_insurance
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

### 3. Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Health & Testing
- `GET /api/health` - Health check
- `GET /api/db-test` - Database connection test

### Quotes
- `POST /api/quotes` - Create new quote
- `GET /api/quotes` - Get all quotes (paginated)
- `GET /api/quotes/:id` - Get specific quote

### Contact
- `POST /api/contact` - Submit contact form

### Payments
- `POST /api/payments` - Process payment

### Statistics
- `GET /api/stats` - Get dashboard statistics

## API Usage Examples

### Create Quote
```bash
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Europe",
    "startDate": "2024-08-01",
    "endDate": "2024-08-15",
    "tripType": "single",
    "numberOfTravelers": 2,
    "travelers": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "age": "35",
        "email": "john@example.com",
        "phone": "+1234567890",
        "vaxId": "VAX123",
        "nationality": "American"
      }
    ],
    "selectedQuote": {
      "id": "standard",
      "name": "Standard Plan",
      "price": 299.99
    },
    "additionalPolicies": [],
    "totalAmount": 299.99
  }'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "general",
    "message": "I need help with my policy"
  }'
```

## Database Schema

The database consists of the following main tables:

- **quotes**: Main quote information
- **travelers**: Individual traveler details
- **additional_policies**: Selected add-on policies
- **payments**: Payment transactions
- **contact_messages**: Contact form submissions
- **policy_documents**: Generated documents
- **audit_log**: System audit trail

## Security Features

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS configuration
- Environment variable protection
- Error handling and logging

## Development

### Database Migrations
When making schema changes, create migration files and update the schema.sql file.

### Testing
```bash
# Run tests (when implemented)
npm test

# Test API endpoints
npm run test:api
```

### Monitoring
- Check logs for errors and performance issues
- Monitor database connections and query performance
- Use health check endpoint for uptime monitoring

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start the application

### Production Considerations
- Use environment variables for all sensitive data
- Set up database backups
- Configure logging and monitoring
- Use HTTPS in production
- Set up rate limiting
- Configure proper CORS settings

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check PostgreSQL is running
- Verify database credentials in .env
- Ensure database exists

**Port Already in Use**
- Change PORT in .env file
- Kill existing processes on the port

**Schema Errors**
- Ensure PostgreSQL version compatibility
- Check for syntax errors in schema.sql
- Verify user permissions

### Logs
Check console output for detailed error messages and debugging information.

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Use proper commit messages

## License

This project is part of the Travel Insurance application.
