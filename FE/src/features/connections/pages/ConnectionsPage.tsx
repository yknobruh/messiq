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
        <stop offset="75%" stopColor="#D62976" />
        <stop offset="100%" stopColor="#962FBF" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-gradient)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"
      fill="#25D366"
    />
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
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Connect your WhatsApp Business account to automate customer messages and support chats.",
    color: "#25D366",
    icon: <WhatsAppIcon />,
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
  const [useBusinessAccess, setUseBusinessAccess] = useState(false);

  // Check for OAuth callback success (redirect from backend)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedChannel = params.get("channel_connected");
    if (connectedChannel) {
      setConnectedPlatform(
        connectedChannel === "instagram"
          ? "Instagram"
          : connectedChannel === "facebook"
          ? "Facebook"
          : "WhatsApp"
      );
      setModalOpen(true);
      // Clean the URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    const errorParam = params.get("error");
    if (errorParam === "business_portfolio_required") {
      setError("Your account is managed under Meta Business Suite. Please check the 'Meta Business Suite' checkbox and try connecting again.");
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
      if (platformId === "instagram" || platformId === "facebook" || platformId === "whatsapp") {
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
          {error.includes("Meta Business Suite") && (
            <div className="mt-3 mb-2 flex flex-wrap gap-3">
              <button 
                onClick={() => handleConnect("instagram", true)} 
                disabled={!!actionLoading}
                className="bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Connect Instagram with Business Suite
              </button>
              <button 
                onClick={() => handleConnect("facebook", true)} 
                disabled={!!actionLoading}
                className="bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Connect Facebook with Business Suite
              </button>
              <button 
                onClick={() => handleConnect("whatsapp", true)} 
                disabled={!!actionLoading}
                className="bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Connect WhatsApp with Business Suite
              </button>
            </div>
          )}
          <button onClick={() => setError("")} className="mt-2 text-red-500 hover:text-red-700 font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Meta Business Suite Option */}
      <div className="mb-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <label htmlFor="business-toggle" className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
          <input
            id="business-toggle"
            type="checkbox"
            checked={useBusinessAccess}
            onChange={(e) => setUseBusinessAccess(e.target.checked)}
            className="w-4 h-4 mt-0.5 sm:mt-0 rounded border-gray-300 text-[#8B7CF6] focus:ring-[#8B7CF6] cursor-pointer"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              Is your account connected with Meta Business Suite?
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              Check this if your Facebook Page or Instagram Business account is managed under Meta Business Suite.
            </p>
          </div>
        </label>
      </div>

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
                    onClick={() => handleConnect(platform.id, useBusinessAccess)}
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
