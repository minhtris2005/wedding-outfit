"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Helper xử lý ngày giống RentalCalendar
const toLocalDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date;
};

const formatLocalDate = (
  dateStr: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("vi-VN", options || defaultOptions);
};

const formatLocalDateTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Style Badge cho trạng thái
const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    pending: {
      label: "⏳ Đã đặt lịch",
      class: "bg-amber-50 text-amber-600 border-amber-200",
    },
    confirmed: {
      label: "✅ Đã xác nhận",
      class: "bg-blue-50 text-blue-600 border-blue-200",
    },
    completed: {
      label: "🎉 Đã thử xong",
      class: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    cancelled: {
      label: "❌ Đã hủy",
      class: "bg-rose-50 text-rose-400 border-rose-200",
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium border ${config.class}`}
    >
      {config.label}
    </span>
  );
};

export default function FittingsPage() {
  const [fittings, setFittings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { user } = useAuth();
  const router = useRouter();

  const fetchMyFittings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any>("/fittings/my");
      setFittings(Array.isArray(data) ? data : []);
      setTimeout(() => setPageReady(true), 300);
    } catch (error: any) {
      console.error("Lỗi tải lịch thử:", error);
      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        router.push("/login");
      }
      setFittings([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMyFittings();
  }, [fetchMyFittings]);

  // Lọc theo trạng thái
  const filteredFittings = fittings.filter((f) => {
    if (selectedFilter === "all") return true;
    return f.status === selectedFilter;
  });

  // Tính toán thống kê
  const stats = {
    total: fittings.length,
    pending: fittings.filter((f) => f.status === "pending").length,
    confirmed: fittings.filter((f) => f.status === "confirmed").length,
    completed: fittings.filter((f) => f.status === "completed").length,
  };

  if (loading || !pageReady) {
    return <LoadingSpinner message="Đang tải lịch thử của bạn..." />;
  }

  return (
    <div className="bg-white min-h-screen py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section với stats */}
        <div className="mb-16 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-block mb-4">
                <span className="text-[10px] tracking-[0.5em] uppercase text-white bg-black px-4 py-2 rounded-full">
                  My Fittings
                </span>
              </div>
              <h1 className="font-cormorant text-5xl md:text-6xl font-light uppercase tracking-[0.1em] text-neutral-900">
                Lịch thử váy
              </h1>
              <p className="text-sm text-neutral-500 mt-4 max-w-2xl">
                Xin chào,{" "}
                <span className="font-semibold text-black">{user?.email}</span>.
                Dưới đây là danh sách các buổi hẹn thử váy của bạn.
              </p>
            </div>
          </div>
          <div className="w-24 h-[2px] bg-black mt-8 mx-auto md:mx-0" />
        </div>

        {filteredFittings.length === 0 ? (
          <div className="py-32 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-neutral-200">
            <div className="text-7xl mb-6 opacity-30">👗</div>
            <p className="text-lg text-neutral-500 font-light mb-3">
              {selectedFilter === "all"
                ? "Bạn chưa có lịch thử nào"
                : "Không có lịch thử nào với trạng thái này"}
            </p>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-8">
              Hãy đặt lịch thử để trải nghiệm những mẫu váy tuyệt đẹp
            </p>
            <Link
              href="/collections"
              className="inline-block bg-black text-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all duration-500 rounded-full shadow-lg"
            >
              Khám phá bộ sưu tập
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredFittings.map((f, index) => (
              <div
                key={f.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-neutral-100 hover:border-black transition-all duration-500 overflow-hidden animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Image Section */}
                  <div className="md:w-48 relative overflow-hidden bg-gradient-to-br from-neutral-50 to-rose-50/30">
                    <div className="relative aspect-[4/5] md:aspect-auto md:h-full w-full">
                      <Image
                        src={f.dress?.mainImage || "/placeholder.jpg"}
                        alt={f.dress?.name || "Dress image"}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-8">
                    {/* Header với status */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-cormorant text-3xl font-light text-neutral-900">
                            {f.dress?.name || "Unknown Dress"}
                          </h2>
                          <span className="text-xs text-neutral-400">
                            #FIT-{f.id}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={f.status} />
                    </div>

                    {/* Chi tiết lịch hẹn */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-t border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          📅
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-400 mb-1">
                            Ngày hẹn
                          </p>
                          <p className="text-sm font-medium text-neutral-800">
                            {f.date ? formatLocalDate(f.date) : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          ⏰
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-400 mb-1">
                            Khung giờ
                          </p>
                          <p className="text-sm font-medium text-neutral-800">
                            {f.timeSlot}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          👤
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-400 mb-1">
                            Khách hàng
                          </p>
                          <p className="text-sm font-medium text-neutral-800">
                            {f.customerName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          📞
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-400 mb-1">
                            Số điện thoại
                          </p>
                          <p className="text-sm font-medium text-neutral-800">
                            {f.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-end">
                      <Link
                        href={`/dresses/${f.dress?.id}`}
                        className="group/link flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-black hover:text-rose-600 transition-colors"
                      >
                        <span>Xem chi tiết sản phẩm</span>
                        <span className="group-hover/link:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
