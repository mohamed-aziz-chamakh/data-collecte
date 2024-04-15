const express = require('express');
const router = express.Router();
const data_collected = require('../models/datacollectedModel');



router.post('/datacollected', async (req, res) => {
  try {
    const { sensor_id, gateway_id, measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration} = req.body;
    const newCollecte = await data_collected.createCollecte(sensor_id, gateway_id, measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration);
    res.json({ message: 'Collecte inserted successfully' });

} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create collecte' });
  }
});



router.get('/datacollected', async (req, res) => {
  try {
    const newCollecte = await data_collected.getAllCollectes();
    res.json(newCollecte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collectes' });
  }
});



router.get('/datacollected/sensor/:sensor_id', async (req, res) => {
  try {
    const { sensor_id } = req.params;
    const collectes = await data_collected.getCollectesBySensorId(sensor_id);
    res.json(collectes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collectes for sensor' });
  }
});



router.get('/datacollected/gateway/:gateway_id', async (req, res) => {
  try {
    const { gateway_id } = req.params;
    const collectes = await data_collected.getCollectesByGatewayId(gateway_id);
    res.json(collectes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch collectes for gateway' });
  }
});



router.put('/datacollected/:sensor_id/:gateway_id', async (req, res) => {
  try {
    const { sensor_id, gateway_id } = req.params;
    const { measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration } = req.body;

    // Check if the collecte exists
    const existingCollecte = await data_collected.getCollecteByIds(sensor_id, gateway_id);
    if (!existingCollecte) {
      return res.status(404).json({ error: 'Collecte not found' });
    }

    // Update the collecte
    await data_collected.updateCollecte(sensor_id, gateway_id,measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration);
    res.json({ message: 'Collecte updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update collecte' });
  }
});


router.delete('/datacollected/:sensor_id/:gateway_id', async (req, res) => {
  try {
    const { sensor_id, gateway_id } = req.params;

    // Check if the collecte exists
    const existingCollecte = await data_collected.getCollecteByIds(sensor_id, gateway_id);
    if (!existingCollecte) {
      return res.status(404).json({ error: 'Collecte not found' });
    }

    // Delete the collecte
    await data_collected.deleteCollecte(sensor_id, gateway_id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete collecte' });
  }
});



router.get('/datacollected/:sensor_id/:gateway_id', async (req, res) => {
  try {
    const { sensor_id, gateway_id } = req.params;

    // Get the collecte by sensor_id and gateway_id
    const collecte = await data_collected.getCollecteByIds(sensor_id, gateway_id);
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