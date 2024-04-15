const express = require('express');
const router = express.Router();
const collecteModel = require('../models/collecteModel');

/**
 * @swagger
 * tags:
 *   name: Collectes
 *   description: Operations related to collectes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Collecte:
 *       type: object
 *       properties:
 *         sensor_id:
 *           type: integer
 *         gateway_id:
 *           type: integer
 *         mesure:
 *           type: number
 *         taux_erreur:
 *           type: number
 *         unite:
 *           type: string
 *       required:
 *         - sensor_id
 *         - gateway_id
 *         - mesure
 *         - taux_erreur
 *         - unite
 */

/**
 * @swagger
 * /api/collectes:
 *   post:
 *     summary: Create a new collecte
 *     description: Create a new collecte with the provided information.
 *     tags: [Collectes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collecte'
 *     responses:
 *       '201':
 *         description: New collecte created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collecte'
 */

router.post('/collectes', async (req, res) => {
  try {
    const { sensor_id, gateway_id, mesure, taux_erreur, unite } = req.body;
    const newCollecte = await collecteModel.createCollecte(sensor_id, gateway_id, mesure, taux_erreur, unite);
    res.status(201).json(newCollecte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create collecte' });
  }
});

/**
 * @swagger
 * /api/collectes:
 *   get:
 *     summary: Get all collectes
 *     description: Retrieve a list of all collectes.
 *     tags: [Collectes]
 *     responses:
 *       '200':
 *         description: List of collectes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collecte'
 */

router.get('/collectes', async (req, res) => {
  try {
    const collectes = await collecteModel.getAllCollectes();
    res.json(collectes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collectes' });
  }
});

/**
 * @swagger
 * /api/collectes/sensor/{sensor_id}:
 *   get:
 *     summary: Get collectes by sensor ID
 *     description: Retrieve a list of collectes by sensor ID.
 *     tags: [Collectes]
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of collectes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collecte'
 */

router.get('/collectes/sensor/:sensor_id', async (req, res) => {
  try {
    const { sensor_id } = req.params;
    const collectes = await collecteModel.getCollectesBySensorId(sensor_id);
    res.json(collectes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collectes for sensor' });
  }
});

/**
 * @swagger
 * /api/collectes/gateway/{gateway_id}:
 *   get:
 *     summary: Get collectes by gateway ID
 *     description: Retrieve a list of collectes by gateway ID.
 *     tags: [Collectes]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of collectes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collecte'
 */

router.get('/collectes/gateway/:gateway_id', async (req, res) => {
  try {
    const { gateway_id } = req.params;
    const collectes = await collecteModel.getCollectesByGatewayId(gateway_id);
    res.json(collectes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collectes for gateway' });
  }
});

/**
 * @swagger
 * /api/collectes/{sensor_id}/{gateway_id}:
 *   put:
 *     summary: Update a collecte
 *     description: Update an existing collecte by its sensor ID and gateway ID.
 *     tags: [Collectes]
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collecte'
 *     responses:
 *       '200':
 *         description: Collecte updated successfully.
 */

router.put('/collectes/:sensor_id/:gateway_id', async (req, res) => {
  try {
    const { sensor_id, gateway_id } = req.params;
    const { mesure, taux_erreur, unite } = req.body;

    // Check if the collecte exists
    const existingCollecte = await collecteModel.getCollecteByIds(sensor_id, gateway_id);
    if (!existingCollecte) {
      return res.status(404).json({ error: 'Collecte not found' });
    }

    // Update the collecte
    await collecteModel.updateCollecte(sensor_id, gateway_id, mesure, taux_erreur, unite);
    res.json({ message: 'Collecte updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update collecte' });
  }
});

/**
 * @swagger
 * /api/collectes/{sensor_id}/{gateway_id}:
 *   delete:
 *     summary: Delete a collecte
 *     description: Delete an existing collecte by its sensor ID and gateway ID.
 *     tags: [Collectes]
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Collecte deleted successfully.
 */

router.delete('/collectes/:sensor_id/:gateway_id', async (req, res) => {
  try {
    const { sensor_id, gateway_id } = req.params;

    // Check if the collecte exists
    const existingCollecte = await collecteModel.getCollecteByIds(sensor_id, gateway_id);
    if (!existingCollecte) {
      return res.status(404).json({ error: 'Collecte not found' });
    }

    // Delete the collecte
    await collecteModel.deleteCollecte(sensor_id, gateway_id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete collecte' });
  }
});

/**
 * @swagger
 * /api/collectes/{sensor_id}/{gateway_id}:
 *   get:
 *     summary: Get a collecte by IDs
 *     description: Retrieve details of a collecte by its sensor ID and gateway ID.
 *     tags: [Collectes]
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *         required: true
 *         description: ID of the sensor.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Collecte details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collecte'
 */

router.get('/collectes/:sensor_id/:gateway_id', async (req, res) => {
  try {
    const { sensor_id, gateway_id } = req.params;

    // Get the collecte by sensor_id and gateway_id
    const collecte = await collecteModel.getCollecteByIds(sensor_id, gateway_id);
    if (!collecte) {
      return res.status(404).json({ error: 'Collecte not found' });
    }

    res.json(collecte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collecte' });
  }
});

module.exports = router;
