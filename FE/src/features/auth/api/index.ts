import { api } from "../../../app/lib/api";
import { AuthResponse, Store } from "../../../app/core/types";

export const authApi = {
    /**
     * Log in a user
     */
    login: async (payload: any) => {
        return api.post<AuthResponse>("/api/auth/login", payload);
    },

    /**
     * Register a new user/store
     */
    register: async (payload: any) => {
        return api.post<AuthResponse>("/api/auth/register", payload);
    },

    /**
     * Get current user/store profile
     */
    getMe: async () => {
        return api.get<Store>("/api/auth/me");
    },

    /**
     * Update current user/store profile (used in onboarding and settings)
     */
    updateMe: async (payload: Partial<Store>) => {
        return api.put<Store>("/api/auth/me", payload);
    },
};
