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

async function createCollecte(sensor_id, gateway_id, mesure, taux_erreur, unite) {
  return await db('collecte').insert({ sensor_id, gateway_id, mesure, taux_erreur, unite });
}

async function getAllCollectes() {
  return await db('collecte').select('*');
}

async function getCollectesBySensorId(sensor_id) {
  return await db('collecte').where({ sensor_id });
}

async function getCollectesByGatewayId(gateway_id) {
  return await db('collecte').where({ gateway_id });
}
async function deleteCollecte(gateway_id, sensor_id) {
  return await db('collecte').where({ gateway_id, sensor_id }).del();
}
async function updateCollecte(sensor_id, gateway_id, mesure, taux_erreur, unite) {
  return await db('collecte')
    .where({ sensor_id, gateway_id })
    .update({ mesure, taux_erreur, unite });
}
async function getCollecteByIds(sensor_id, gateway_id) {
  return await db('collecte').where({ sensor_id, gateway_id }).first();
}


module.exports = { getCollecteByIds,updateCollecte,createCollecte, getAllCollectes, getCollectesBySensorId, getCollectesByGatewayId,deleteCollecte };
