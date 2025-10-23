-- Create addons_cover table
-- This table stores the mapping between policy types and their available additional covers/add-ons

CREATE TABLE IF NOT EXISTS addons_cover (
    id SERIAL PRIMARY KEY,
    policy_type_name VARCHAR(100) NOT NULL,
    additional_cover_name VARCHAR(255) NOT NULL,
    additional_cover_detail VARCHAR(255),
    alteration_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all the addons cover data
INSERT INTO addons_cover (policy_type_name, additional_cover_name, additional_cover_detail, alteration_id) VALUES
-- Silver Annual Multi-Trip
('Silver Annual Multi-Trip', 'Business Cover', NULL, '39784'),
('Silver Annual Multi-Trip', 'Event Cancellation Cover', NULL, '39762'),
('Silver Annual Multi-Trip', 'Excess Waiver Option (Individuals)', NULL, '39807'),
('Silver Annual Multi-Trip', 'Excess Waiver Option (Per Couple)', NULL, '39808'),
('Silver Annual Multi-Trip', 'Excess Waiver Option (Per Family)', NULL, '39795'),
('Silver Annual Multi-Trip', 'Financial Protection Scheme - Couple', NULL, '39778'),
('Silver Annual Multi-Trip', 'Financial Protection Scheme - Family', NULL, '39805'),
('Silver Annual Multi-Trip', 'Financial Protection Scheme - Individual', NULL, '39779'),
('Silver Annual Multi-Trip', 'Golf Extension', NULL, '39809'),
('Silver Annual Multi-Trip', 'Hazardous Activities', 'Category 2', '39815'),
('Silver Annual Multi-Trip', 'Hazardous Activities', 'Category 3', '39816'),
('Silver Annual Multi-Trip', 'Hazardous Activities', 'Category 4', '39838'),
('Silver Annual Multi-Trip', 'Hazardous Activities', 'Category 5', '39806'),
('Silver Annual Multi-Trip', 'Increase Maximum Trip Duration', 'To 45 Days any one trip', '39839'),
('Silver Annual Multi-Trip', 'Increase Maximum Trip Duration', 'To 60 Days any one trip', '39840'),
('Silver Annual Multi-Trip', 'Increase Maximum Trip Duration', 'To 90 Days any one trip', '39804'),
('Silver Annual Multi-Trip', 'Wedding Cover (Per Couple)', NULL, '39803'),
('Silver Annual Multi-Trip', 'Winter Sports Cover', NULL, '39783'),

-- Silver Single Trip
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €100,000', '39855'),
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €40,000', '39849'),
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €50,000', '39850'),
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €60,000', '39851'),
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €70,000', '39852'),
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €80,000', '39853'),
('Silver Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €90,000', '39854'),
('Silver Single Trip', 'Business Cover', NULL, '39763'),
('Silver Single Trip', 'Delete Cancellation and Curtailment Cover', 'Deletes Section A', '39780'),
('Silver Single Trip', 'Event Cancellation Cover', NULL, '39843'),
('Silver Single Trip', 'Excess Waiver Option', NULL, '39794'),
('Silver Single Trip', 'Financial Protection Scheme - Couple', NULL, '39775'),
('Silver Single Trip', 'Financial Protection Scheme - Family', NULL, '39773'),
('Silver Single Trip', 'Financial Protection Scheme - Individual', NULL, '39776'),
('Silver Single Trip', 'Financial Protection Scheme - Single Parent Family', NULL, '39777'),
('Silver Single Trip', 'Golf Extension', 'Add Section P - Golf Extension', '39826'),
('Silver Single Trip', 'Hazardous Activities', 'Category 2 - Includes Winter Sports Option', '39822'),
('Silver Single Trip', 'Hazardous Activities', 'Category 3', '39823'),
('Silver Single Trip', 'Hazardous Activities', 'Category 4', '39824'),
('Silver Single Trip', 'Hazardous Activities', 'Category 5', '39825'),
('Silver Single Trip', 'Missed connections cover Worldwide', 'Missed connections cover Worldwide', '39800'),
('Silver Single Trip', 'Wedding – Civil Partnership Cover - Per Couple', 'Wedding – Civil Partnership Cover – Per Couple', '39798'),
('Silver Single Trip', 'Winter Sports Cover', NULL, '39799'),

-- Essential Annual Multi-Trip
('Essential Annual Multi-Trip', 'Winter Sports Cover', NULL, '39760'),

-- Value Single Trip
('Value Single Trip', 'Winter Sports Cover', NULL, '39791'),

-- Long Stay Standard
('Long Stay Standard', 'Emigration Cover', '1 - 2 Months Maximum', '39813'),
('Long Stay Standard', 'Extended Missed Departure Cover', NULL, '39761'),
('Long Stay Standard', 'Hazardous Activities', 'Category 2', '39789'),
('Long Stay Standard', 'Hazardous Activities', 'Category 3', '39790'),
('Long Stay Standard', 'Hazardous Activities', 'Category 4', '39785'),
('Long Stay Standard', 'Hazardous Activities', 'Category 5', '39786'),
('Long Stay Standard', 'Return Home Option', NULL, '39844'),
('Long Stay Standard', 'Study Abroad Option', 'Covers Course fees and return home', '39764'),

-- Essential Single Trip
('Essential Single Trip', 'Winter Sports Cover', NULL, '39782'),

-- Gold Annual Multi-Trip
('Gold Annual Multi-Trip', 'Business Cover', NULL, '39772'),
('Gold Annual Multi-Trip', 'Event Cancellation Cover', NULL, '39841'),
('Gold Annual Multi-Trip', 'Excess Waiver Option (Per Couple)', NULL, '39830'),
('Gold Annual Multi-Trip', 'Excess Waiver Option (Per Family)', NULL, '39831'),
('Gold Annual Multi-Trip', 'Excess Waiver Option Per Person', NULL, '39829'),
('Gold Annual Multi-Trip', 'Financial Protection Scheme - Family', NULL, '39774'),
('Gold Annual Multi-Trip', 'Financial Protection Scheme - Individual', NULL, '39812'),
('Gold Annual Multi-Trip', 'Golf Extension', NULL, '39827'),
('Gold Annual Multi-Trip', 'Hazardous Activities', 'Category 3', '39835'),
('Gold Annual Multi-Trip', 'Hazardous Activities', 'Category 4', '39836'),
('Gold Annual Multi-Trip', 'Hazardous Activities', 'Category 5', '39837'),
('Gold Annual Multi-Trip', 'Increase Maximum Trip Duration', 'To 45 Days any one trip', '39832'),
('Gold Annual Multi-Trip', 'Increase Maximum Trip Duration', 'To 60 Days any one trip', '39833'),
('Gold Annual Multi-Trip', 'Increase Maximum Trip Duration', 'To 90 Days any one trip', '39834'),
('Gold Annual Multi-Trip', 'Wedding Cover (Per Couple)', NULL, '39828'),
('Gold Annual Multi-Trip', 'Winter Sports Cover', NULL, '39796'),

-- Gold Single Trip
('Gold Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €100,000', '39848'),
('Gold Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €70,000', '39845'),
('Gold Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €80,000', '39846'),
('Gold Single Trip', 'ADDITIONAL PERSONAL ACCIDENT COVER TOP-UP', 'Up to €90,000', '39847'),
('Gold Single Trip', 'Business Cover', NULL, '39765'),
('Gold Single Trip', 'Cancellation Top-up - Couple Age 65-70', 'From £6001 to £9000', '39770'),
('Gold Single Trip', 'Cancellation Top-up - Couple Age 71-85', 'From £6001 to £9000', '39771'),
('Gold Single Trip', 'Cancellation Top-up - Diamond', 'From €7,740 to €19,350', '39768'),
('Gold Single Trip', 'Cancellation Top-up - Individual Age 65-70', 'From £6001 to £9000', '39767'),
('Gold Single Trip', 'Cancellation Top-up - Platinum', 'From €7,740 to €12,900', '39766'),
('Gold Single Trip', 'Delete Cancellation and Curtailment Cover', NULL, '39792'),
('Gold Single Trip', 'Event Cancellation Cover', NULL, '39842'),
('Gold Single Trip', 'Excess Waiver Option', NULL, '39814'),
('Gold Single Trip', 'Financial Protection Scheme - Couple', NULL, '39793'),
('Gold Single Trip', 'Financial Protection Scheme - Family', NULL, '39810'),
('Gold Single Trip', 'Financial Protection Scheme - Individual', NULL, '39811'),
('Gold Single Trip', 'Financial Protection Scheme - Single Parent Family', NULL, '39797'),
('Gold Single Trip', 'Golf Extension', NULL, '39818'),
('Gold Single Trip', 'Hazardous Activities', 'Category 2 - Includes Winter Sports Option', '39819'),
('Gold Single Trip', 'Hazardous Activities', 'Category 3', '39820'),
('Gold Single Trip', 'Hazardous Activities', 'Category 4', '39821'),
('Gold Single Trip', 'Hazardous Activities', 'Category 5', '39788'),
('Gold Single Trip', 'Missed connections cover Europe', 'Missed connections cover Europe', '39801'),
('Gold Single Trip', 'Missed connections cover Worldwide', 'Missed connections cover Worldwide', '39802'),
('Gold Single Trip', 'Wedding – Civil Partnership Cover - Per Couple', 'Wedding – Civil Partnership Cover – Per Couple', '39817'),
('Gold Single Trip', 'Winter Sports Cover', NULL, '39769'),

-- Long Stay Study Abroad
('Long Stay Study Abroad', 'Extended Missed Departure Cover', NULL, '39781'),
('Long Stay Study Abroad', 'Hazardous Activities', 'Category 2', '39787');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_addons_cover_policy_type ON addons_cover(policy_type_name);
CREATE INDEX IF NOT EXISTS idx_addons_cover_alteration_id ON addons_cover(alteration_id);
CREATE INDEX IF NOT EXISTS idx_addons_cover_name ON addons_cover(additional_cover_name);

-- Create trigger for updated_at
CREATE TRIGGER update_addons_cover_updated_at BEFORE UPDATE ON addons_cover
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Print success message
SELECT 'addons_cover table created and populated successfully!' as status;









