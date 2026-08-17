import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
  Loader2,
} from "lucide-react";
import { Customer } from "../../../app/core/types";
import { customersApi } from "../api";

/* ------------------------------------------------------------------ */
/*  Types (matching backend CustomerResponse)                          */
/* ------------------------------------------------------------------ */
// Local Customer interface removed, using centralized one.

const channelConfig: Record<string, { bg: string; text: string; dot: string }> = {
  instagram: { bg: "bg-pink-50", text: "text-pink-600", dot: "bg-pink-400" },
  facebook: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
};

const defaultChannelStyle = { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };

const ROWS_PER_PAGE = 6;

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function formatChannel(channel: string | null): string {
  if (!channel) return "Unknown";
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

export function CustomersPage() {
  // Data from API
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);

  const allChannels = ["All", "Instagram", "Facebook"];

  // ── Fetch data ──
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customersApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Filtering ──
  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || "").includes(search) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase());
      const matchChannel =
        channelFilter === "All" ||
        (c.current_channel || "").toLowerCase() === channelFilter.toLowerCase();
      return matchSearch && matchChannel;
    });
  }, [customers, search, channelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleChannelFilter = (val: string) => {
    setChannelFilter(val);
    setCurrentPage(1);
    setChannelDropdownOpen(false);
  };

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
            Loading customers...
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
            <Users className="w-7 h-7 text-red-400" />
          </div>
          <h2
            className="text-gray-900 mb-2"
            style={{ fontSize: "1.25rem", fontWeight: 700 }}
          >
            Failed to load customers
          </h2>
          <p
            className="text-gray-500 mb-4"
            style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
          >
            {error}
          </p>
          <button
            onClick={fetchData}
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
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-gray-900"
          style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Customers
        </h1>
        <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
          View and manage your customer base across all channels.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-[#F5F5F8] border border-transparent focus:border-[#8B7CF6] focus:bg-white rounded-xl outline-none transition-all"
                  style={{ fontSize: "0.8125rem" }}
                />
              </div>

              <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                {/* Channel Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setChannelDropdownOpen(!channelDropdownOpen);
                    }}
                    className="h-10 px-4 bg-[#F5F5F8] hover:bg-gray-200/60 rounded-xl flex items-center gap-2 transition-colors min-w-[140px] justify-between"
                    style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                  >
                    <span className="text-gray-600">
                      Channel:{" "}
                      <span className="text-gray-900">{channelFilter}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {channelDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setChannelDropdownOpen(false)}
                      />
                      <div className="absolute left-0 sm:right-0 sm:left-auto top-[44px] w-44 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 py-1 z-20">
                        {allChannels.map((c) => (
                          <button
                            key={c}
                            onClick={() => handleChannelFilter(c)}
                            className={`w-full text-left px-4 h-9 hover:bg-gray-50 transition-colors ${channelFilter === c
                              ? "text-[#8B7CF6]"
                              : "text-gray-600"
                              }`}
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: channelFilter === c ? 600 : 400,
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Export */}
                <button
                  className="h-10 px-4 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                  style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table — Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Name",
                    "Phone",
                    "Channel",
                    "Last Interaction",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-gray-400"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((customer, i) => {
                  const ch =
                    channelConfig[(customer.current_channel || "").toLowerCase()] ||
                    defaultChannelStyle;
                  return (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-[#FAFAFC] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg bg-[#F0EEFF] flex items-center justify-center text-[#8B7CF6] shrink-0"
                            style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                          >
                            {getInitials(customer.name)}
                          </div>
                          <span
                            className="text-gray-900 whitespace-nowrap"
                            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                          >
                            {customer.name || "Anonymous"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-gray-600 whitespace-nowrap"
                          style={{ fontSize: "0.8125rem" }}
                        >
                          {customer.phone || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full ${ch.bg} ${ch.text}`}
                          style={{ fontSize: "0.75rem", fontWeight: 500 }}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${ch.dot}`}
                          />
                          {formatChannel(customer.current_channel)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="text-gray-500 whitespace-nowrap"
                          style={{ fontSize: "0.8125rem" }}
                        >
                          {formatTimeAgo(customer.last_interaction_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="h-8 px-3 text-[#8B7CF6] bg-[#F0EEFF] hover:bg-[#E8E3FF] rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
                          style={{ fontSize: "0.75rem", fontWeight: 500 }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-300" />
                        </div>
                        <div>
                          <p
                            className="text-gray-400"
                            style={{ fontSize: "0.875rem" }}
                          >
                            No customers found
                          </p>
                          <p
                            className="text-gray-300 mt-1"
                            style={{ fontSize: "0.8125rem" }}
                          >
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 flex flex-col gap-3">
            {paginated.map((customer, i) => {
              const ch =
                channelConfig[(customer.current_channel || "").toLowerCase()] ||
                defaultChannelStyle;
              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="border border-gray-100 rounded-xl p-4 hover:bg-[#FAFAFC] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl bg-[#F0EEFF] flex items-center justify-center text-[#8B7CF6] shrink-0"
                        style={{ fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <p
                          className="text-gray-900"
                          style={{ fontSize: "0.875rem", fontWeight: 500 }}
                        >
                          {customer.name || "Anonymous"}
                        </p>
                        <p
                          className="text-gray-400 mt-0.5"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {customer.phone || customer.email || "—"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full ${ch.bg} ${ch.text}`}
                      style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${ch.dot}`}
                      />
                      {formatChannel(customer.current_channel)}
                    </span>
                  </div>

                  <div className="flex gap-6 mb-3">
                    <div>
                      <p
                        className="text-gray-400"
                        style={{ fontSize: "0.6875rem" }}
                      >
                        Last Active
                      </p>
                      <p
                        className="text-gray-500 mt-0.5"
                        style={{ fontSize: "0.8125rem" }}
                      >
                        {formatTimeAgo(customer.last_interaction_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      className="h-8 px-3 text-[#8B7CF6] bg-[#F0EEFF] hover:bg-[#E8E3FF] rounded-lg transition-colors flex items-center gap-1.5"
                      style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {paginated.length === 0 && (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <p
                    className="text-gray-400"
                    style={{ fontSize: "0.875rem" }}
                  >
                    No customers found
                  </p>
                  <p
                    className="text-gray-300 mt-1"
                    style={{ fontSize: "0.8125rem" }}
                  >
                    Try adjusting your search or filters.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-400" style={{ fontSize: "0.8125rem" }}>
              Showing{" "}
              {filtered.length === 0
                ? 0
                : (currentPage - 1) * ROWS_PER_PAGE + 1}
              &ndash;
              {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${page === currentPage
                      ? "bg-[#8B7CF6] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                      }`}
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: page === currentPage ? 600 : 400,
                    }}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
