-- VERIFICATION: Check all indexes were created successfully
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME) AS columns_indexed,
    INDEX_TYPE
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'sarawak_plant_db'
GROUP BY TABLE_NAME, INDEX_NAME, INDEX_TYPE
ORDER BY TABLE_NAME, INDEX_NAME;

-- Check what indexes exist on species table
SHOW INDEX FROM species;

-- This should use the common_name index
EXPLAIN SELECT * FROM species WHERE common_name = 'Noni';

-- Test with multiple common names
EXPLAIN SELECT * FROM species 
WHERE common_name IN ('Noni', 'Giant Taro', 'Sea Mango');

-- Complex query that should benefit from multiple indexes
EXPLAIN SELECT species_id, scientific_name, common_name 
FROM species 
WHERE (common_name LIKE '%Taro%' OR scientific_name LIKE '%Acacia%')
AND is_endangered = 0
ORDER BY scientific_name;

-- FAST: Uses index to instantly find 'Noni'
SELECT * FROM species WHERE common_name = 'Noni';

-- User searches "Acacia" - INSTANT results
SELECT * FROM species WHERE scientific_name LIKE 'Acacia%';

-- User types "taro" in search box
SELECT * FROM species WHERE common_name LIKE '%taro%';
-- INDEX makes this instant instead of slow