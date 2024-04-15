const express = require('express');
const router = express.Router();
const gatewayModel = require('../models/gatewayModel');

/**
 * @swagger
 * tags:
 *   name: Gateways
 *   description: Operations related to gateways
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gateway:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nom:
 *           type: string
 *         adresse_ip:
 *           type: string
 *         adresse_mac:
 *           type: string
 *         type:
 *           type: string
 *         status:
 *           type: string
 *       required:
 *         - nom
 *         - adresse_ip
 *         - adresse_mac
 *         - type
 *         - status
 */

/**
 * @swagger
 * /api/gateways:
 *   post:
 *     summary: Create a new gateway
 *     description: Create a new gateway with the provided information.
 *     tags: [Gateways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gateway'
 *     responses:
 *       '201':
 *         description: New gateway created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 */

router.post('/gateways', async (req, res) => {
  try {
    const { nom, adresse_ip, adresse_mac, type, status } = req.body;
    const newGateway = await gatewayModel.createGateway(nom, adresse_ip, adresse_mac, type, status);
    res.status(201).json(newGateway);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create gateway' });
  }
});

/**
 * @swagger
 * /api/gateways:
 *   get:
 *     summary: Get all gateways
 *     description: Retrieve a list of all gateways.
 *     tags: [Gateways]
 *     responses:
 *       '200':
 *         description: List of gateways retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gateway'
 */

router.get('/gateways', async (req, res) => {
  try {
    const gateways = await gatewayModel.getAllGateways();
    res.json(gateways);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch gateways' });
  }
});

/**
 * @swagger
 * /api/gateways/{gateway_id}:
 *   get:
 *     summary: Get a gateway by ID
 *     description: Retrieve details of a gateway by its ID.
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Gateway details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 */

router.get('/gateways/:gateway_id', async (req, res) => {
  try {
    const { gateway_id } = req.params;
    const gateway = await gatewayModel.getGatewayById(gateway_id);
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    res.json(gateway);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch gateway' });
  }
});

/**
 * @swagger
 * /api/gateways/{id}:
 *   put:
 *     summary: Update a gateway
 *     description: Update an existing gateway by its ID.
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the gateway to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gateway'
 *     responses:
 *       '200':
 *         description: Gateway updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gateway'
 */

router.put('/gateways/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse_ip, adresse_mac, type, status } = req.body;
    const existingGateway = await gatewayModel.getGatewayById(id);
    if (!existingGateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    await gatewayModel.updateGateway(id, nom, adresse_ip, adresse_mac, type, status);
    res.json({ message: 'Gateway updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update gateway' });
  }
});

/**
 * @swagger
 * /api/gateways/{id}:
 *   delete:
 *     summary: Delete a gateway
 *     description: Delete an existing gateway by its ID.
 *     tags: [Gateways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the gateway to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Gateway deleted successfully.
 */

router.delete('/gateways/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingGateway = await gatewayModel.getGatewayById(id);
    if (!existingGateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    await gatewayModel.deleteGateway(id);
    res.json({ message: 'Gateway deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete gateway' });
  }
});

module.exports = router;
