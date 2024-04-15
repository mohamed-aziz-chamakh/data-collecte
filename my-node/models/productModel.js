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

async function createProduct(name,categorie, description, prix_unitaire, quantite, status) {
  return await db('produit').insert({ name,categorie, description, prix_unitaire, quantite, status });
}

async function getAllProducts() {
  return await db('produit').select('*');
}

async function getProductById(id) {
  const product = await db('produit').where({ idprod: id }).first();
  return product || null;
}

async function updateProduct(idprod, name,categorie, description, prix_unitaire, quantite, status) {
  return await db('produit').where({ idprod }).update({ name,categorie, description, prix_unitaire, quantite, status });
}

async function deleteProduct(idprod) {
  return await db('produit').where({ idprod }).del();
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
