import { customersApi } from "../../customers/api";
import { chatApi } from "../../chat/api";

/**
 * Dashboard API service that aggregates data from multiple modules
 * for the overview page.
 */
export const dashboardApi = {
    getOverviewData: async () => {
        const [customers, conversations] = await Promise.all([
            customersApi.getCustomers(),
            chatApi.getConversations(),
        ]);
        return {
            customers,
            conversations,
        };
    },
};

