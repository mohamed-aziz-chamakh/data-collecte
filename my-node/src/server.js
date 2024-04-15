// server.js

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes'); // Importer les routes depuis le fichier routes.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Utiliser les routes définies dans routes.js
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
