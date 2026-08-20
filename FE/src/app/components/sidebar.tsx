import { NavLink, Link } from "react-router";
import { LayoutDashboard, Link2, MessageSquare, X, Users } from "lucide-react";
import logo from "../../assets/Ykno.png";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Connections", path: "/dashboard/connections", icon: Link2 },
  { label: "Customers", path: "/dashboard/customers", icon: Users },
  { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[248px] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src={logo} alt="Messiq" className="w-full h-full object-cover" />
            </div>
            <span className="text-gray-900 tracking-tight" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              Messiq
            </span>
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-150 ${isActive
                    ? "bg-[#8B7CF6] text-white shadow-[0_2px_8px_rgba(139,124,246,0.3)]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`
                }
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
