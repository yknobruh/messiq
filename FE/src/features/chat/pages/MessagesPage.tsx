import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Bot,
  User,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { chatApi } from "../api";

/* ------------------------------------------------------------------ */
/*  Types (matching backend schemas)                                   */
/* ------------------------------------------------------------------ */
interface Session {
  id: number;
  customer_id: number;
  customer_name: string | null;
  customer_phone: string | null;
  channel: string;
  status: string;
  is_human_takeover: boolean;
  last_message_at: string | null;
  has_escalation: boolean;
  last_message_preview: string | null;
}

interface Message {
  id: number;
  direction: string;
  sender_type: string;
  message_text: string;
  message_type: string;
  intent_detected: string | null;
  tool_used: string | null;
  confidence_score: number | null;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const channelColors: Record<string, { bg: string; text: string }> = {
  instagram: { bg: "bg-pink-50", text: "text-pink-600" },
  facebook: { bg: "bg-blue-50", text: "text-blue-600" },
};
const defaultChannel = { bg: "bg-gray-50", text: "text-gray-600" };

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function MessagesPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusOpen, setStatusOpen] = useState(false);

  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedId) return;
    setSending(true);
    try {
      const response = await chatApi.sendMessage(selectedId, inputText);
      setMessages((prev) => [...prev, response]);
      setInputText("");
      setSessions((prev) =>
        prev.map((s) =>
          s.id === selectedId
            ? {
                ...s,
                last_message_preview: inputText,
                last_message_at: new Date().toISOString(),
              }
            : s
        )
      );
    } catch (err: any) {
      alert("Failed to send message: " + (err.response?.data?.detail || err.message || String(err)));
    } finally {
      setSending(false);
    }
  };

  // ── Fetch conversations ──
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getConversations();
      setSessions(data as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // ── Load messages when conversation selected ──
  const loadMessages = useCallback(async (sessionId: number) => {
    try {
      setMessagesLoading(true);
      const data = await chatApi.getMessagesBySessionId(sessionId);
      setMessages(data as any);
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
    }
  }, [selectedId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Filter sessions ──
  const filtered = sessions.filter((s) => {
    const matchSearch =
      (s.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.customer_phone || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.last_message_preview || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selectedSession = sessions.find((s) => s.id === selectedId);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 text-[#8B7CF6] animate-spin" />
          <p className="text-gray-400" style={{ fontSize: "0.875rem" }}>
            Loading conversations...
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-[360px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-7 h-7 text-red-400" />
          </div>
          <h2
            className="text-gray-900 mb-2"
            style={{ fontSize: "1.25rem", fontWeight: 700 }}
          >
            Failed to load conversations
          </h2>
          <p
            className="text-gray-500 mb-4"
            style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            {error}
          </p>
          <button
            onClick={fetchSessions}
            className="h-10 px-5 bg-[#8B7CF6] hover:bg-[#7C6BEF] text-white rounded-xl transition-colors"
            style={{ fontSize: "0.8125rem", fontWeight: 600 }}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h1
          className="text-gray-900"
          style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Messages
        </h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
          {sessions.length} conversation{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden min-h-0">
        {/* ── Sidebar: Conversation List ── */}
        <div
          className={`${selectedId ? "hidden lg:flex" : "flex"
            } flex-col w-full lg:w-[340px] xl:w-[380px] border-r border-gray-100 min-h-0`}
        >
          {/* Search + Filter */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-[#F5F5F8] rounded-lg outline-none border border-transparent focus:border-[#8B7CF6] focus:bg-white transition-all"
                style={{ fontSize: "0.8125rem" }}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="h-8 px-3 bg-[#F5F5F8] rounded-lg flex items-center gap-1.5 hover:bg-gray-200/60 transition-colors"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                <span className="text-gray-500">
                  Status:{" "}
                  <span className="text-gray-800 capitalize">{statusFilter}</span>
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {statusOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                  <div className="absolute left-0 top-[36px] w-36 bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 py-1 z-20">
                    {["all", "active", "closed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusFilter(s);
                          setStatusOpen(false);
                        }}
                        className={`w-full text-left px-3 h-8 hover:bg-gray-50 transition-colors capitalize ${statusFilter === s ? "text-[#8B7CF6]" : "text-gray-600"
                          }`}
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: statusFilter === s ? 600 : 400,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400" style={{ fontSize: "0.8125rem" }}>
                  No conversations found
                </p>
              </div>
            ) : (
              filtered.map((session) => {
                const ch =
                  channelColors[session.channel.toLowerCase()] || defaultChannel;
                const isActive = session.id === selectedId;
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedId(session.id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-[#FAFAFC] transition-colors ${isActive ? "bg-[#F7F5FF] border-l-2 border-l-[#8B7CF6]" : ""
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-gray-900 truncate"
                            style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                          >
                            {session.customer_name || `Customer #${session.customer_id}`}
                          </span>
                          {session.has_escalation && (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <p
                          className="text-gray-400 truncate"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {session.last_message_preview || "No messages yet"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className="text-gray-300"
                          style={{ fontSize: "0.6875rem" }}
                        >
                          {timeAgo(session.last_message_at)}
                        </span>
                        <span
                          className={`h-5 px-1.5 rounded-md inline-flex items-center ${ch.bg} ${ch.text}`}
                          style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
                        >
                          {session.channel}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat Panel ── */}
        <div
          className={`${selectedId ? "flex" : "hidden lg:flex"
            } flex-1 flex-col min-h-0`}
        >
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 flex-shrink-0">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                </button>
                <div className="w-9 h-9 rounded-full bg-[#F0EEFF] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#8B7CF6]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-gray-900 truncate"
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    {selectedSession.customer_name ||
                      `Customer #${selectedSession.customer_id}`}
                  </p>
                  <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                    {selectedSession.channel} &middot; {selectedSession.status}
                    {selectedSession.is_human_takeover && " · Human takeover"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      if (!selectedId) return;
                      const nextHandoff = !selectedSession.is_human_takeover;
                      try {
                        await chatApi.takeover(selectedId, nextHandoff);
                        setSessions((prev) =>
                          prev.map((s) =>
                            s.id === selectedId
                              ? { ...s, is_human_takeover: nextHandoff }
                              : s
                          )
                        );
                      } catch (err) {
                        alert("Handoff toggle failed");
                      }
                    }}
                    className={`h-7 px-3 rounded-lg font-semibold transition-colors text-xs flex items-center ${
                      selectedSession.is_human_takeover
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-[#8B7CF6] text-white hover:bg-[#7C6BEF]"
                    }`}
                  >
                    {selectedSession.is_human_takeover ? "Resume Bot (Auto-Reply)" : "Human Takeover (Stop Bot)"}
                  </button>

                  <span
                    className={`h-6 px-2 rounded-full inline-flex items-center ${selectedSession.status === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-500"
                      }`}
                    style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                  >
                    {selectedSession.status === "active" ? "Active" : "Closed"}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-[#8B7CF6] animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-400" style={{ fontSize: "0.8125rem" }}>
                      No messages in this conversation yet.
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isIncoming = msg.direction === "inbound";
                      const isBot = msg.sender_type === "bot" || msg.sender_type === "ai";
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[75%] sm:max-w-[65%] ${isIncoming
                              ? "bg-[#F5F5F8] text-gray-800 rounded-2xl rounded-bl-md"
                              : isBot
                                ? "bg-[#EDE9FE] text-[#5B4AB5] rounded-2xl rounded-br-md"
                                : "bg-[#8B7CF6] text-white rounded-2xl rounded-br-md"
                              } px-4 py-2.5`}
                          >
                            {/* Sender label */}
                            {(isBot || !isIncoming) && (
                              <div className="flex items-center gap-1 mb-1">
                                {isBot && <Bot className="w-3 h-3" />}
                                <span
                                  style={{ fontSize: "0.625rem", fontWeight: 600, opacity: 0.7 }}
                                >
                                  {isBot ? "AI Agent" : isIncoming ? "" : "You"}
                                </span>
                              </div>
                            )}
                            <p style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                              {msg.message_text}
                            </p>
                            <div className={`flex items-center gap-1 mt-1 ${isIncoming ? "text-gray-400" : "opacity-60"}`}>
                              <Clock className="w-2.5 h-2.5" />
                              <span style={{ fontSize: "0.5625rem" }}>
                                {formatTime(msg.created_at)}
                              </span>
                              {msg.intent_detected && (
                                <span
                                  className={`ml-1 px-1 rounded text-[0.5rem] ${isIncoming ? "bg-gray-200 text-gray-500" : "bg-white/20"
                                    }`}
                                >
                                  {msg.intent_detected}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="px-4 sm:px-6 py-3 border-t border-gray-100 flex-shrink-0 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedSession.is_human_takeover ? "Type a manual reply..." : "Enable Human Takeover to send a reply..."}
                  className="flex-1 h-10 px-4 bg-[#F5F5F8] border border-transparent focus:border-[#8B7CF6] focus:bg-white rounded-xl outline-none transition-all text-sm"
                  disabled={sending || !selectedSession.is_human_takeover}
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim() || !selectedSession.is_human_takeover}
                  className="h-10 px-5 bg-[#8B7CF6] hover:bg-[#7C6BEF] text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            /* Empty state: no conversation selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-[280px]">
                <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-[#8B7CF6]" />
                </div>
                <h3
                  className="text-gray-900 mb-1"
                  style={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  Select a conversation
                </h3>
                <p className="text-gray-400" style={{ fontSize: "0.8125rem" }}>
                  Choose a conversation from the list to view the messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
