import { api } from "../../../app/lib/api";
import { Customer } from "../../../app/core/types";

export const customersApi = {
    /**
     * Fetch all customers for the store
     */
    getCustomers: async () => {
        return api.get<Customer[]>("/api/customers");
    },

    /**
     * Fetch a single customer by ID
     */
    getCustomerById: async (id: number) => {
        return api.get<Customer>(`/api/customers/${id}`);
    },

    /**
     * Update a customer
     */
    updateCustomer: async (id: number, data: Partial<Customer>) => {
        return api.patch<Customer>(`/api/customers/${id}`, data);
    },
};
