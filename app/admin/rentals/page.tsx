// app/admin/rentals/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { apiFetch } from "@/lib/api";

enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
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

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
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
      const data = await apiFetch<any>("/rentals");
      setRentals(Array.isArray(data) ? data : data.data || []);
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
      await apiFetch(`/rentals/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setRentals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
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

  const filteredAndSortedRentals = useMemo(() => {
    let result = [...rentals];

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName?.toLowerCase().includes(lowSearch) ||
          r.phone?.includes(searchTerm),
      );
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.rentStart).getTime();
      const dateB = new Date(b.rentStart).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [rentals, searchTerm, statusFilter, sortOrder]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-8 bg-neutral-50 min-h-screen font-sans animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="font-cormorant text-3xl uppercase tracking-widest text-neutral-800">
              Quản lý Đơn thuê váy
            </h1>
            <p className="text-neutral-400 text-xs mt-2">
              Xin chào, {user?.email} | Tổng số:{" "}
              {filteredAndSortedRentals.length} đơn hàng
            </p>
          </header>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-[2] relative">
              <input
                type="text"
                placeholder="Tìm theo tên khách hoặc số điện thoại..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-all bg-white shadow-sm"
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
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg outline-none text-sm bg-white focus:ring-1 focus:ring-rose-500 cursor-pointer font-medium text-neutral-600 shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">📋 Tất cả trạng thái</option>
              <option value={AppointmentStatus.PENDING}>⏳ Chờ xử lý</option>
              <option value={AppointmentStatus.CONFIRMED}>
                ✅ Đã xác nhận
              </option>
              <option value={AppointmentStatus.COMPLETED}>
                🎉 Đã hoàn tất
              </option>
              <option value={AppointmentStatus.CANCELLED}>❌ Đã hủy</option>
            </select>

            <select
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg outline-none text-sm bg-white focus:ring-1 focus:ring-rose-500 cursor-pointer font-medium text-neutral-600 shadow-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">📅 Mới nhất trước</option>
              <option value="oldest">📅 Cũ nhất trước</option>
            </select>
          </div>

          {/* Bảng dữ liệu */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rose-600 text-white text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium">Số điện thoại</th>
                  <th className="px-6 py-4 font-medium">Sản phẩm</th>
                  <th className="px-6 py-4 font-medium text-center">
                    Thời gian thuê
                  </th>
                  <th className="px-6 py-4 font-medium text-right">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 text-neutral-600">
                {filteredAndSortedRentals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-neutral-400"
                    >
                      <p className="text-sm">
                        📭 Không tìm thấy đơn thuê nào phù hợp.
                      </p>
                      <p className="text-xs mt-2 text-neutral-300">
                        Thử thay đổi bộ lọc hoặc tìm kiếm
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedRentals.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-rose-50/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-neutral-800">
                          {r.customerName}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-neutral-500 font-mono">
                          {r.phone}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-neutral-700 truncate max-w-[180px]">
                          {r.dress?.name || "Chưa có sản phẩm"}
                        </p>
                        <p className="text-[9px] text-neutral-400 uppercase mt-1">
                          Mã đơn: #{r.id}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col gap-0.5 items-center">
                          <span className="text-[10px] text-neutral-500">
                            Từ:{" "}
                            <span className="font-semibold">
                              {formatLocalDate(r.rentStart)}
                            </span>
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            Đến:{" "}
                            <span className="font-semibold">
                              {formatLocalDate(r.rentEnd)}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {updatingId === r.id && (
                            <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                          )}
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleStatusChange(r.id, e.target.value)
                            }
                            disabled={updatingId === r.id}
                            className={`text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg outline-none border cursor-pointer transition-colors ${
                              r.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : r.status === "confirmed"
                                  ? "bg-blue-50 text-blue-600 border-blue-200"
                                  : r.status === "completed"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-rose-50 text-rose-500 border-rose-200"
                            }`}
                          >
                            <option value={AppointmentStatus.PENDING}>
                              ⏳ Chờ xử lý
                            </option>
                            <option value={AppointmentStatus.CONFIRMED}>
                              ✅ Xác nhận
                            </option>
                            <option value={AppointmentStatus.COMPLETED}>
                              🎉 Hoàn tất
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

          <div className="mt-6 text-[10px] text-neutral-400 uppercase tracking-[0.2em] flex justify-between items-center px-2">
            <span>Tổng số: {filteredAndSortedRentals.length} đơn hàng</span>
            <span className="italic text-neutral-300">
              Wedding Atelier Management System
            </span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
