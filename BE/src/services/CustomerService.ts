import { AppDataSource } from "../data-source";
import { Customer, CustomerAddress, CustomerTag } from "../entities/Customer";
import { ILike } from "typeorm";

export class CustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private addressRepository = AppDataSource.getRepository(CustomerAddress);
    private tagRepository = AppDataSource.getRepository(CustomerTag);

    async getCustomers(storeId: string, query: any) {
        const { search } = query;
        const where: any = { store_id: storeId, is_merged: false };

        if (search) {
            return await this.customerRepository
                .createQueryBuilder("customer")
                .where("customer.store_id = :storeId", { storeId })
                .andWhere("customer.is_merged = false")
                .andWhere("(customer.name ILIKE :search OR customer.phone ILIKE :search)", { search: `%${search}%` })
                .orderBy("customer.last_interaction_at", "DESC")
                .getMany();
        }

        return await this.customerRepository.find({
            where,
            order: { last_interaction_at: "DESC" },
        });
    }

    async getCustomer(storeId: string, customerId: number) {
        return await this.customerRepository.findOne({
            where: { id: customerId, store_id: storeId },
            relations: ["addresses", "tags"],
        });
    }

    async updateCustomer(storeId: string, customerId: number, body: any) {
        const customer = await this.customerRepository.findOneBy({ id: customerId, store_id: storeId });
        if (!customer) throw { status: 404, message: "Customer not found" };

        Object.assign(customer, body);
        return await this.customerRepository.save(customer);
    }

    async mergeCustomers(storeId: string, sourceId: number, targetId: number) {
        const source = await this.customerRepository.findOneBy({ id: sourceId, store_id: storeId });
        const target = await this.customerRepository.findOneBy({ id: targetId, store_id: storeId });

        if (!source || !target) throw { status: 404, message: "Customer not found" };
        if (sourceId === targetId) throw { status: 400, message: "Cannot merge customer into itself" };

        // Transfer spend + orders (assuming these fields exist on Customer)
        target.total_spend = (target.total_spend || 0) + (source.total_spend || 0);
        target.order_count = (target.order_count || 0) + (source.order_count || 0);

        // Copy missing identity fields
        if (!target.phone && source.phone) target.phone = source.phone;
        if (!target.insta_id && source.insta_id) target.insta_id = source.insta_id;
        if (!target.fb_psid && source.fb_psid) target.fb_psid = source.fb_psid;

        // Mark source as merged
        source.merged_into = target.id;
        source.is_merged = true;

        await this.customerRepository.save(target);
        await this.customerRepository.save(source);

        return { merged: true, source_id: source.id, target_id: target.id };
    }

    // Addresses
    async getAddresses(storeId: string, customerId: number) {
        return await this.addressRepository.find({
            where: { customer_id: customerId }
        });
    }

    async addAddress(storeId: string, customerId: number, body: any) {
        const customer = await this.customerRepository.findOneBy({ id: customerId, store_id: storeId });
        if (!customer) throw { status: 404, message: "Customer not found" };

        const address = this.addressRepository.create({
            ...body,
            customer_id: customerId
        });
        return await this.addressRepository.save(address);
    }

    async updateAddress(storeId: string, customerId: number, addressId: number, body: any) {
        const address = await this.addressRepository.findOneBy({ id: addressId, customer_id: customerId });
        if (!address) throw { status: 404, message: "Address not found" };
        Object.assign(address, body);
        return await this.addressRepository.save(address);
    }

    async deleteAddress(storeId: string, customerId: number, addressId: number) {
        const address = await this.addressRepository.findOneBy({ id: addressId, customer_id: customerId });
        if (!address) throw { status: 404, message: "Address not found" };
        await this.addressRepository.remove(address);
        return { status: "ok" };
    }

    // Tags
    async addTag(storeId: string, customerId: number, tagName: string) {
        const customer = await this.customerRepository.findOneBy({ id: customerId, store_id: storeId });
        if (!customer) throw { status: 404, message: "Customer not found" };

        const tag = this.tagRepository.create({
            customer_id: customerId,
            tag: tagName
        });
        return await this.tagRepository.save(tag);
    }

    async removeTag(storeId: string, customerId: number, tagId: number) {
        const tag = await this.tagRepository.findOneBy({ id: tagId, customer_id: customerId });
        if (!tag) throw { status: 404, message: "Tag not found" };
        await this.tagRepository.remove(tag);
        return { status: "ok" };
    }

    async deleteAllCustomers(storeId: string) {
        await this.customerRepository.delete({ store_id: storeId });
        return { status: "ok", message: "All customers deleted successfully." };
    }
}
