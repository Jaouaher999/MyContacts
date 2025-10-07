const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyContacts API",
      version: "1.0.0",
      description: "API documentation for MyContacts app",
    },
    servers: [
      { url: process.env.RENDER_EXTERNAL_URL || "http://localhost:5000/api" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponseUser: {
          type: "object",
          properties: {
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                _id: { type: "string" },
                email: { type: "string" },
                token: { type: "string" },
              },
            },
          },
        },
        ApiResponseLogin: {
          type: "object",
          properties: {
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                _id: { type: "string" },
                email: { type: "string" },
                token: { type: "string" },
              },
            },
          },
        },
        Contact: {
          type: "object",
          properties: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
          },
        },
        ApiResponseContact: {
          type: "object",
          properties: {
            message: { type: "string" },
            data: { $ref: "#/components/schemas/Contact" },
          },
        },
        ApiResponseContacts: {
          type: "object",
          properties: {
            message: { type: "string" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Contact" },
            },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            message: { type: "string" },
            data: { type: "null" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
