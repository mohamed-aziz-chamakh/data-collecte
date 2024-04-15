// routes.js

const express = require('express');
const sensorController = require('./controllers/sensorController');

const router = express.Router();

router.post('/sensors', sensorController.createSensor);
router.get('/sensors/:id', sensorController.getSensorById);
router.put('/sensors/:id', sensorController.updateSensor);
router.delete('/sensors/:id', sensorController.deleteSensor);

module.exports = router;
