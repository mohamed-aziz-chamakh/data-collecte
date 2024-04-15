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

async function createComposition(gateway_id, id_produit) {
  return await db('composition').insert({ gateway_id, id_produit });
}

async function getAllCompositions() {
  return await db('composition').select('*');
}
async function getCompositionByIds(gateway_id, id_produit) {
  return await db('composition').where({ gateway_id, id_produit }).first();
}


async function getCompositionByGatewayId(gateway_id) {
  return await db('composition').where({ gateway_id }).select('id_produit');
}

async function getCompositionByProduitId(id_produit) {
  return await db('composition').where({ id_produit }).select('gateway_id');
}

async function deleteComposition(gateway_id, id_produit) {
  return await db('composition').where({ gateway_id, id_produit }).del();
}
async function updateComposition(gateway_id, id_produit, new_gateway_id, new_id_produit) {
  try {
    // Update the composition in the database
    await db('composition')
      .where({ gateway_id, id_produit })
      .update({ gateway_id: new_gateway_id, id_produit: new_id_produit });
  } catch (error) {
    throw new Error('Failed to update composition');
  }
}

module.exports = { getCompositionByIds,updateComposition,createComposition, getAllCompositions, getCompositionByGatewayId, getCompositionByProduitId ,deleteComposition};
