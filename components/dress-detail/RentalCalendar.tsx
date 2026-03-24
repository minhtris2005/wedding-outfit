"use client";

import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

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
  const router = useRouter();

  const fetchBlockedDates = useCallback(async () => {
    try {
      const data = await apiFetch<any>(`/rentals/calendar/${dressId}`);
      const result = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];
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

  // Hôm nay (bỏ qua giờ phút giây)
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Tách riêng 2 loại ngày để tô màu khác nhau
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

  // Hàm kiểm tra ngày quá khứ (chỉ trong tháng hiện tại)
  const isPastDate = (date: Date) => {
    return date < today;
  };

  // Kết hợp tất cả ngày bị disable: ngày rent + buffer
  const allBlockedDates = useMemo(() => {
    return [...rentDates, ...bufferDates];
  }, [rentDates, bufferDates]);

  const handleSelect = (selected: DateRange | undefined) => {
    if (!selected) {
      onRangeSelect(undefined);
      return;
    }

    // Kiểm tra ngày bắt đầu không được là quá khứ
    if (selected.from && selected.from < today) {
      alert("Không thể chọn ngày trong quá khứ!");
      return;
    }

    // Kiểm tra xem trong khoảng chọn có dính ngày blocked nào không
    const hasBlocked = allBlockedDates.some((blocked) => {
      if (!selected.from || !selected.to) return false;
      return blocked >= selected.from && blocked <= selected.to;
    });

    if (hasBlocked) {
      alert(
        "Khoảng ngày này chứa ngày đã được thuê hoặc thời gian chờ (buffer).",
      );
      return;
    }

    onRangeSelect(selected);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs text-neutral-400">Đang tải lịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-100">
      <style>{`
        /* Custom màu sắc cho DayPicker */
        .rdp-day_selected, .rdp-day_selected:hover { 
          background-color: black !important; 
          color: white; 
        }
        .rdp-day_range_middle { 
          background-color: #f3f4f6 !important; 
          color: black !important; 
        }
        .date-rent { 
          background-color: #ef4444 !important; /* Đỏ */
          color: white !important;
          border-radius: 50%;
        }
        .date-buffer { 
          background-color: #facc15 !important; /* Vàng */
          color: black !important;
          border-radius: 50%;
        }
        .rdp-day_disabled {
          text-decoration: line-through;
          opacity: 0.5;
          cursor: not-allowed;
        }
        .rdp-day_disabled:hover {
          background-color: transparent !important;
        }
      `}</style>

      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={allBlockedDates}
        modifiers={{
          rent: rentDates,
          buffer: bufferDates,
          past: isPastDate,
        }}
        modifiersClassNames={{
          rent: "date-rent",
          buffer: "date-buffer",
          past: "rdp-day_disabled",
        }}
        fromMonth={today}
        toMonth={new Date(new Date().setMonth(new Date().getMonth() + 3))}
      />

      <div className="mt-6 space-y-2 text-[10px] uppercase tracking-widest text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span>Đã được thuê</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span>Thời gian chuẩn bị (Buffer)</span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
          <span className="w-3 h-3 bg-black rounded-full" />
          <span>Khoảng ngày bạn chọn</span>
        </div>
      </div>
    </div>
  );
}
