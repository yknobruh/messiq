import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, LogOut, User, Settings, ChevronRight, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { api, clearToken } from "../lib/api";

export interface StoreResponse {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  owner_phone: string;
  logo_url: string | null;
  brand_voice: string | null;
  welcome_message: string | null;
  business_hours: any | null;
  currency: string;
  timezone: string;
  is_active: boolean;
  is_verified: boolean;
}

interface UserInfo {
  name: string;
  email: string;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/connections": "Connections",
  "/dashboard/customers": "Customers",
  "/dashboard/orders": "Orders",
  "/dashboard/products": "Products",
  "/dashboard/products/new": "Add Product",
  "/dashboard/messages": "Messages",
  "/dashboard/settings": "Profile Settings",
};

interface TopbarProps {
  onMenuToggle: () => void;
}

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentLabel = pageTitles[location.pathname] || (location.pathname.includes("/products/") && location.pathname.includes("/edit") ? "Edit Product" : "Dashboard");

  const fetchUser = async () => {
    try {
      const data = await api.get<StoreResponse>("/api/auth/me");
      setUser({
        name: data.name,
        email: data.owner_email
      });
    } catch (err) {
      console.error("Failed to fetch user in Topbar:", err);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setShowNotifications(false);
  }, [location.pathname]);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Left side: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2 text-gray-400">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:text-[#8B7CF6] transition-colors hidden sm:block"
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            Messiq
          </button>
          <ChevronRight className="w-3.5 h-3.5 hidden sm:block" />
          <span className="text-gray-800" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
            {currentLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            className="flex items-center gap-2 h-10 pl-1.5 pr-2 sm:pr-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {userLoading ? (
              <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-[#F0EEFF] flex items-center justify-center text-[#8B7CF6]" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                {getInitials(user?.name || "User")}
              </div>
            )}
            <span className="text-gray-700 hidden sm:block" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {userLoading ? "Loading..." : user?.name || "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-[52px] w-48 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 py-1 z-50">
              <button
                onClick={() => { setShowDropdown(false); navigate("/dashboard/settings"); }}
                className="w-full flex items-center gap-3 px-4 h-9 text-gray-600 hover:bg-gray-50 transition-colors text-left"
                style={{ fontSize: "0.8125rem", fontWeight: 400 }}
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => { setShowDropdown(false); navigate("/dashboard/settings"); }}
                className="w-full flex items-center gap-3 px-4 h-9 text-gray-600 hover:bg-gray-50 transition-colors text-left"
                style={{ fontSize: "0.8125rem", fontWeight: 400 }}
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { setShowDropdown(false); clearToken(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-4 h-9 text-red-500 hover:bg-red-50 transition-colors text-left"
                style={{ fontSize: "0.8125rem", fontWeight: 400 }}
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}