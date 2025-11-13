-- SARAWAK PLANT DATABASE - SPRINT 2 
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

USE `sarawak_plant_db`;

-- ==================== D7: QUERY OPTIMIZATION ====================
-- Strategic indexes for faster search & mapping queries

-- SPECIES TABLE — AI & SEARCH OPTIMIZATION
-- Purpose: Fast filtering and searching of plant species data
CREATE INDEX idx_species_common_name ON species(common_name);
CREATE INDEX idx_species_scientific_name ON species(scientific_name);
CREATE INDEX idx_species_is_endangered_name ON species(is_endangered, scientific_name);


-- PLANT_OBSERVATIONS TABLE — MAP, AI, & VALIDATION OPTIMIZATION
-- Purpose: Speed up AI verification, user history, and mapping operations
CREATE INDEX idx_observations_user_species ON plant_observations(user_id, species_id);
CREATE INDEX idx_observations_status_created ON plant_observations(status, created_at);
CREATE INDEX idx_observations_location ON plant_observations(location_latitude, location_longitude);


-- SENSOR_DEVICES TABLE — IOT NODE MANAGEMENT
-- Purpose: Enhance sensor device lookups, map display, and link to species
CREATE INDEX idx_devices_node ON sensor_devices(node_id);
CREATE INDEX idx_devices_species_active ON sensor_devices(species_id, is_active);
CREATE INDEX idx_devices_location ON sensor_devices(location_latitude, location_longitude);


-- SENSOR_READINGS TABLE — IOT DATA ANALYTICS
-- Purpose: Optimize IoT data retrieval and alert generation
CREATE INDEX idx_readings_device_time ON sensor_readings(device_id, reading_timestamp);
CREATE INDEX idx_readings_status_time ON sensor_readings(reading_status, reading_timestamp);
CREATE INDEX idx_readings_environment ON sensor_readings(temperature, humidity, soil_moisture);


-- ALERTS TABLE — ADMIN DASHBOARD & MONITORING
-- Purpose: Make filtering alerts faster on the dashboard
CREATE INDEX idx_alerts_type_resolved ON alerts(alert_type, is_resolved);
CREATE INDEX idx_alerts_severity_time ON alerts(severity, created_at);


-- USERS TABLE — AUTHENTICATION & ROLE FILTERING
-- Purpose: Speed up login, user management, and report generation
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_active_role ON users(is_active, role_id);


-- AI_RESULTS TABLE — AI MODEL ANALYTICS
-- Purpose: Optimize retrieval of AI predictions & confidence scores
CREATE INDEX idx_ai_results_observation ON ai_results(observation_id);
CREATE INDEX idx_ai_results_confidence ON ai_results(confidence_score);


