// components/Booking/SimpleFittingForm.tsx
"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { apiFetch } from "@/lib/api";
import CustomerInfoInput from "./CustomerInfoInput";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

export default function SimpleFittingForm({ dressId }: { dressId: number }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const allSlots = ["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"];

  // Helper để lấy chuỗi ngày local không bị lệch múi giờ
  const toLocalDateString = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  useEffect(() => {
    const dateStr = toLocalDateString(selectedDate);
    if (!dateStr) return;

    const fetchSlots = async () => {
      try {
        const data = await apiFetch(
          `/fittings/by-date?dressId=${dressId}&date=${dateStr}`,
        );
        if (Array.isArray(data)) {
          setBookedSlots(data.map((item: any) => item.timeSlot));
        } else {
          setBookedSlots([]);
        }
      } catch (error) {
        setBookedSlots([]);
      }
    };
    fetchSlots();
  }, [selectedDate, dressId]);

  const handleFittingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !timeSlot) {
      alert("Vui lòng chọn đầy đủ ngày và khung giờ");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/fittings", {
        method: "POST",
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          date: toLocalDateString(selectedDate),
          timeSlot,
          dressId,
        }),
      });

      alert("Đặt lịch thử thành công!");
      setCustomerName("");
      setPhone("");
      setSelectedDate(undefined);
      setTimeSlot("");
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFittingSubmit} className="space-y-8">
      <style>{`
        .rdp { margin: 0; --rdp-cell-size: 45px; }
        .rdp-day_selected { background-color: black !important; color: white !important; border-radius: 8px !important; }
        .rdp-head_cell { text-transform: uppercase; font-size: 0.65rem; font-weight: 700; color: #a3a3a3; }
        .rdp-day { border-radius: 8px !important; }
      `}</style>

      <CustomerInfoInput
        name={customerName}
        phone={phone}
        setName={setCustomerName}
        setPhone={setPhone}
      />

      {/* CHỌN NGÀY THỬ - ĐÃ SỬA GIỐNG FITTINGFORM */}
      <div className="space-y-4" ref={calendarRef}>
        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">
          Chọn ngày thử (dd/mm/yyyy)
        </label>

        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full text-left bg-transparent border-b border-neutral-300 py-3 outline-none focus:border-black transition-all text-sm flex justify-between items-center"
        >
          {selectedDate ? (
            <span className="text-black font-medium">
              {format(selectedDate, "dd/MM/yyyy")}
            </span>
          ) : (
            <span className="text-neutral-300">Chọn ngày bạn ghé Showroom</span>
          )}
          <span
            className={`text-[10px] transition-transform duration-300 ${showCalendar ? "rotate-180" : ""}`}
          >
            {showCalendar ? "✕" : "▼"}
          </span>
        </button>

        {/* HIỂN THỊ DẠNG RELATIVE (ĐẨY NỘI DUNG XUỐNG) */}
        {showCalendar && (
          <div className="mt-2 bg-neutral-50/50 border border-neutral-100 rounded-3xl p-4 flex justify-center animate-in fade-in slide-in-from-top-2">
            <DayPicker
              mode="single"
              locale={vi}
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
                setTimeSlot("");
              }}
              disabled={[{ before: today }, { after: maxDate }]}
            />
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <label className="text-[10px] uppercase tracking-widest text-neutral-400 block">
            Khung giờ hẹn ngày {format(selectedDate, "dd/MM/yyyy")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {allSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setTimeSlot(slot)}
                  className={`p-4 text-[10px] tracking-widest border transition-all relative overflow-hidden rounded-xl ${
                    isBooked
                      ? "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed"
                      : timeSlot === slot
                        ? "bg-black text-white border-black"
                        : "border-neutral-100 hover:border-black"
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
        className="w-full bg-black text-white py-5 rounded-2xl text-[10px] tracking-[0.4em] uppercase hover:bg-neutral-900 transition-all disabled:opacity-30 shadow-xl"
      >
        {loading ? "Đang xử lý..." : "Xác nhận lịch thử váy"}
      </button>
    </form>
  );
}
