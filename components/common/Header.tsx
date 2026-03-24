// components/common/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { User, LogOut, Settings, Shield, LogIn } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItem = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`px-4 py-2 rounded-md transition ${
          active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {label}
      </Link>
    );
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  // Tránh hydration mismatch
  if (!mounted) return null;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-80 transition"
        >
          Dress Rental
        </Link>

        <nav className="flex gap-2">
          {navItem("/", "Trang chủ")}
          {navItem("/collections", "Bộ sưu tập")}

          {user && (
            <>
              {navItem("/rentals", "Đơn thuê")}
              {navItem("/fittings", "Lịch thử")}
            </>
          )}

          {user?.role === "admin" && navItem("/admin", "Quản trị")}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {user.email?.split("@")[0]}
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          {user.role === "admin" ? (
                            <>
                              <Shield className="w-3 h-3" />
                              Quản trị viên
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3" />
                              Khách hàng
                            </>
                          )}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Thông tin cá nhân
                      </Link>

                      <Link
                        href="/rentals"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="w-4 h-4">📦</span>
                        Đơn thuê của tôi
                      </Link>

                      <Link
                        href="/fittings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="w-4 h-4">📅</span>
                        Lịch thử đồ
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition border-t border-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Quản trị hệ thống
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm bg-black text-white rounded-md hover:opacity-90 transition"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
