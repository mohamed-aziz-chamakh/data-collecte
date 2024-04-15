const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Operations related to admins
 */

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Create a new admin
 *     description: Create a new admin with the provided information.
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               mail:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '201':
 *         description: New admin created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */

router.post('/admins', async (req, res) => {
  try {
    const { nom, prenom, mail, role } = req.body;
    const newAdmin = await adminModel.createAdmin(nom, prenom, mail, role);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create admin' });
  }
});

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     description: Retrieve a list of all admins.
 *     tags: [Admins]
 *     responses:
 *       '200':
 *         description: List of admins retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 */

router.get('/admins', async (req, res) => {
  try {
    const admins = await adminModel.getAllAdmins();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch admins' });
  }
});

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     description: Retrieve details of an admin by its ID.
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Admin details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */

router.get('/admins/:idadmin', async (req, res) => {
  try {
    const { idadmin } = req.params;
    const admin = await adminModel.getAdminById(idadmin);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch admin' });
  }
});

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Update an admin
 *     description: Update an existing admin by its ID.
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       '200':
 *         description: Admin updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */

router.put('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, mail, role } = req.body;
    const existingAdmin = await adminModel.getAdminById(id);
    if (!existingAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    await adminModel.updateAdmin(id, nom, prenom, mail, role);
    res.json({ message: 'Admin updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update admin' });
  }
});

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     description: Delete an existing admin by its ID.
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Admin deleted successfully.
 */

router.delete('/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingAdmin = await adminModel.getAdminById(id);
    if (!existingAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    await adminModel.deleteAdmin(id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete admin' });
  }
});

module.exports = router;
