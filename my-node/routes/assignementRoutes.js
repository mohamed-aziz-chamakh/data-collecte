const express = require('express');
const router = express.Router();
const assignementModel = require('../models/assignementModel');

/**
 * @swagger
 * tags:
 *   name: Assignements
 *   description: Operations related to assignements
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignement:
 *       type: object
 *       properties:
 *         gateway_id:
 *           type: integer
 *         sensor_id:
 *           type: integer
 *       required:
 *         - gateway_id
 *         - sensor_id
 */

/**
 * @swagger
 * /api/assignements:
 *   post:
 *     summary: Create a new assignement
 *     description: Create a new assignement with the provided information.
 *     tags: [Assignements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignement'
 *     responses:
 *       '201':
 *         description: New assignement created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignement'
 */

router.post('/assignements', async (req, res) => {
  try {
    const { gateway_id, sensor_id } = req.body;
    const newAssignement = await assignementModel.createAssignement(gateway_id, sensor_id);
    res.status(201).json(newAssignement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create assignement' });
  }
});

/**
 * @swagger
 * /api/assignements:
 *   get:
 *     summary: Get all assignements
 *     description: Retrieve a list of all assignements.
 *     tags: [Assignements]
 *     responses:
 *       '200':
 *         description: List of assignements retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignement'
 */

router.get('/assignements', async (req, res) => {
  try {
    const assignements = await assignementModel.getAllAssignements();
    res.json(assignements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch assignements' });
  }
});

/**
 * @swagger
 * /api/assignements/gateway/{gateway_id}:
 *   get:
 *     summary: Get assignements by gateway ID
 *     description: Retrieve a list of assignements by gateway ID.
 *     tags: [Assignements]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of assignements retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignement'
 */

router.get('/assignements/gateway/:gateway_id', async (req, res) => {
  try {
    const { gateway_id } = req.params;
    const assignements = await assignementModel.getAssignementByGatewayId(gateway_id);
    res.json(assignements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch assignements for gateway' });
  }
});

/**
 * @swagger
 * /api/assignements/sensor/{sensor_id}:
 *   get:
 *     summary: Get assignements by sensor ID
 *     description: Retrieve a list of assignements by sensor ID.
 *     tags: [Assignements]
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of assignements retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignement'
 */

router.get('/assignements/sensor/:sensor_id', async (req, res) => {
  try {
    const { sensor_id } = req.params;
    const assignements = await assignementModel.getAssignementBySensorId(sensor_id);
    res.json(assignements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch assignements for sensor' });
  }
});

/**
 * @swagger
 * /api/assignements/{old_gateway_id}/{old_sensor_id}:
 *   put:
 *     summary: Update an assignement
 *     description: Update an existing assignement by its old gateway ID and old sensor ID.
 *     tags: [Assignements]
 *     parameters:
 *       - in: path
 *         name: old_gateway_id
 *         required: true
 *         description: ID of the old gateway.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: old_sensor_id
 *         required: true
 *         description: ID of the old sensor.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignement'
 *     responses:
 *       '200':
 *         description: Assignement updated successfully.
 */

router.put('/assignements/:old_gateway_id/:old_sensor_id', async (req, res) => {
  try {
    const { old_gateway_id, old_sensor_id } = req.params;
    const { new_gateway_id, new_sensor_id } = req.body;

    // Check if the assignement exists
    const existingAssignement = await assignementModel.getAssignementByIds(old_gateway_id, old_sensor_id);
    if (!existingAssignement) {
      return res.status(404).json({ error: 'Assignement not found' });
    }

    // Update the assignement
    await assignementModel.updateAssignement(old_gateway_id, old_sensor_id, new_gateway_id, new_sensor_id);
    res.json({ message: 'Assignement updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update assignement' });
  }
});

/**
 * @swagger
 * /api/assignements/{gateway_id}/{sensor_id}:
 *   delete:
 *     summary: Delete an assignement
 *     description: Delete an existing assignement by its gateway ID and sensor ID.
 *     tags: [Assignements]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Assignement deleted successfully.
 */

router.delete('/assignements/:gateway_id/:sensor_id', async (req, res) => {
  try {
    const { gateway_id, sensor_id } = req.params;

    // Check if the assignement exists
    const existingAssignement = await assignementModel.getAssignementByIds(gateway_id, sensor_id);
    if (!existingAssignement) {
      return res.status(404).json({ error: 'Assignement not found' });
    }

    // Delete the assignement
    await assignementModel.deleteAssignement(gateway_id, sensor_id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete assignement' });
  }
});

/**
 * @swagger
 * /api/assignements/{gateway_id}/{sensor_id}:
 *   get:
 *     summary: Get an assignement by IDs
 *     description: Retrieve details of an assignement by its gateway ID and sensor ID.
 *     tags: [Assignements]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Assignement details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignement'
 */

router.get('/assignements/:gateway_id/:sensor_id', async (req, res) => {
  try {
    const { gateway_id, sensor_id } = req.params;

    // Get the assignement by gateway_id and sensor_id
    const assignement = await assignementModel.getAssignementByIds(gateway_id, sensor_id);
    if (!assignement) {
      return res.status(404).json({ error: 'Assignement not found' });
    }

    res.json(assignement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch assignement' });
  }
});

module.exports = router;
