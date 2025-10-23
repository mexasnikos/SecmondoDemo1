-- Create countries table for Country of Residence dropdown
-- This table contains all EU/EEA countries for the travel insurance application

-- Drop the table if it exists (for clean re-runs)
DROP TABLE IF EXISTS countries CASCADE;

-- Create the countries table
CREATE TABLE countries (
    country_id INTEGER PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all EU/EEA countries
INSERT INTO countries (country_id, country_name) VALUES
(4, 'Austria'),
(6, 'Belgium'),
(10, 'Bulgaria'),
(14, 'Croatia (Hrvatska)'),
(16, 'Czech Republic'),
(17, 'Denmark'),
(20, 'Estonia'),
(21, 'Finland'),
(22, 'France'),
(23, 'Germany'),
(24, 'Greece'),
(27, 'Hungary'),
(28, 'Iceland'),
(33, 'Italy'),
(38, 'Latvia'),
(40, 'Liechtenstein'),
(41, 'Lithuania'),
(42, 'Luxembourg'),
(93, 'Malta'),
(47, 'Netherlands'),
(49, 'Norway'),
(53, 'Poland'),
(54, 'Portugal'),
(283, 'Republic of Cyprus'),
(19, 'Republic of Ireland'),
(55, 'Romania'),
(59, 'Slovak Republic'),
(60, 'Slovenia'),
(62, 'Spain'),
(63, 'Sweden');

-- Create an index on country_name for faster lookups
CREATE INDEX idx_countries_name ON countries(country_name);

-- Verify the data was inserted successfully
SELECT COUNT(*) as total_countries FROM countries;

-- Display all countries
SELECT * FROM countries ORDER BY country_name;

-- Print success message
SELECT 'Countries table created successfully with ' || COUNT(*) || ' countries!' as status FROM countries;



