import "reflect-metadata";
import { DataSource } from "typeorm";
import { Store } from "./entities/Store";
import { StoreChannel } from "./entities/StoreChannel";
import { StoreSubscription } from "./entities/StoreSubscription";
import { Customer, CustomerAddress, CustomerTag } from "./entities/Customer";
import { ChatSession, ChatLog, WebhookEvent, Escalation } from "./entities/Chat";
import { StoreTeamMember } from "./entities/StoreTeamMember";
import dotenv from "dotenv";

dotenv.config({ override: true });

// Convert postgresql+asyncpg:// to postgresql://
const dbUrl = process.env.DATABASE_URL?.replace("+asyncpg", "") || "";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: dbUrl,
    synchronize: true, // Temporarily enabled to create missing database tables
    logging: false,
    entities: [
        Store,
        StoreChannel,
        StoreSubscription,
        StoreTeamMember,
        Customer,
        CustomerAddress,
        CustomerTag,
        ChatSession,
        ChatLog,
        WebhookEvent,
        Escalation,
    ],
    migrations: [],
    subscribers: [],
});

