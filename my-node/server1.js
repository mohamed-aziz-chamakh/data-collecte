const express = require('express');
const sensorRoutes = require('./routes/sensorRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Importez les routes des administrateurs
const productRoutes = require('./routes/productRoutes'); // Importez les routes des produits
const assignementRoutes = require('./routes/assignementRoutes'); // Importez les routes d'attribution
const collecteRoutes = require('./routes/collecteRoutes'); // Importez les routes de collecte
const compositionRoutes= require('./routes/compositionRoutes');
const datacollectedRoutes=require('./routes/datacollectedRoutes')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();
app.use(express.json());

app.use('/api', sensorRoutes);
app.use('/api', gatewayRoutes);
app.use('/api',datacollectedRoutes);
app.use('/api', adminRoutes); // Utilisez les routes des administrateurs sur le chemin /api
app.use('/api', productRoutes); // Utilisez les routes des produits sur le chemin /api
app.use('/api', assignementRoutes); // Utilisez les routes d'attribution sur le chemin /api/assignements
app.use('/api', collecteRoutes); // Utilisez les routes de collecte sur le chemin /api/collectes
app.use('/api', compositionRoutes); // Utilisez les routes de collecte sur le chemin /api/collectes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
