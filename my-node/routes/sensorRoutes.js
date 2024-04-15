const express = require('express');
const router = express.Router();
const sensorModel = require('../models/sensorModel');

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: Operations related to sensors
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sensor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         adresse_ip : 
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         status:
 *           type: string
 *       required:
 *         - name
 *         - description
 *         - type
 *         - status
 */

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Create a new sensor
 *     description: Create a new sensor with the provided information.
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       '201':
 *         description: New sensor created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */

router.post('/sensors', async (req, res) => {
  try {
    const { name,adresse_ip, description, type ,status} = req.body;
    const newSensor = await sensorModel.createSensor(name,adresse_ip, description, type,status);
    res.status(201).json(newSensor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create sensor' });
  }
});

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Get all sensors
 *     description: Retrieve a list of all sensors.
 *     tags: [Sensors]
 *     responses:
 *       '200':
 *         description: List of sensors retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 */

router.get('/sensors', async (req, res) => {
  try {
    const sensors = await sensorModel.getAllSensors();
    res.json(sensors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch sensors' });
  }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   get:
 *     summary: Get a sensor by ID
 *     description: Retrieve details of a sensor by its ID.
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sensor to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Sensor details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */

router.get('/sensors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await sensorModel.getSensorById(id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json(sensor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch sensor' });
  }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   put:
 *     summary: Update a sensor
 *     description: Update an existing sensor by its ID.
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sensor to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       '200':
 *         description: Sensor updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */

router.put('/sensors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name,adresse_ip, description, type, status } = req.body;

    // Check if the sensor exists
    const existingSensor = await sensorModel.getSensorById(id);
    if (!existingSensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    // Update the sensor
    await sensorModel.updateSensor(id, name,adresse_ip, description, type, status);
    res.json({ message: 'Sensor updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update sensor' });
  }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   delete:
 *     summary: Delete a sensor
 *     description: Delete an existing sensor by its ID.
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sensor to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Sensor deleted successfully.
 */

router.delete('/sensors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the sensor exists
    const existingSensor = await sensorModel.getSensorById(id);
    if (!existingSensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    // Delete the sensor
    await sensorModel.deleteSensor(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete sensor' });
  }
});

module.exports = router;
