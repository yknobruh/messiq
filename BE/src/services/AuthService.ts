import { AppDataSource } from "../data-source";
import { Store } from "../entities/Store";
import { hashPassword, verifyPassword, createToken } from "../utils/AuthUtils";

export class AuthService {
    private storeRepository = AppDataSource.getRepository(Store);


    async login(body: any) {
        console.log("Login attempt for:", body.email);
        const store = await this.storeRepository.findOneBy({ owner_email: body.email });
        if (!store) {
            console.log("Login failed: Email not registered:", body.email);
            throw { status: 401, message: "Email not registered" };
        }

        const isPasswordValid = await verifyPassword(body.password, store.password_hash);
        if (!isPasswordValid) {
            console.log("Login failed: Wrong password for:", body.email);
            throw { status: 401, message: "Wrong password" };
        }

        const token = createToken({ store_id: store.id, email: body.email });
        console.log("Login successful for:", body.email);
        return { access_token: token };
    }

    async getStoreById(id: string) {
        return await this.storeRepository.findOne({
            where: { id },
            relations: ["subscription"],
        });
    }

    async updateStore(id: string, body: any) {
        const store = await this.storeRepository.findOneBy({ id });
        if (!store) {
            throw { status: 404, message: "Store not found" };
        }

        Object.assign(store, body);
        return await this.storeRepository.save(store);
    }
}
