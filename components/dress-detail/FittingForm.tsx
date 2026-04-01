"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { apiFetch } from "@/lib/api";
import CustomerInfoInput from "./CustomerInfoInput";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

interface Props {
  dressId: number;
  // Sửa dòng này để khớp hoàn toàn với DateRange
  rentalRange?: { from?: Date; to?: Date } | undefined;
}

export default function FittingForm({ dressId, rentalRange }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const allSlots = ["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"];

  // Sử dụng format của date-fns để tránh lệch múi giờ (YYYY-MM-DD)
  const fittingDateStr = useMemo(() => {
    return selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  // Đóng lịch khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy slot đã đặt
  useEffect(() => {
    if (!fittingDateStr) return;
    const fetchSlots = async () => {
      try {
        const data = await apiFetch(
          `/fittings/by-date?dressId=${dressId}&date=${fittingDateStr}`,
        );
        if (Array.isArray(data)) {
          setBookedSlots(data.map((item: any) => item.timeSlot));
        } else {
          setBookedSlots([]);
        }
      } catch {
        setBookedSlots([]);
      }
    };
    fetchSlots();
  }, [fittingDateStr, dressId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rentalRange?.from || !rentalRange?.to) {
      alert("Vui lòng chọn khoảng ngày thuê ở Bước 1");
      return;
    }

    if (!selectedDate || !timeSlot) {
      alert("Vui lòng chọn đầy đủ ngày và khung giờ thử");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          customerName,
          phone,
          // SỬA TẠI ĐÂY: Dùng format(...) thay vì toISOString() để tránh lùi ngày
          rentStart: format(rentalRange.from, "yyyy-MM-dd"),
          rentEnd: format(rentalRange.to, "yyyy-MM-dd"),
          fittingDate: fittingDateStr,
          timeSlot,
          dressId,
        }),
      });

      alert("Đặt lịch thuê và lịch thử thành công!");
      setCustomerName("");
      setPhone("");
      setSelectedDate(undefined);
      setTimeSlot("");
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-10 animate-in fade-in duration-700"
    >
      <style>{`
        .rdp { margin: 0; }
        .rdp-day_selected { background-color: black !important; color: white !important; border-radius: 8px !important; }
        .rdp-head_cell { text-transform: uppercase; font-size: 0.65rem; font-weight: 700; color: #a3a3a3; }
        .rdp-day { border-radius: 8px !important; }
      `}</style>

      <div className="border-b border-neutral-100 pb-4">
        <h2 className="font-cormorant text-2xl font-light uppercase tracking-widest text-black">
          Hoàn tất thông tin
        </h2>
      </div>

      <CustomerInfoInput
        name={customerName}
        phone={phone}
        setName={setCustomerName}
        setPhone={setPhone}
      />

      <div className="space-y-4 relative" ref={calendarRef}>
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium block">
          Ngày đến thử váy (Dự kiến trước ngày thuê)
        </label>

        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full text-left bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-black transition-all text-sm font-light flex justify-between items-center"
        >
          {selectedDate ? (
            <span className="text-black font-medium">
              {format(selectedDate, "dd/MM/yyyy")}
            </span>
          ) : (
            <span className="text-neutral-300">Chọn ngày (dd/mm/yyyy)</span>
          )}
          <span className="text-xs text-neutral-400">📅</span>
        </button>

        {showCalendar && (
          <div className="absolute z-50 bottom-full mb-4 left-0 bg-white shadow-2xl border border-neutral-100 rounded-2xl p-4 animate-in fade-in zoom-in-95">
            <DayPicker
              mode="single"
              locale={vi}
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
                setTimeSlot("");
              }}
              disabled={
                [
                  { before: today },
                  { after: maxDate },
                  rentalRange?.from
                    ? {
                        after: new Date(
                          new Date(rentalRange.from).setHours(0, 0, 0, -1),
                        ),
                      }
                    : false,
                ].filter(Boolean) as any
              }
              // Thêm thông báo khi nhấn ngày bị khóa
              onDayClick={(day, modifiers) => {
                if (modifiers.disabled) {
                  if (
                    rentalRange?.from &&
                    day >=
                      new Date(new Date(rentalRange.from).setHours(0, 0, 0, 0))
                  ) {
                    alert(
                      "Lịch thử váy phải diễn ra TRƯỚC ngày thuê. Vui lòng chọn ngày khác!",
                    );
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="space-y-4 animate-fadeIn">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium block">
            Khung giờ hẹn cho ngày {format(selectedDate, "dd/MM/yyyy")}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-4 px-2 text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                    isBooked
                      ? "bg-neutral-50 text-neutral-300 border-neutral-50 cursor-not-allowed"
                      : timeSlot === slot
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-100 hover:border-black"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-6 text-[10px] tracking-[0.4em] uppercase hover:bg-neutral-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
      >
        {loading ? "Đang xử lý..." : "Xác nhận đặt thuê ngay"}
      </button>
    </form>
  );
}
