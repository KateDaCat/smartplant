-- ==================== D8: BACKUP & RECOVERY SETUP ====================
-- SARAWAK PLANT DATABASE - BACKUP SYSTEM IMPLEMENTATION

USE sarawak_plant_db;

-- Step 1: Pre-Backup Data Verification
SELECT 
    'Pre-Backup Check' AS 'Status',
    COUNT(*) AS 'Total Species',
    (SELECT COUNT(*) FROM users) AS 'Total Users',
    (SELECT COUNT(*) FROM sensor_devices) AS 'Total Devices',
    (SELECT COUNT(*) FROM plant_observations) AS 'Total Observations',
    (SELECT COUNT(*) FROM sensor_readings) AS 'Total Sensor Readings',
    NOW() AS 'Verification Time'
FROM species;

-- Step 2: Create Backup Management Tables
CREATE TABLE IF NOT EXISTS backup_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    backup_type VARCHAR(50),
    backup_file VARCHAR(500),
    record_counts JSON,
    backup_size_mb DECIMAL(10,2),
    status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS system_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    log_type VARCHAR(50),
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Log First Manual Backup
INSERT INTO backup_logs (backup_type, backup_file, status, notes) 
VALUES (
    'manual', 
    'sarawak_plant_backup.sql', 
    'success',
    'Initial manual backup - Sprint 2 completion'
);

INSERT INTO system_logs (log_type, message) 
VALUES ('backup', 'First manual backup completed successfully for Sprint 2');

-- Step 4: Backup Verification Queries
SELECT '=== BACKUP COMPLETED ===' AS 'Backup Status';
SELECT * FROM backup_logs ORDER BY created_at DESC LIMIT 5;
SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 5;


-- Step 5: Final Database State Snapshot (for recovery verification)
SELECT 
    'species' as table_name, COUNT(*) as actual_count FROM species
UNION ALL
    SELECT 'roles', COUNT(*) FROM roles
UNION ALL
    SELECT 'users', COUNT(*) FROM users
UNION ALL
    SELECT 'active_users', COUNT(*) FROM users WHERE is_active = 1
UNION ALL
    SELECT 'inactive_users', COUNT(*) FROM users WHERE is_active = 0
UNION ALL
    SELECT 'backup_logs', COUNT(*) FROM backup_logs
UNION ALL
    SELECT 'system_logs', COUNT(*) FROM system_logs
UNION ALL
    SELECT 'sensor_devices', COUNT(*) FROM sensor_devices
UNION ALL
    SELECT 'sensor_readings', COUNT(*) FROM sensor_readings
UNION ALL
    SELECT 'plant_observations', COUNT(*) FROM plant_observations
UNION ALL
    SELECT 'ai_results', COUNT(*) FROM ai_results
UNION ALL
    SELECT 'alerts', COUNT(*) FROM alerts;

-- Step 6: Critical Data Integrity Check
SELECT 
    'Data Integrity Check' AS 'Check_Type',
    (SELECT COUNT(*) FROM species WHERE scientific_name IS NOT NULL) AS 'Species_With_Scientific_Names',
    (SELECT COUNT(*) FROM species WHERE common_name IS NOT NULL) AS 'Species_With_Common_Names',
    (SELECT COUNT(DISTINCT species_id) FROM species) AS 'Unique_Species_Count'
FROM DUAL;

-- Step 7: Index Status Verification (D7 Completion Proof)
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COUNT(*) AS 'Indexed_Columns'
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'sarawak_plant_db'
GROUP BY TABLE_NAME, INDEX_NAME
ORDER BY TABLE_NAME, INDEX_NAME;

-- ==================== BACKUP COMPLETE ====================
SELECT 'SARAWAK PLANT DATABASE BACKUP - SPRINT 2 COMPLETED' AS 'Final_Status';