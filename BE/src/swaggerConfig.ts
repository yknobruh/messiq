import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DM Agent SaaS - Node.js Backend API",
            version: "1.0.0",
            description: "API documentation for the master backend service",
        },
        servers: [
            {
                url: process.env.BACKEND_URL || "https://semidormant-natalie-speedfully.ngrok-free.dev",
                description: "Backend server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
