import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swaggerConfig";
import { AppDataSource } from "./data-source";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Main entry point
async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        app.get("/api/health", (req, res) => {
            res.json({ status: "ok", backend: "node" });
        });

        // Swagger Documentation
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Routes
        const authRoutes = require("./routes/authRoutes").default;
        const customerRoutes = require("./routes/customerRoutes").default;
        const conversationRoutes = require("./routes/conversationRoutes").default;
        const channelRoutes = require("./routes/channelRoutes").default;
        const webhookRoutes = require("./routes/webhookRoutes").default;

        app.use("/api/auth", authRoutes);
        app.use("/api/customers", customerRoutes);
        app.use("/api/conversations", conversationRoutes);
        app.use("/api/channels", channelRoutes);
        app.use("/api/webhooks", webhookRoutes);

        // Direct webhook endpoints at root and subpath
        const { WebhookController } = require("./controllers/WebhookController");
        const webhookController = new WebhookController();
        app.get("/webhook", webhookController.verify);
        app.post("/webhook", webhookController.receive);
        app.get("/api/webhook", webhookController.verify);
        app.post("/api/webhook", webhookController.receive);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Error during Data Source initialization", err);
    }
}

startServer();

export default app;

