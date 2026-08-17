import { api } from "../../../app/lib/api";
import { ChannelFromAPI } from "../types";

export const connectionsApi = {
    /**
     * Fetch all connected channels for the store
     */
    getChannels: async () => {
        return api.get<ChannelFromAPI[]>("/api/channels");
    },

    /**
     * Get the OAuth connection URL for a platform
     * @param platformId "instagram" | "facebook"
     * @param needsBusiness true if forcing business_management scope
     */
    getConnectUrl: async (platformId: string, needsBusiness: boolean = false) => {
        const query = needsBusiness ? "?business=true" : "";
        return api.get<{ auth_url: string }>(`/api/channels/${platformId}/connect${query}`);
    },

    /**
     * Disconnect a channel by its ID
     * @param channelId The database ID of the channel
     */
    disconnectChannel: async (channelId: number) => {
        return api.delete(`/api/channels/${channelId}`);
    },
};
