exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('collecte').del()
    .then(function () {
      return knex('assignement').del();
    })
    .then(function () {
      return knex('composition').del();
    })
    .then(function () {
      return knex('produit').del();
    })
    .then(function () {
      return knex('admin').del();
    })
    .then(function () {
      return knex('gateway').del();
    })
    .then(function () {
      return knex('sensor').del();
    })
    .then(function () {
      // Inserts seed entries for sensor table
      return knex('sensor').insert([
        { name: 'bmp', adresse_ip: '192.168.1.1', description: 'BMP Sensor', type: 'BMP', status: 'Active' },
        { name: '801s', adresse_ip: '192.168.1.2', description: '801s Sensor', type: '801s', status: 'Active' }
      ]);
    })
    .then(function () {
      // Inserts seed entries for gateway table
      return knex('gateway').insert([
        { nom: 'esp32', adresse_ip: '192.168.2.1', adresse_mac: 'AA:BB:CC:DD:EE:FF', type: 'ESP32', status: 'Online' },
        { nom: 'arduino', adresse_ip: '192.168.2.2', adresse_mac: '11:22:33:44:55:66', type: 'Arduino', status: 'Online' }
      ]);
    })
    .then(function () {
      // Inserts seed entries for admin table
      return knex('admin').insert([
        { nom: 'Admin', prenom: 'Super', mail: 'admin@example.com', role: 'Admin' }
      ]);
    })
    .then(function () {
      // Inserts seed entries for produit table
      return knex('produit').insert([
        { name: 'product1', categorie: 'Category1', description: 'Description1', prix_unitaire: 10.99, quantite: 100, status: 'Disponible' },
        { name: 'product2', categorie: 'Category2', description: 'Description2', prix_unitaire: 20.99, quantite: 50, status: 'Disponible' }
      ]);
    })
    .then(function () {
      // Inserts seed entries for composition table
      return knex('composition').insert([
        { gateway_id: 1, id_produit: 1 },
        { gateway_id: 1, id_produit: 2 }
      ]);
    })
    .then(function () {
      // Inserts seed entries for assignement table
      return knex('assignement').insert([
        { gateway_id: 1, sensor_id: 1 },
        { gateway_id: 1, sensor_id: 2 }
      ]);
    })

};
