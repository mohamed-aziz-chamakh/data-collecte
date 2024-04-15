const express = require('express');
const router = express.Router();
const compositionModel = require('../models/compositionModel');

/**
 * @swagger
 * tags:
 *   name: Compositions
 *   description: Operations related to compositions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Composition:
 *       type: object
 *       properties:
 *         gateway_id:
 *           type: integer
 *         id_produit:
 *           type: integer
 *       required:
 *         - gateway_id
 *         - id_produit
 */

/**
 * @swagger
 * /api/compositions:
 *   post:
 *     summary: Create a new composition
 *     description: Create a new composition with the provided information.
 *     tags: [Compositions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Composition'
 *     responses:
 *       '201':
 *         description: New composition created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Composition'
 */

router.post('/compositions', async (req, res) => {
  try {
    const { gateway_id, id_produit } = req.body;
    const newComposition = await compositionModel.createComposition(gateway_id, id_produit);
    res.status(201).json(newComposition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create composition' });
  }
});

/**
 * @swagger
 * /api/compositions:
 *   get:
 *     summary: Get all compositions
 *     description: Retrieve a list of all compositions.
 *     tags: [Compositions]
 *     responses:
 *       '200':
 *         description: List of compositions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Composition'
 */

router.get('/compositions', async (req, res) => {
  try {
    const compositions = await compositionModel.getAllCompositions();
    res.json(compositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch compositions' });
  }
});

/**
 * @swagger
 * /api/compositions/{gateway_id}/{id_produit}:
 *   get:
 *     summary: Get a composition by gateway ID and product ID
 *     description: Retrieve details of a composition by its gateway ID and product ID.
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_produit
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Composition details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Composition'
 */

router.get('/compositions/:gateway_id/:id_produit', async (req, res) => {
  try {
    const { gateway_id, id_produit } = req.params;
    const composition = await compositionModel.getCompositionByIds(gateway_id, id_produit);
    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }
    res.json(composition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch composition' });
  }
});

/**
 * @swagger
 * /api/compositions/gateway/{gateway_id}:
 *   get:
 *     summary: Get compositions by gateway ID
 *     description: Retrieve a list of compositions by gateway ID.
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of compositions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Composition'
 */

router.get('/compositions/gateway/:gateway_id', async (req, res) => {
  try {
    const { gateway_id } = req.params;
    const compositions = await compositionModel.getCompositionByGatewayId(gateway_id);
    res.json(compositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch compositions for gateway' });
  }
});

/**
 * @swagger
 * /api/compositions/produit/{id_produit}:
 *   get:
 *     summary: Get compositions by product ID
 *     description: Retrieve a list of compositions by product ID.
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id_produit
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of compositions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Composition'
 */

router.get('/compositions/produit/:id_produit', async (req, res) => {
  try {
    const { id_produit } = req.params;
    const compositions = await compositionModel.getCompositionByProduitId(id_produit);
    res.json(compositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch compositions for produit' });
  }
});

/**
 * @swagger
 * /api/compositions/{gateway_id}/{id_produit}:
 *   put:
 *     summary: Update a composition
 *     description: Update an existing composition by its gateway ID and product ID.
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_produit
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Composition'
 *     responses:
 *       '200':
 *         description: Composition updated successfully.
 */

router.put('/compositions/:gateway_id/:id_produit', async (req, res) => {
  try {
    const { gateway_id, id_produit } = req.params;
    const { new_gateway_id, new_id_produit } = req.body;

    // Check if the composition exists
    const existingComposition = await compositionModel.getCompositionByIds(gateway_id, id_produit);
    if (!existingComposition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    // Update the composition
    await compositionModel.updateComposition(gateway_id, id_produit, new_gateway_id, new_id_produit);
    res.json({ message: 'Composition updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update composition' });
  }
});

/**
 * @swagger
 * /api/compositions/{gateway_id}/{id_produit}:
 *   delete:
 *     summary: Delete a composition
 *     description: Delete an existing composition by its gateway ID and product ID.
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: gateway_id
 *         required: true
 *         description: ID of the gateway.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_produit
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Composition deleted successfully.
 */

router.delete('/compositions/:gateway_id/:id_produit', async (req, res) => {
  try {
    const { gateway_id, id_produit } = req.params;

    // Check if the composition exists
    const existingComposition = await compositionModel.getCompositionByIds(gateway_id, id_produit);
    if (!existingComposition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    // Delete the composition
    await compositionModel.deleteComposition(gateway_id, id_produit);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete composition' });
  }
});

module.exports = router;
