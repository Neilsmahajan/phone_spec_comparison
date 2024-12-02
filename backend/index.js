require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware to parse JSON body
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
}));

app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint to fetch devices based on selected brands
app.get('/devices', async (req, res) => {
  console.log('GET /devices endpoint accessed');
  const { brandIds } = req.query;

  try {
    let query;
    let queryParams = [];

    if (brandIds) {
      const brandIdsArray = brandIds.split(',').map(id => parseInt(id, 10));
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        WHERE d.brand_id = ANY($1)
      `;
      queryParams = [brandIdsArray];
    } else {
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
      `;
    }

    const { rows } = await pool.query(query, queryParams);
    console.log('GET /devices successful');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch sorted device details (descending)
app.get('/devices/sort/desc', async (req, res) => {
  console.log('GET /devices/sort/desc endpoint accessed');
  const { brandIds } = req.query;
  
  try {
    let query;
    let queryParams = [];

    if (brandIds) {
      const brandIdsArray = brandIds.split(',').map(id => parseInt(id, 10));
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        WHERE d.brand_id = ANY($1)
        ORDER BY dd.release_date DESC
      `;
      queryParams = [brandIdsArray];
    } else {
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        ORDER BY dd.release_date DESC
      `;
    }

    const { rows } = await pool.query(query, queryParams);
    console.log('GET /devices/sort/desc successful');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sorted devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch sorted device details (ascending)
app.get('/devices/sort/asc', async (req, res) => {
  console.log('GET /devices/sort/asc endpoint accessed');
  const { brandIds } = req.query;
  
  try {
    let query;
    let queryParams = [];

    if (brandIds) {
      const brandIdsArray = brandIds.split(',').map(id => parseInt(id, 10));
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        WHERE d.brand_id = ANY($1)
        ORDER BY dd.release_date ASC
      `;
      queryParams = [brandIdsArray];
    } else {
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        ORDER BY dd.release_date ASC
      `;
    }

    const { rows } = await pool.query(query, queryParams);
    console.log('GET /devices/sort/asc successful');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sorted devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch devices sorted by price (ascending)
app.get('/devices/price/asc', async (req, res) => {
  console.log('GET /devices/price/asc endpoint accessed');
  const { brandIds } = req.query;
  
  try {
    let query;
    let queryParams = [];

    if (brandIds) {
      const brandIdsArray = brandIds.split(',').map(id => parseInt(id, 10));
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        WHERE d.brand_id = ANY($1)
        ORDER BY dd.price ASC NULLS LAST
      `;
      queryParams = [brandIdsArray];
    } else {
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        ORDER BY dd.price ASC NULLS LAST
      `;
    }

    const { rows } = await pool.query(query, queryParams);
    console.log('GET /devices/price/asc successful');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching price-sorted devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch devices sorted by price (descending)
app.get('/devices/price/desc', async (req, res) => {
  console.log('GET /devices/price/desc endpoint accessed');
  const { brandIds } = req.query;
  
  try {
    let query;
    let queryParams = [];

    if (brandIds) {
      const brandIdsArray = brandIds.split(',').map(id => parseInt(id, 10));
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        WHERE d.brand_id = ANY($1)
        ORDER BY dd.price DESC NULLS LAST
      `;
      queryParams = [brandIdsArray];
    } else {
      query = `
        SELECT dd.*, d.device_name, b.brand_name
        FROM devices d
        JOIN device_details dd ON d.device_id = dd.device_id
        JOIN brands b ON d.brand_id = b.brand_id
        ORDER BY dd.price DESC NULLS LAST
      `;
    }

    const { rows } = await pool.query(query, queryParams);
    console.log('GET /devices/price/desc successful');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching price-sorted devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to search devices by name
app.get('/devices/search', async (req, res) => {
  console.log('GET /devices/search endpoint accessed');
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const query = `
      SELECT dd.*, d.device_name, b.brand_name
      FROM devices d
      JOIN device_details dd ON d.device_id = dd.device_id
      JOIN brands b ON d.brand_id = b.brand_id
      WHERE LOWER(d.device_name) LIKE LOWER($1)
         OR LOWER(CONCAT(b.brand_name, ' ', d.device_name)) LIKE LOWER($1)
      ORDER BY dd.release_date DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    const { rows } = await pool.query(query, [searchPattern]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No devices found matching the search term' });
    }

    console.log('GET /devices/search successful');
    res.json(rows);
  } catch (error) {
    console.error('Error searching devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to delete a device and its details
app.delete('/devices/:deviceId', async (req, res) => {
  console.log('DELETE /devices/:deviceId endpoint accessed');
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // First delete from device_details due to foreign key constraint
    const deleteDetailsQuery = `
      DELETE FROM device_details 
      WHERE device_id = $1
    `;
    await pool.query(deleteDetailsQuery, [deviceId]);

    // Then delete from devices
    const deleteDeviceQuery = `
      DELETE FROM devices 
      WHERE device_id = $1
    `;
    const deleteResult = await pool.query(deleteDeviceQuery, [deviceId]);

    // If no device was found and deleted
    if (deleteResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Device not found' });
    }

    // Commit transaction
    await pool.query('COMMIT');

    console.log('DELETE /devices/:deviceId successful');
    res.json({ message: `Device ${deviceId} and its details successfully deleted` });
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Endpoint to update device details
app.put('/devices/:deviceId', async (req, res) => {
  console.log('PUT /devices/:deviceId endpoint accessed');
  const { deviceId } = req.params;
  const updateData = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Update data is required' });
  }

  try {
    // Create dynamic update query based on provided fields
    const validColumns = [
      'device_name',
      'device_image_url',
      'display_size',
      'display_res',
      'camera',
      'video',
      'ram',
      'chipset',
      'battery',
      'battery_type',
      'release_date',
      'body',
      'os_type',
      'storage',
      'price'
    ];

    // Filter out invalid columns and create SET clause
    const updates = Object.keys(updateData)
      .filter(key => validColumns.includes(key))
      .map((key, index) => `${key} = $${index + 2}`);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const query = `
      UPDATE device_details 
      SET ${updates.join(', ')}
      WHERE device_id = $1
      RETURNING *
    `;

    // Create values array with deviceId as first parameter
    const values = [deviceId, ...Object.values(updateData)
      .filter((_, index) => validColumns.includes(Object.keys(updateData)[index]))];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    console.log('PUT /devices/:deviceId successful');
    res.json({
      message: 'Device details updated successfully',
      updatedDevice: rows[0]
    });

  } catch (error) {
    console.error('Error updating device details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to create a new device 

app.post('/devices', async (req, res) => {
  console.log('POST /devices endpoint accessed');
  const newDevice = req.body;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // First insert into devices table
    const insertDeviceQuery = `
      INSERT INTO devices (device_id, device_name, device_image_url, brand_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const deviceValues = [
      newDevice.device_id,
      newDevice.device_name,
      newDevice.device_image_url,
      newDevice.brand_id
    ];

    await pool.query(insertDeviceQuery, deviceValues);

    // Then insert into device_details table
    const insertDetailsQuery = `
      INSERT INTO device_details (
        device_id, device_name, device_image_url, display_size,
        display_res, camera, video, ram, chipset, battery,
        battery_type, release_date, body, os_type, storage, price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const detailsValues = [
      newDevice.device_id,
      newDevice.device_name,
      newDevice.device_image_url,
      newDevice.display_size,
      newDevice.display_res,
      newDevice.camera,
      newDevice.video,
      newDevice.ram,
      newDevice.chipset,
      newDevice.battery,
      newDevice.battery_type,
      newDevice.release_date,
      newDevice.body,
      newDevice.os_type,
      newDevice.storage,
      newDevice.price
    ];

    const result = await pool.query(insertDetailsQuery, detailsValues);

    // Commit transaction
    await pool.query('COMMIT');

    console.log('POST /devices successful');
    res.status(201).json({
      message: 'Device created successfully',
      device: result.rows[0]
    });

  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});