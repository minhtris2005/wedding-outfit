"use client";

import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { vi } from "date-fns/locale";

type CalendarItem = {
  date: string;
  type: "rent" | "buffer";
};

export default function RentalCalendar({
  dressId,
  selectedRange,
  onRangeSelect,
}: {
  dressId: number;
  selectedRange: DateRange | undefined;
  onRangeSelect: (range: DateRange | undefined) => void;
}) {
  const [blockedDates, setBlockedDates] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State quản lý thông báo lỗi
  const router = useRouter();

  // Hàm hiển thị lỗi tạm thời
  const showAlert = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000); // Tự tắt sau 3 giây
  };

  const fetchBlockedDates = useCallback(async () => {
    try {
      const data = await apiFetch<any>(`/rentals/calendar/${dressId}`);
      const result = Array.isArray(data) ? data : data.data || [];
      setBlockedDates(result);
    } catch (error: any) {
      console.error("Lỗi tải lịch:", error);
      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [dressId, router]);

  useEffect(() => {
    fetchBlockedDates();
  }, [fetchBlockedDates]);

  const convertToLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const rentDates = useMemo(
    () =>
      blockedDates
        .filter((d) => d.type === "rent")
        .map((d) => convertToLocalDate(d.date)),
    [blockedDates],
  );

  const bufferDates = useMemo(
    () =>
      blockedDates
        .filter((d) => d.type === "buffer")
        .map((d) => convertToLocalDate(d.date)),
    [blockedDates],
  );

  const allBlockedDates = useMemo(
    () => [...rentDates, ...bufferDates],
    [rentDates, bufferDates],
  );

  const handleSelect = (selected: DateRange | undefined) => {
    if (!selected) {
      onRangeSelect(undefined);
      return;
    }

    // Thay alert bằng showAlert
    if (selected.from && selected.from < today) {
      showAlert("Không thể chọn ngày trong quá khứ");
      return;
    }

    const hasBlocked = allBlockedDates.some((blocked) => {
      if (!selected.from || !selected.to) return false;
      return blocked >= selected.from && blocked <= selected.to;
    });

    if (hasBlocked) {
      showAlert("Khoảng ngày này đã có người đặt hoặc đang bảo trì");
      return;
    }

    onRangeSelect(selected);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="relative p-6 bg-white rounded-xl shadow-sm border border-neutral-100">
      {/* Giao diện Thông báo lỗi Custom (Toast) */}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fadeInUp">
          <div className="bg-black text-white text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap">
            <span className="text-rose-500 text-lg">!</span>
            {errorMsg}
          </div>
        </div>
      )}

      <style>{`
        .rdp-day_selected, .rdp-day_selected:hover { background-color: black !important; color: white; }
        .rdp-day_range_middle { background-color: #f3f4f6 !important; color: black !important; }
        .date-rent { background-color: #ef4444 !important; color: white !important; border-radius: 50%; }
        .date-buffer { background-color: #facc15 !important; color: black !important; border-radius: 50%; }
        .rdp-day_disabled { text-decoration: line-through; opacity: 0.3; cursor: not-allowed; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out forwards; }
      `}</style>

      <DayPicker
        mode="range"
        locale={vi}
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={allBlockedDates}
        modifiers={{
          rent: rentDates,
          buffer: bufferDates,
          past: (date) => date < today,
        }}
        modifiersClassNames={{
          rent: "date-rent",
          buffer: "date-buffer",
          past: "rdp-day_disabled",
        }}
        fromMonth={today}
        toMonth={new Date(new Date().setMonth(new Date().getMonth() + 3))}
      />

      {/* Chú thích phía dưới giữ nguyên như cũ */}
      <div className="mt-6 space-y-2 text-[10px] uppercase tracking-widest text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span>Đã được thuê</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span>Thời gian chuẩn bị</span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100 text-black font-bold">
          <span className="w-3 h-3 bg-blue-600 rounded-full" />
          <span>Lịch bạn chọn</span>
        </div>
      </div>
    </div>
  );
}
