import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../../../app/components/sidebar";
import { Topbar } from "../../../app/components/topbar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-['Inter',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[248px]">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)] flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-auto pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 border-t border-gray-100" style={{ fontSize: "0.75rem" }}>
            <p>© 2026 Messiq. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#8B7CF6] transition-colors">Privacy Policy</a>
              <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#8B7CF6] transition-colors">Terms of Service</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
