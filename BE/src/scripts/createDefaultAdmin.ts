import { AppDataSource } from "../data-source";
import { Store } from "../entities/Store";
import { hashPassword } from "../utils/AuthUtils";

async function createDefaultAdmin() {
    try {
        console.log("Initializing database connection...");
        await AppDataSource.initialize();
        console.log("Database initialized.");

        const storeRepo = AppDataSource.getRepository(Store);
        const email = "admin@yknobruh.com";

        const existing = await storeRepo.findOneBy({ owner_email: email });
        if (existing) {
            console.log(`Store owner with email "${email}" already exists.`);
        } else {
            console.log(`Creating default store owner with email "${email}"...`);
            const store = new Store();
            store.name = "Ykno Bruh";
            store.slug = "yknobruh";
            store.owner_email = email;
            store.owner_phone = "+919999999999";
            store.password_hash = await hashPassword("password123");
            store.is_active = true;
            store.is_verified = true;

            await storeRepo.save(store);
            console.log("Default store admin created successfully!");
            console.log("Email: admin@yknobruh.com");
            console.log("Password: password123");
        }
    } catch (error) {
        console.error("Error creating default admin:", error);
    } finally {
        console.log("Closing database connection...");
        await AppDataSource.destroy();
        console.log("Database connection closed.");
    }
}

createDefaultAdmin();
