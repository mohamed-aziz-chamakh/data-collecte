const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         categorie:
 *           type: string
 *         description:
 *           type: string
 *         prix_unitaire:
 *           type: number
 *         quantite:
 *           type: integer
 *         status:
 *           type: string
 *       required:
 *         - name
 *         - categorie
 *         - description
 *         - prix_unitaire
 *         - quantite
 *         - status
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided information.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '201':
 *         description: New product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

router.post('/products', async (req, res) => {
  try {
    const { name, categorie, description, prix_unitaire, quantite, status } = req.body;
    const newProduct = await productModel.createProduct(name, categorie, description, prix_unitaire, quantite, status);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create product' });
  }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     tags: [Products]
 *     responses:
 *       '200':
 *         description: List of products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/products', async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch products' });
  }
});

/**
 * @swagger
 * /api/products/{idprod}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve details of a product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: idprod
 *         required: true
 *         description: ID of the product to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

router.get('/products/:idprod', async (req, res) => {
  try {
    const { idprod } = req.params;
    const product = await productModel.getProductById(idprod);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch product' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update an existing product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { categorie, description, prix_unitaire, quantite, status } = req.body;
    const existingProduct = await productModel.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await productModel.updateProduct(id, categorie, description, prix_unitaire, quantite, status);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update product' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete an existing product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Product deleted successfully.
 */

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await productModel.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await productModel.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete product' });
  }
});

module.exports = router;
