const knex = require('knex');

const db = knex({
    client: 'pg', // specify your database client (e.g., 'pg' for PostgreSQL, 'mysql' for MySQL)
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '123',
      database: 'postgres'
    }
  });

async function createSensor(name,adresse_ip, description, type, status) {
  return await db('sensor').insert({ name,adresse_ip, description, type,status });
}

async function getAllSensors() {
  return await db('sensor').select('*');
}

async function getSensorById(id) {
  const sensor = await db('sensor').where({ sensor_id: id }).first();
  return sensor || null; // Return null if sensor doesn't exist
}


async function updateSensor(id, name,adresse_ip, description, type,status) {
  return await db('sensor').where({ sensor_id: id }).update({ name,adresse_ip, description, type, status });
}

async function deleteSensor(id) {
  return await db('sensor').where({ sensor_id: id }).del();
}

module.exports = { createSensor, getAllSensors, getSensorById, updateSensor, deleteSensor };
