const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition:{
        openapi: '3.0.0',
        info:{
            title: 'MyContacts API',
            version: '1.0.0',
            description: 'API documentation for MyContacts app',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;