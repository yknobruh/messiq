import { Request, Response } from "express";
import { CustomerService } from "../services/CustomerService";

const customerService = new CustomerService();

export class CustomerController {
    async list(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const customers = await customerService.getCustomers(storeId, req.query);
            res.json(customers);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const customer = await customerService.getCustomer(storeId, parseInt(req.params.id as string));
            if (!customer) return res.status(404).json({ detail: "Customer not found" });
            res.json(customer);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const customer = await customerService.updateCustomer(storeId, parseInt(req.params.id as string), req.body);
            res.json(customer);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async merge(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const targetId = parseInt(req.query.merge_into_id as string);
            const result = await customerService.mergeCustomers(storeId, parseInt(req.params.id as string), targetId);
            res.json(result);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    // Addresses
    async listAddresses(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const addresses = await customerService.getAddresses(storeId, parseInt(req.params.id as string));
            res.json(addresses);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }

    async addAddress(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const address = await customerService.addAddress(storeId, parseInt(req.params.id as string), req.body);
            res.status(201).json(address);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async updateAddress(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const address = await customerService.updateAddress(storeId, parseInt(req.params.id as string), parseInt(req.params.address_id as string), req.body);
            res.json(address);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async deleteAddress(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            await customerService.deleteAddress(storeId, parseInt(req.params.id as string), parseInt(req.params.address_id as string));
            res.json({ status: "ok" });
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    // Tags
    async addTag(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const tag = await customerService.addTag(storeId, parseInt(req.params.id as string), req.body.tag as string);
            res.json(tag);
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async removeTag(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            await customerService.removeTag(storeId, parseInt(req.params.id as string), parseInt(req.params.tag_id as string));
            res.json({ status: "ok" });
        } catch (err: any) {
            res.status(err.status || 500).json({ detail: err.message || "Internal server error" });
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            const storeId = (req as any).store.id;
            const result = await customerService.deleteAllCustomers(storeId);
            res.json(result);
        } catch (err: any) {
            res.status(500).json({ detail: "Internal server error" });
        }
    }
}
