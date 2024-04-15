const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API Description',
    },
    servers: [
        {
          url: "http://localhost:3000/",
          description: "Local server"
        },
        {
          url: "<your live url here>",
          description: "Live server"
        },
      ]
  },
  externalDocs: {                // <<< this will add the link to your swagger page
    description: "swagger.json", // <<< link text
    url: "/swagger.json"         // <<< and the file added below in api.get(...)
  }, 
  apis: ['./routes/*.js'], // Specify the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
