import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { SuccessModal } from "../../../app/components/success-modal";
import { connectionsApi } from "../api";
import { ChannelFromAPI, Platform } from "../types";

/* ── Icons ── */
// ... (icons remain the same)

/* ── Icons ── */

const FacebookIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="25%" stopColor="#F77737" />
        <stop offset="50%" stopColor="#E4405F" />
        <stop offset="75%" stopColor="#C13584" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-gradient)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
  </svg>
);

/* ── Platform definitions (static UI data) ── */

const PLATFORM_DEFS: Omit<Platform, "channel">[] = [
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect your Facebook pages and Messenger to manage conversations and automate responses.",
    color: "#1877F2",
    icon: <FacebookIcon />,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Link your Instagram business account to manage DMs and automate engagement with followers.",
    color: "#E4405F",
    icon: <InstagramIcon />,
  },
];

/* ── Component ── */

export function ConnectionsPage() {
  const [channels, setChannels] = useState<ChannelFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [connectedPlatform, setConnectedPlatform] = useState("");

  // Check for OAuth callback success (redirect from backend)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedChannel = params.get("channel_connected");
    if (connectedChannel) {
      setConnectedPlatform(connectedChannel === "instagram" ? "Instagram" : "Facebook");
      setModalOpen(true);
      // Clean the URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    const errorParam = params.get("error");
    if (errorParam === "business_portfolio_required") {
      setError("Your account requires Business Portfolio access to discover pages. Please select an option below to authorize Business access.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (errorParam) {
      setError(`Connection failed: ${errorParam}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Fetch connected channels
  const fetchChannels = useCallback(async () => {
    try {
      const data = await connectionsApi.getChannels();
      setChannels(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load channels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchChannels(); }, [fetchChannels]);

  // Merge API data with static platform definitions
  const platforms: Platform[] = PLATFORM_DEFS.map((def) => {
    const ch = channels.find((c) => c.channel === def.id && c.is_active);
    return { ...def, channel: ch };
  });

  /* ── Connect handler ── */
  const handleConnect = async (platformId: string, needsBusiness: boolean = false) => {
    setActionLoading(platformId);
    setError("");
    try {
      if (platformId === "instagram" || platformId === "facebook") {
        // Get OAuth URL from backend → redirect user to Meta
        const data = await connectionsApi.getConnectUrl(platformId, needsBusiness);
        window.location.href = data.auth_url;
        return; // page will redirect
      }

      // WhatsApp — not yet implemented via OAuth
      setError(`${platformId} connection is not yet available. Contact support.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Disconnect handler ── */
  const handleDisconnect = async (platform: Platform) => {
    if (!platform.channel) return;
    setActionLoading(platform.id);
    setError("");
    try {
      await connectionsApi.disconnectChannel(platform.channel.id);
      await fetchChannels(); // refresh list
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-[960px]">
      <div className="mb-8">
        <h1 className="text-gray-900" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Connections
        </h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
          Manage your platform integrations and connected accounts.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl" style={{ fontSize: "0.8125rem" }}>
          <p>{error}</p>
          {error.includes("Business Portfolio access") && (
            <div className="mt-4 mb-2 flex gap-3">
              <button 
                onClick={() => handleConnect("instagram", true)} 
                disabled={!!actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
              >
                Continue Instagram with Business Access
              </button>
              <button 
                onClick={() => handleConnect("facebook", true)} 
                disabled={!!actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
              >
                Continue Facebook with Business Access
              </button>
            </div>
          )}
          <button onClick={() => setError("")} className="mt-2 text-red-500 hover:text-red-700 font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100" />
                <div className="w-20 h-6 rounded-full bg-gray-100" />
              </div>
              <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-full bg-gray-100 rounded mb-1" />
              <div className="h-3 w-2/3 bg-gray-100 rounded mb-6" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {platforms.map((platform, i) => {
            const connected = !!platform.channel;
            const isLoading = actionLoading === platform.id;

            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`bg-white rounded-2xl p-6 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${connected
                  ? "border-2 border-[#8B7CF6]/30 shadow-[0_1px_3px_rgba(139,124,246,0.06)]"
                  : "border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                    {platform.icon}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full ${connected
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                      }`}
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-red-400"
                        }`}
                    />
                    {connected ? "Connected" : "Not Connected"}
                  </span>
                </div>

                <h3 className="text-gray-900 mb-1" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                  {platform.name}
                  {platform.channel?.external_name && (
                    <span className="ml-2 text-gray-400 font-normal" style={{ fontSize: "0.8125rem" }}>
                      @{platform.channel.external_name}
                    </span>
                  )}
                </h3>
                <p className="text-gray-500 mb-6" style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}>
                  {platform.description}
                </p>

                {connected ? (
                  <button
                    onClick={() => handleDisconnect(platform)}
                    disabled={isLoading}
                    className="w-full h-10 px-4 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                    style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disconnect"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isLoading}
                    className="w-full h-10 bg-[#8B7CF6] hover:bg-[#7C6BEF] text-white rounded-xl transition-colors shadow-[0_2px_8px_rgba(139,124,246,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      `Connect ${platform.name}`
                    )}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <SuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        platformName={connectedPlatform}
      />
    </div>
  );
}
