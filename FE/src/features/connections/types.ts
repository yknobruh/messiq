export interface ChannelFromAPI {
    id: number;
    channel: string; // "instagram" | "whatsapp" | "facebook"
    external_id: string;
    is_active: boolean;
    external_name: string | null;
}

export interface Platform {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    /** Populated if connected via API */
    channel?: ChannelFromAPI;
}
