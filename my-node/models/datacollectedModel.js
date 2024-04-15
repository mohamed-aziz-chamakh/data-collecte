const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '123',
    database: 'postgres'
  }
});

async function createCollecte(sensor_id, gateway_id, measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration) {
  return await db('data_collected').insert({ sensor_id, gateway_id, measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration });
}

async function getAllCollectes() {
  return await db('data_collected').select('*');
}

async function getCollectesBySensorId(sensor_id) {
  return await db('data_collected').where({ sensor_id });
}

async function getCollectesByGatewayId(gateway_id) {
  return await db('data_collected').where({ gateway_id });
}
async function deleteCollecte(gateway_id, sensor_id) {
  return await db('data_collected').where({ gateway_id, sensor_id }).del();
}
async function updateCollecte(sensor_id, gateway_id, measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration) {
  return await db('data_collected')
    .where({ sensor_id, gateway_id })
    .update({  measurement, measurement_accuracy, unit,data_quality,transmission_protocol,status,battery_level,signal_strength,latitude,longitude,altitude,sensor_configuration});
}
async function getCollecteByIds(sensor_id, gateway_id) {
  return await db('data_collected').where({ sensor_id, gateway_id }).first();
}


module.exports = { getCollecteByIds,updateCollecte,createCollecte, getAllCollectes, getCollectesBySensorId, getCollectesByGatewayId,deleteCollecte };