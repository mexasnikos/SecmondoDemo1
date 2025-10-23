# Countries of Residence Table Setup

This guide explains how to set up the `countries` table for the Country of Residence dropdown in the travel insurance application.

## What Was Created

1. **Database Table**: A new `countries` table with 30 EU/EEA countries
2. **Backend API Endpoint**: `GET /api/countries` to fetch all countries
3. **Frontend Integration**: Updated `Quote2.tsx` to use a dropdown instead of text input

## Files Modified/Created

### Backend
- `backend/schema.sql` - Added countries table definition and data
- `backend/create-countries-table.sql` - Standalone script to create the table
- `backend/server.js` - Added `/api/countries` API endpoint

### Frontend
- `src/pages/Quote2.tsx` - Changed Country of Residence from text input to dropdown

## Setup Instructions

### Option 1: Fresh Database Setup
If you're setting up a new database, run the main schema file which now includes the countries table:

```bash
psql -U postgres -d travel_insurance -f backend/schema.sql
```

### Option 2: Add to Existing Database
If you already have a database running, use the standalone script:

```bash
psql -U postgres -d travel_insurance -f backend/create-countries-table.sql
```

Or connect to your database and run:

```sql
-- Connect to your database
\c travel_insurance

-- Then run
\i backend/create-countries-table.sql
```

## Verify Installation

1. Check if the table was created:
```sql
SELECT COUNT(*) FROM countries;
```
Expected output: 30 countries

2. View all countries:
```sql
SELECT * FROM countries ORDER BY country_name;
```

3. Test the API endpoint:
```bash
curl http://localhost:5002/api/countries
```

## Countries Included

The table includes 30 EU/EEA countries:
- Austria, Belgium, Bulgaria, Croatia, Czech Republic, Denmark
- Estonia, Finland, France, Germany, Greece, Hungary
- Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg
- Malta, Netherlands, Norway, Poland, Portugal
- Republic of Cyprus, Republic of Ireland, Romania
- Slovak Republic, Slovenia, Spain, Sweden

## Database Schema

```sql
CREATE TABLE countries (
    country_id INTEGER PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Frontend Changes

The Country of Residence field is now a dropdown that:
- Loads countries from the database via API
- Shows "Loading countries..." while fetching
- Displays all 30 EU/EEA countries in alphabetical order
- Validates that a country is selected before proceeding

## Troubleshooting

**Problem**: Countries not showing in dropdown
**Solution**: 
1. Ensure database server is running on port 5002
2. Check if the countries table exists: `\dt countries`
3. Verify data is in the table: `SELECT COUNT(*) FROM countries;`
4. Check backend server is running: `curl http://localhost:5002/api/health`
5. Check browser console for API errors

**Problem**: API endpoint returns error
**Solution**: Make sure the backend server was restarted after adding the endpoint

## Next Steps

If you need to add more countries in the future:

```sql
INSERT INTO countries (country_id, country_name) VALUES
(your_country_id, 'Your Country Name');
```

Make sure to use a unique `country_id` that doesn't conflict with existing IDs.



