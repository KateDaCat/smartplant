// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Create an Express application
const app = express();
// Define the port number for the server to listen on
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Add this to handle JSON data

// Configure MySQL connection parameters
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use your MySQL username
  password: '', // Use your MySQL password
  database: 'sarawak_plant_db', // Use your database name
  port: 3307
});

// Connect to MySQL database
db.connect(err => {
  if (err) {
    // Log connection error if any
    console.error('Error connecting to MySQL:', err);
    return;
  }
  // Log successful MySQL connection
  console.log('Connected to MySQL');
});

// API ROUTES FOR YOUR NEW TABLES:

// ---------- Utility: simple query wrapper ----------
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// ================== Basic health Checking ==================
app.get('/', (req, res) => res.send('Sarawak Plant Backend OK'));

/* ------------------ ROLES ------------------ */
app.get('/roles', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Roles ORDER BY role_id');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching roles'); }
});

app.post('/roles', async (req, res) => {
  const { role_name, description } = req.body;
  try {
    const r = await runQuery('INSERT INTO Roles (role_name, description) VALUES (?, ?)', [role_name, description]);
    res.json({ message: 'Role created', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating role'); }
});


/* ------------------ USERS ------------------ */
app.get('/users', async (req, res) => {
  try {
    const rows = await runQuery('SELECT user_id, username, email, role_id, avatar_url, created_at FROM Users ORDER BY user_id');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching users'); }
});

app.get('/users/:id', async (req, res) => {
  try {
    const rows = await runQuery('SELECT user_id, username, email, role_id, avatar_url, created_at FROM Users WHERE user_id = ?', [req.params.id]);
    res.json(rows[0] || {});
  } catch (e) { res.status(500).send('Error fetching user'); }
});

app.post('/users', async (req, res) => {
  // NOTE: password_hash should be produced by backend (bcrypt) in production
  const { username, email, password_hash, role_id, avatar_url } = req.body;
  try {
    const r = await runQuery('INSERT INTO Users (username, email, password_hash, role_id, avatar_url) VALUES (?, ?, ?, ?, ?)', [username, email, password_hash, role_id, avatar_url]);
    res.json({ message: 'User created', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating user'); }
});

app.put('/users/:id', async (req, res) => {
  const { username, email, role_id, avatar_url } = req.body;
  try {
    await runQuery('UPDATE Users SET username=?, email=?, role_id=?, avatar_url=? WHERE user_id=?', [username, email, role_id, avatar_url, req.params.id]);
    res.json({ message: 'User updated' });
  } catch (e) { res.status(500).send('Error updating user'); }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM Users WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (e) { res.status(500).send('Error deleting user'); }
});


/* ------------------ SPECIES ------------------ */
app.get('/species', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Species ORDER BY species_id');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching species'); }
});

app.get('/species/:id', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Species WHERE species_id = ?', [req.params.id]);
    res.json(rows[0] || {});
  } catch (e) { res.status(500).send('Error fetching species'); }
});

app.post('/species', async (req, res) => {
  const { scientific_name, common_name, is_endangered, description, image_url } = req.body;
  try {
    const r = await runQuery('INSERT INTO Species (scientific_name, common_name, is_endangered, description, image_url) VALUES (?, ?, ?, ?, ?)', [scientific_name, common_name, is_endangered ? 1 : 0, description, image_url]);
    res.json({ message: 'Species created', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating species'); }
});

app.put('/species/:id', async (req, res) => {
  const { scientific_name, common_name, is_endangered, description, image_url } = req.body;
  try {
    await runQuery('UPDATE Species SET scientific_name=?, common_name=?, is_endangered=?, description=?, image_url=? WHERE species_id=?', [scientific_name, common_name, is_endangered ? 1 : 0, description, image_url, req.params.id]);
    res.json({ message: 'Species updated' });
  } catch (e) { res.status(500).send('Error updating species'); }
});

app.delete('/species/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM Species WHERE species_id = ?', [req.params.id]);
    res.json({ message: 'Species deleted' });
  } catch (e) { res.status(500).send('Error deleting species'); }
});


/* ------------------ PLANT OBSERVATIONS ------------------ */
app.get('/plant-observations', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Plant_Observations ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching observations'); }
});

app.get('/plant-observations/:id', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Plant_Observations WHERE observation_id = ?', [req.params.id]);
    res.json(rows[0] || {});
  } catch (e) { res.status(500).send('Error fetching observation'); }
});

app.post('/plant-observations', async (req, res) => {
  const { user_id, species_id, photo_url, location_latitude, location_longitude, location_name, notes, source, status } = req.body;
  try {
    const r = await runQuery(
      `INSERT INTO Plant_Observations (user_id, species_id, photo_url, location_latitude, location_longitude, location_name, notes, source, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, species_id, photo_url, location_latitude, location_longitude, location_name, notes, source || 'camera', status || 'pending']
    );
    res.json({ message: 'Observation created', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating observation'); }
});

app.put('/plant-observations/:id', async (req, res) => {
  const { species_id, photo_url, location_latitude, location_longitude, location_name, notes, source, status } = req.body;
  try {
    await runQuery(
      `UPDATE Plant_Observations SET species_id=?, photo_url=?, location_latitude=?, location_longitude=?, location_name=?, notes=?, source=?, status=? WHERE observation_id=?`,
      [species_id, photo_url, location_latitude, location_longitude, location_name, notes, source, status, req.params.id]
    );
    res.json({ message: 'Observation updated' });
  } catch (e) { res.status(500).send('Error updating observation'); }
});

app.delete('/plant-observations/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM Plant_Observations WHERE observation_id = ?', [req.params.id]);
    res.json({ message: 'Observation deleted' });
  } catch (e) { res.status(500).send('Error deleting observation'); }
});


/* ------------------ SENSOR_DEVICES ------------------ */
app.get('/sensor-devices', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Sensor_Devices ORDER BY device_id');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching devices'); }
});

app.post('/sensor-devices', async (req, res) => {
  const { node_id, device_name, species_id, location_latitude, location_longitude, is_active } = req.body;
  try {
    const r = await runQuery('INSERT INTO Sensor_Devices (node_id, device_name, species_id, location_latitude, location_longitude, is_active) VALUES (?, ?, ?, ?, ?, ?)', [node_id, device_name, species_id, location_latitude, location_longitude, is_active ? 1 : 0]);
    res.json({ message: 'Device created', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating device'); }
});

app.put('/sensor-devices/:id', async (req, res) => {
  const { node_id, device_name, species_id, location_latitude, location_longitude, is_active } = req.body;
  try {
    await runQuery('UPDATE Sensor_Devices SET node_id=?, device_name=?, species_id=?, location_latitude=?, location_longitude=?, is_active=? WHERE device_id=?', [node_id, device_name, species_id, location_latitude, location_longitude, is_active ? 1 : 0, req.params.id]);
    res.json({ message: 'Device updated' });
  } catch (e) { res.status(500).send('Error updating device'); }
});

app.delete('/sensor-devices/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM Sensor_Devices WHERE device_id = ?', [req.params.id]);
    res.json({ message: 'Device deleted' });
  } catch (e) { res.status(500).send('Error deleting device'); }
});


/* ------------------ AI_RESULTS ------------------ */
app.get('/ai-results', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM AI_Results ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching AI results'); }
});

app.post('/ai-results', async (req, res) => {
  const { observation_id, species_id, confidence_score, rank } = req.body;
  try {
    const r = await runQuery('INSERT INTO AI_Results (observation_id, species_id, confidence_score, rank) VALUES (?, ?, ?, ?)', [observation_id, species_id, confidence_score, rank]);
    res.json({ message: 'AI result stored', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating AI result'); }
});

app.delete('/ai-results/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM AI_Results WHERE ai_result_id = ?', [req.params.id]);
    res.json({ message: 'AI result deleted' });
  } catch (e) { res.status(500).send('Error deleting AI result'); }
});


/* ------------------ SENSOR_READINGS ------------------ */
app.get('/sensor-readings', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Sensor_Readings ORDER BY reading_timestamp DESC');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching readings'); }
});

app.get('/sensor-readings/device/:device_id', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Sensor_Readings WHERE device_id = ? ORDER BY reading_timestamp DESC', [req.params.device_id]);
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching readings'); }
});

// IoT POST endpoint (device -> backend)
app.post('/sensor-data', async (req, res) => {
  const { device_id, temperature, humidity, soil_moisture, motion_detected, reading_status, location_latitude, location_longitude, alert_generated, reading_timestamp} = req.body;
  try {
    const r = await runQuery(
      `INSERT INTO Sensor_Readings (device_id, temperature, humidity, soil_moisture, motion_detected, reading_status, location_latitude, location_longitude, alert_generated, reading_timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, NOW())`,
      [device_id, temperature, humidity, soil_moisture, motion_detected ? 1 : 0, reading_status || 'ok', location_latitude, location_longitude]
    );
    res.json({ message: 'Sensor reading stored', id: r.insertId });
  } catch (e) { res.status(500).send('Error inserting sensor reading'); }
});

app.delete('/sensor-readings/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM Sensor_Readings WHERE reading_id = ?', [req.params.id]);
    res.json({ message: 'Reading deleted' });
  } catch (e) { res.status(500).send('Error deleting reading'); }
});


/* ------------------ ALERTS ------------------ */
app.get('/alerts', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM Alerts ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).send('Error fetching alerts'); }
});

app.post('/alerts', async (req, res) => {
  const { device_id, reading_id, alert_type, alert_message, severity } = req.body;
  try {
    const r = await runQuery('INSERT INTO Alerts (device_id, reading_id, alert_type, alert_message, severity) VALUES (?, ?, ?, ?, ?)', [device_id, reading_id, alert_type, alert_message, severity || 'medium']);
    res.json({ message: 'Alert created', id: r.insertId });
  } catch (e) { res.status(500).send('Error creating alert'); }
});

app.patch('/alerts/:id/resolve', async (req, res) => {
  try {
    await runQuery('UPDATE Alerts SET is_resolved = 1, resolved_at = NOW() WHERE alert_id = ?', [req.params.id]);
    res.json({ message: 'Alert resolved' });
  } catch (e) { res.status(500).send('Error resolving alert'); }
});

app.delete('/alerts/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM Alerts WHERE alert_id = ?', [req.params.id]);
    res.json({ message: 'Alert deleted' });
  } catch (e) { res.status(500).send('Error deleting alert'); }
});


/* ------------------ DASHBOARD STATS ------------------ */
app.get('/dashboard/stats', async (req, res) => {
  try {
    const totals = await Promise.all([
      runQuery('SELECT COUNT(*) AS count FROM Species'),
      runQuery('SELECT COUNT(*) AS count FROM Plant_Observations'),
      runQuery('SELECT COUNT(*) AS count FROM Sensor_Devices WHERE is_active = 1'),
      runQuery('SELECT COUNT(*) AS count FROM Alerts WHERE is_resolved = 0'),
      runQuery('SELECT COUNT(*) AS count FROM Sensor_Readings')
    ]);
    res.json({
      totalSpecies: totals[0][0].count,
      totalObservations: totals[1][0].count,
      activeDevices: totals[2][0].count,
      unresolvedAlerts: totals[3][0].count,
      totalReadings: totals[4][0].count
    });
  } catch (e) { res.status(500).send('Error fetching dashboard stats'); }
});


/* ------------------ START SERVER ------------------ */
app.listen(PORT, () => console.log(`Backend running at http://127.0.0.1:${PORT}`));