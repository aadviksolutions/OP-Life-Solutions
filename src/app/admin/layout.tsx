"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Clock,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  ChevronRight,
  Shield,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; username: string } | null>(null);

  // If on /admin/login, render without sidebar layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) {
            router.push("/admin/login");
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data?.user) setAdminUser(data.user);
        })
        .catch(() => router.push("/admin/login"));
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Customers", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
    { name: "Policies", href: "/admin/policies", icon: <ShieldCheck className="w-5 h-5" /> },
    {
      name: "Renewals & Reminders",
      href: "/admin/renewals",
      icon: <Clock className="w-5 h-5" />,
      badge: "Core",
    },
    { name: "Documents", href: "/admin/documents", icon: <FolderOpen className="w-5 h-5" /> },
    { name: "Enquiries", href: "/admin/enquiries", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Reports", href: "/admin/reports", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#06223B] text-white flex flex-col justify-between border-r border-navy-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <a href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="h-10 px-1.5 py-0.5 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-white flex items-center justify-center">
                <img
                  src="/images/op-life-solutions-logo.jpg"
                  alt="OP Life Solutions Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xs text-white tracking-tight leading-tight block">
                  OP LIFE SOLUTIONS
                </span>
                <span className="text-[9px] font-bold text-[#D9A441] tracking-wider uppercase block mt-0.5">
                  ADMIN CONSOLE
                </span>
              </div>
            </a>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#0B666B] to-[#07474B] text-white shadow-md border-l-4 border-[#D9A441]"
                      : "text-slate-300 hover:bg-[#0B314D] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-[#F2C96B]" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9A441] text-[#06223B]">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
          </a>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D9A441] text-[#06223B] font-bold flex items-center justify-center text-xs">
                OPS
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-white truncate">
                  {adminUser?.name || "Om Prakash Sahu"}
                </span>
                <span className="block text-[10px] text-slate-400">Super Admin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#06223B] font-bold capitalize">
                {pathname.replace("/admin/", "").replace(/-/g, " ") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/admin/renewals"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
            >
              <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Renewals Watch</span>
            </a>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#06223B] text-white font-bold flex items-center justify-center text-xs">
                OP
              </div>
              <span className="hidden md:inline text-xs font-bold text-slate-800">
                {adminUser?.name || "Om Prakash Sahu"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}
    </div>
  );
}
