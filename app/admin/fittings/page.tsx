// app/admin/fittings/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { apiFetch } from "@/lib/api";

enum AppointmentStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

// Helper xử lý ngày giống RentalCalendar
const formatLocalDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatLocalDateLong = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function AdminFittingsPage() {
  const [fittings, setFittings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any>("/fittings");
      setFittings(Array.isArray(data) ? data : data.data || []);
      setTimeout(() => setPageReady(true), 300);
    } catch (error: any) {
      console.error("Lỗi tải dữ liệu:", error);

      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/fittings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setFittings((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)),
      );
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);

      if (error.message?.includes("401")) {
        router.push("/login");
      } else {
        alert("Cập nhật trạng thái thất bại: " + (error.message || ""));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAndSortedFittings = useMemo(() => {
    let result = [...fittings];

    if (statusFilter !== "all") {
      result = result.filter((f) => f.status === statusFilter);
    }

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          f.customerName?.toLowerCase().includes(lowSearch) ||
          f.phone?.includes(searchTerm),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [fittings, searchTerm, statusFilter, sortOrder]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-8 bg-neutral-50 min-h-screen font-sans animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="font-cormorant text-3xl uppercase tracking-widest text-neutral-800">
              Quản lý lịch thử váy
            </h1>
            <p className="text-neutral-400 text-xs mt-2">
              Xin chào, {user?.email} | Tổng số:{" "}
              {filteredAndSortedFittings.length} lịch hẹn
            </p>
          </header>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-[2] relative">
              <input
                type="text"
                placeholder="Tìm tên khách hoặc số điện thoại..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg outline-none text-sm bg-white focus:ring-1 focus:ring-rose-500 cursor-pointer font-medium text-neutral-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">📋 Tất cả trạng thái</option>
              <option value={AppointmentStatus.PENDING}>⏳ Chờ xử lý</option>
              <option value={AppointmentStatus.COMPLETED}>
                ✅ Đã hoàn tất
              </option>
              <option value={AppointmentStatus.CANCELLED}>❌ Đã hủy</option>
            </select>

            <select
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg outline-none text-sm bg-white focus:ring-1 focus:ring-rose-500 cursor-pointer font-medium text-neutral-600"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">📅 Mới nhất trước</option>
              <option value="oldest">📅 Cũ nhất trước</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rose-600 text-white text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Số điện thoại</th>
                  <th className="px-6 py-4 font-medium">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium">Ngày thử</th>
                  <th className="px-6 py-4 font-medium text-center">
                    Khung giờ
                  </th>
                  <th className="px-6 py-4 font-medium text-right">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredAndSortedFittings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-20 text-center text-neutral-400"
                    >
                      <p className="text-sm">
                        📭 Không tìm thấy lịch thử nào phù hợp.
                      </p>
                      <p className="text-xs mt-2 text-neutral-300">
                        Thử thay đổi bộ lọc hoặc tìm kiếm
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedFittings.map((f) => (
                    <tr
                      key={f.id}
                      className="hover:bg-rose-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-neutral-800">
                          {f.customerName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-500 font-mono">
                          {f.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-700 truncate max-w-[180px]">
                          {f.dress?.name || "Chưa chọn sản phẩm"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatLocalDateLong(f.date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-bold text-neutral-600">
                          {f.timeSlot}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {updatingId === f.id && (
                            <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                          )}
                          <select
                            value={f.status}
                            onChange={(e) =>
                              handleStatusChange(f.id, e.target.value)
                            }
                            disabled={updatingId === f.id}
                            className={`text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg outline-none border cursor-pointer transition-colors ${
                              f.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : f.status === "completed"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : "bg-rose-50 text-rose-500 border-rose-200"
                            }`}
                          >
                            <option value={AppointmentStatus.PENDING}>
                              ⏳ Chờ xử lý
                            </option>
                            <option value={AppointmentStatus.COMPLETED}>
                              ✅ Hoàn tất
                            </option>
                            <option value={AppointmentStatus.CANCELLED}>
                              ❌ Hủy bỏ
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-[10px] text-neutral-400 uppercase tracking-widest flex justify-between items-center">
            <span>Tổng cộng: {filteredAndSortedFittings.length} lịch hẹn</span>
            <span className="italic text-neutral-300">
              Wedding Atelier Management System
            </span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
