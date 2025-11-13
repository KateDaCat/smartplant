-- See record counts for all tables
SELECT 'roles' as table_name, COUNT(*) as total_records FROM roles
UNION ALL
SELECT 'species', COUNT(*) FROM species
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'sensor_devices', COUNT(*) FROM sensor_devices;