// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { apiFetch } from "@/lib/api";

interface DashboardStats {
  totalDresses: number;
  newRentals: number;
  fittingsToday: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDresses: 0,
    newRentals: 0,
    fittingsToday: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Fetch thống kê từ nhiều API khác nhau
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Gọi song song nhiều API để lấy thống kê
      const [dressesData, rentalsData, fittingsData] = await Promise.all([
        apiFetch<any>("/dresses").catch(() => ({ data: [] })),
        apiFetch<any>("/rentals").catch(() => ({ data: [] })),
        apiFetch<any>("/fittings").catch(() => ({ data: [] })),
      ]);

      // Xử lý dữ liệu dresses
      const dresses = Array.isArray(dressesData)
        ? dressesData
        : dressesData.data || [];

      // Xử lý dữ liệu rentals - đếm đơn mới (completed)
      const rentals = Array.isArray(rentalsData)
        ? rentalsData
        : rentalsData.data || [];
      const newRentals = rentals.filter(
        (r: any) => r.status === "completed",
      ).length;

      // Xử lý dữ liệu fittings - đếm lịch hẹn hôm nay
      const fittings = Array.isArray(fittingsData)
        ? fittingsData
        : fittingsData.data || [];
      const today = new Date().toISOString().split("T")[0];
      const fittingsToday = fittings.filter(
        (f: any) => f.date === today,
      ).length;

      // Tính doanh thu (giả sử từ rentals đã completed)
      const revenue = rentals
        .filter((r: any) => r.status === "completed")
        .reduce((sum: number, r: any) => sum + (r.totalPrice || 0), 0);

      setStats({
        totalDresses: dresses.length,
        newRentals,
        fittingsToday,
        revenue,
      });

      setTimeout(() => setPageReady(true), 300);
    } catch (error: any) {
      console.error("Lỗi tải dữ liệu Dashboard:", error);

      if (error.message?.includes("401")) {
        router.push("/login");
      } else {
        setPageReady(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Tổng sản phẩm",
      value: stats.totalDresses,
      icon: "👗",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Đơn thuê mới",
      value: stats.newRentals,
      icon: "📦",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Lịch thử hôm nay",
      value: stats.fittingsToday,
      icon: "📅",
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Doanh thu tháng",
      value: stats.revenue ? `${stats.revenue.toLocaleString()}đ` : "0đ",
      icon: "💰",
      color: "bg-green-50 text-green-600",
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-8 bg-neutral-50 min-h-screen font-sans animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {/* Header với nút logout */}
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="font-cormorant text-3xl uppercase tracking-[0.2em] text-neutral-800">
                Tổng quan Dashboard
              </h1>
              <p className="text-neutral-400 text-xs mt-2 uppercase tracking-widest font-light">
                Xin chào, {user?.email || "Admin"} | Cập nhật lần cuối:{" "}
                {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Nút đăng xuất */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all duration-300 group"
            >
              <span className="text-sm font-medium">Đăng xuất</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </header>

          {/* Thẻ thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-4`}
                >
                  {item.icon}
                </div>
                <p className="text-neutral-400 text-[10px] uppercase tracking-[0.1em] font-bold">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold text-neutral-800 mt-1">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    item.value
                  )}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Khu vực Biểu đồ */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                  Doanh thu 7 ngày gần nhất
                </h2>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                    Thu nhập thực tế
                  </span>
                </div>
              </div>

              <div className="h-[350px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">📊 Biểu đồ doanh thu</p>
                  <p className="text-xs text-gray-300">
                    Tính năng đang được phát triển
                  </p>
                </div>
              </div>
            </div>

            {/* Cột trạng thái công việc */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm">
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-8 text-neutral-500">
                  Tỷ lệ hiệu suất
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-600">
                      <span>Đơn hoàn tất</span>
                      <span className="text-emerald-500">
                        {stats.totalDresses > 0
                          ? `${Math.round((stats.newRentals / stats.totalDresses) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1 rounded-full">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{
                          width:
                            stats.totalDresses > 0
                              ? `${(stats.newRentals / stats.totalDresses) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-neutral-600">
                      <span>Lịch thử hôm nay</span>
                      <span className="text-blue-500">
                        {stats.fittingsToday > 0
                          ? `${stats.fittingsToday} lịch`
                          : "0"}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1 rounded-full">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(stats.fittingsToday * 10, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 p-8 rounded-2xl text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold mb-4">
                    Ghi chú vận hành
                  </p>
                  <p className="text-sm font-light leading-relaxed mb-6 italic">
                    {stats.fittingsToday > 0
                      ? `Có ${stats.fittingsToday} lịch thử hôm nay cần chuẩn bị.`
                      : "Hôm nay không có lịch thử nào."}
                  </p>
                  <button className="text-[10px] uppercase tracking-widest border-b border-white pb-1 opacity-70 hover:opacity-100 transition-opacity">
                    Xem danh sách nhắc nhở
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:rotate-12 transition-transform">
                  👰
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-10 pt-6 border-t border-neutral-200 flex justify-between items-center">
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
              Wedding Atelier CMS v2.0
            </p>
            <div className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
                Hệ thống đang trực tuyến
              </span>
            </div>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
