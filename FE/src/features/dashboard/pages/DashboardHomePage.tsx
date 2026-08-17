import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Users,
  MessageSquare,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { dashboardApi } from "../api";

interface Customer {
  id: number;
  name: string | null;
  channel: string | null;
}

interface Session {
  id: number;
  status: string;
  has_escalation: boolean;
  customer_name: string | null;
  last_message_preview: string | null;
  last_message_at: string | null;
  channel: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function DashboardHomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [conversations, setConversations] = useState<Session[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getOverviewData();
      setCustomers(data.customers as any);
      setConversations(data.conversations as any);
    } catch {
      // ignore partial errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const activeConversations = conversations.filter(
    (c) => c.status === "active"
  ).length;

  const statCards = [
    {
      label: "Total Customers",
      value: customers.length.toString(),
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Active Chats",
      value: activeConversations.toString(),
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const recentConvos = conversations.slice(0, 5);

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
            Loading dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px]">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-gray-900"
          style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
          Here's an overview of your conversations and customers.
        </p>
      </div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p
                className="text-gray-400"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                {stat.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p
              className={stat.color}
              style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Conversations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-full"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8B7CF6]" />
            <h2
              className="text-gray-900"
              style={{ fontSize: "0.9375rem", fontWeight: 600 }}
            >
              Recent Conversations
            </h2>
          </div>
          <button
            onClick={() => navigate("/dashboard/messages")}
            className="text-[#8B7CF6] hover:text-[#7C6BEF] flex items-center gap-1 transition-colors"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentConvos.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-gray-400" style={{ fontSize: "0.8125rem" }}>
                No conversations yet
              </p>
            </div>
          ) : (
            recentConvos.map((conv) => (
              <div
                key={conv.id}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-[#FAFAFC] transition-colors cursor-pointer"
                onClick={() => navigate("/dashboard/messages")}
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p
                    className="text-gray-900 truncate"
                    style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                  >
                    {conv.customer_name || `Customer #${conv.customer_id}`}
                  </p>
                  <p
                    className="text-gray-400 truncate mt-0.5"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {conv.last_message_preview || "No messages"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`h-5 px-1.5 rounded-md inline-flex items-center ${conv.channel === "instagram"
                      ? "bg-pink-50 text-pink-600"
                      : "bg-blue-50 text-blue-600"
                      }`}
                    style={{ fontSize: "0.5625rem", fontWeight: 600, textTransform: "uppercase" }}
                  >
                    {conv.channel}
                  </span>
                  <span className="text-gray-300" style={{ fontSize: "0.6875rem" }}>
                    {timeAgo(conv.last_message_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        {activeConversations > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-[#F7F5FF]/60 rounded-b-2xl">
            <p className="text-[#8B7CF6]" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
              <MessageSquare className="w-3 h-3 inline mr-1" />
              {activeConversations} active conversation{activeConversations !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

