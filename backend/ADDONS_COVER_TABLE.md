# Add-Ons Cover Table

## Overview

The `addons_cover` table stores the mapping between policy types and their available additional covers/add-ons. This table is used to determine which additional coverage options are available for each type of travel insurance policy.

## Table Structure

```sql
CREATE TABLE addons_cover (
    id SERIAL PRIMARY KEY,
    policy_type_name VARCHAR(100) NOT NULL,
    additional_cover_name VARCHAR(255) NOT NULL,
    additional_cover_detail VARCHAR(255),
    alteration_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Columns

- **id**: Auto-incrementing primary key
- **policy_type_name**: Name of the policy type (e.g., "Silver Annual Multi-Trip", "Gold Single Trip")
- **additional_cover_name**: Name of the add-on/additional cover (e.g., "Business Cover", "Winter Sports Cover")
- **additional_cover_detail**: Optional details about the cover (e.g., "Category 2", "Up to €100,000")
- **alteration_id**: Terracotta system ID for the add-on/alteration
- **created_at**: Timestamp when the record was created
- **updated_at**: Timestamp when the record was last updated

## Setup Instructions

### Option 1: Using the Setup Script (Recommended)

#### On Windows:
```bash
cd backend
setup-addons-cover.bat
```

#### On Linux/Mac or using Node directly:
```bash
cd backend
node setup-addons-cover.js
```

### Option 2: Manual SQL Execution

1. Connect to your PostgreSQL database
2. Run the SQL file:
```bash
psql -U postgres -d travel_insurance -f create-addons-cover-table.sql
```

Or using pgAdmin:
- Open pgAdmin
- Connect to your database
- Open the Query Tool
- Load and execute `create-addons-cover-table.sql`

## Data Summary

The table contains add-ons for the following policy types:

### Annual Policies
- **Silver Annual Multi-Trip** (18 add-ons)
- **Essential Annual Multi-Trip** (1 add-on)
- **Gold Annual Multi-Trip** (16 add-ons)

### Single Trip Policies
- **Silver Single Trip** (23 add-ons)
- **Value Single Trip** (1 add-on)
- **Essential Single Trip** (1 add-on)
- **Gold Single Trip** (27 add-ons)

### Long Stay Policies
- **Long Stay Standard** (8 add-ons)
- **Long Stay Study Abroad** (2 add-ons)

**Total Records: 97 add-on options**

## Common Add-On Categories

1. **Business Cover** - Coverage for business-related travel
2. **Winter Sports Cover** - Coverage for winter sports activities
3. **Event Cancellation Cover** - Protection for event-related cancellations
4. **Hazardous Activities** - Coverage for various categories of adventure activities
5. **Excess Waiver Options** - Options to waive excess fees
6. **Financial Protection Scheme** - Various family/individual protection options
7. **Wedding Cover** - Special coverage for wedding-related travel
8. **Golf Extension** - Coverage for golf equipment and activities
9. **Personal Accident Cover Top-Up** - Additional accident coverage
10. **Missed Connections Cover** - Protection against missed connections

## Querying Examples

### Get all add-ons for a specific policy type:
```sql
SELECT 
    additional_cover_name,
    additional_cover_detail,
    alteration_id
FROM addons_cover
WHERE policy_type_name = 'Silver Annual Multi-Trip'
ORDER BY additional_cover_name;
```

### Count add-ons by policy type:
```sql
SELECT 
    policy_type_name,
    COUNT(*) as total_addons
FROM addons_cover
GROUP BY policy_type_name
ORDER BY total_addons DESC;
```

### Find policies offering a specific add-on:
```sql
SELECT DISTINCT policy_type_name
FROM addons_cover
WHERE additional_cover_name LIKE '%Winter Sports%'
ORDER BY policy_type_name;
```

### Get add-ons with their details:
```sql
SELECT 
    policy_type_name,
    additional_cover_name,
    COALESCE(additional_cover_detail, 'No details') as details,
    alteration_id
FROM addons_cover
WHERE additional_cover_name = 'Hazardous Activities'
ORDER BY policy_type_name, additional_cover_detail;
```

## Integration with Application

### Backend API Example

```javascript
// Get available add-ons for a policy type
app.get('/api/addons/:policyType', async (req, res) => {
  try {
    const { policyType } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM addons_cover WHERE policy_type_name = $1 ORDER BY additional_cover_name',
      [policyType]
    );
    
    res.json({
      success: true,
      policyType,
      addons: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Usage Example

```javascript
// Fetch add-ons for selected policy
const fetchAddons = async (policyType) => {
  const response = await fetch(`/api/addons/${encodeURIComponent(policyType)}`);
  const data = await response.json();
  
  if (data.success) {
    setAvailableAddons(data.addons);
  }
};
```

## Maintenance

### Adding New Add-Ons
```sql
INSERT INTO addons_cover (
    policy_type_name, 
    additional_cover_name, 
    additional_cover_detail, 
    alteration_id
) VALUES (
    'Policy Type Name',
    'Add-on Name',
    'Optional Details',
    '12345'
);
```

### Updating Add-On Details
```sql
UPDATE addons_cover
SET additional_cover_detail = 'New Details'
WHERE alteration_id = '12345';
```

### Removing Discontinued Add-Ons
```sql
DELETE FROM addons_cover
WHERE alteration_id = '12345';
```

## Indexes

The table includes the following indexes for optimal performance:

- `idx_addons_cover_policy_type` - Index on policy_type_name
- `idx_addons_cover_alteration_id` - Index on alteration_id  
- `idx_addons_cover_name` - Index on additional_cover_name

## Notes

- The `alteration_id` corresponds to the Terracotta system's alteration IDs
- Some add-ons may have NULL in the `additional_cover_detail` column
- The `updated_at` column is automatically updated via trigger when records are modified
- Policy type names must match exactly (case-sensitive) when querying

## Troubleshooting

### Table already exists error
If you see "relation already exists", the table is already created. To recreate:
```sql
DROP TABLE IF EXISTS addons_cover CASCADE;
```
Then run the setup script again.

### Connection errors
Ensure your `.env` file has correct database credentials:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=travel_insurance
DB_PASSWORD=your_password
DB_PORT=5432
```

## Related Tables

- `quotes` - Main quote information
- `additional_policies` - Selected additional policies for specific quotes
- This table serves as a reference/catalog for available add-ons









