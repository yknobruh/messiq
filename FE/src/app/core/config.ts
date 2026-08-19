/**
 * Global application configuration.
 */

export const CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://semidormant-natalie-speedfully.ngrok-free.dev",
    APP_NAME: "MessiQ",
    DEFAULT_CURRENCY: "USD",
    SUPPORTED_CURRENCIES: ["USD", "EUR", "GBP", "INR"],
};

if (!CONFIG.API_BASE_URL) {
    console.error("VITE_API_BASE_URL is not defined in environment variables!");
}
