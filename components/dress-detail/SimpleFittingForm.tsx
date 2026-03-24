// components/Booking/SimpleFittingForm.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import CustomerInfoInput from "./CustomerInfoInput";

export default function SimpleFittingForm({ dressId }: { dressId: number }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [fittingDate, setFittingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allSlots = ["09:00-10:00", "10:00-11:00", "14:00-15:00", "15:00-16:00"];

  // Hôm nay (format YYYY-MM-DD)
  const today = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Giới hạn 3 tháng tới
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Format ngày hiển thị
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!fittingDate) return;

    const fetchSlots = async () => {
      try {
        const data = await apiFetch(
          `/fittings/by-date?dressId=${dressId}&date=${fittingDate}`,
        );
        if (Array.isArray(data)) {
          setBookedSlots(data.map((item: any) => item.timeSlot));
        } else {
          setBookedSlots([]);
        }
      } catch (error) {
        console.error("Lỗi tải khung giờ:", error);
        setBookedSlots([]);
      }
    };

    fetchSlots();
  }, [fittingDate, dressId]);

  const handleFittingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    if (!timeSlot) {
      alert("Vui lòng chọn khung giờ");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/fittings", {
        method: "POST",
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          date: fittingDate,
          timeSlot,
          dressId,
        }),
      });

      alert("Đặt lịch thử thành công!");
      setCustomerName("");
      setPhone("");
      setFittingDate("");
      setTimeSlot("");
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFittingSubmit} className="space-y-8">
      {/* GỌI COMPONENT NHẬP TIN Ở ĐÂY */}
      <CustomerInfoInput
        name={customerName}
        phone={phone}
        setName={setCustomerName}
        setPhone={setPhone}
      />

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-neutral-400">
          Chọn ngày thử
        </label>

        {/* Hiển thị ngày đã chọn */}
        {fittingDate && (
          <div className="mb-2 text-sm text-neutral-600">
            Bạn đã chọn:{" "}
            <span className="font-semibold">
              {formatDateDisplay(fittingDate)}
            </span>
          </div>
        )}

        <input
          type="date"
          className="w-full bg-transparent border-b border-neutral-300 py-2 outline-none focus:border-black transition-colors text-sm"
          value={fittingDate}
          onChange={(e) => {
            setFittingDate(e.target.value);
            setTimeSlot("");
          }}
          min={today}
          max={maxDate}
          required
        />

        <p className="text-[8px] text-neutral-400 mt-1">
          Chỉ được chọn từ ngày {formatDateDisplay(today)} đến ngày{" "}
          {formatDateDisplay(maxDate)}
        </p>
      </div>

      {fittingDate && (
        <div className="space-y-3 animate-fadeIn">
          <label className="text-[10px] uppercase tracking-widest text-neutral-400 block">
            Khung giờ hẹn ngày {formatDateDisplay(fittingDate)}
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
                  className={`p-4 text-[10px] tracking-widest border transition-all relative overflow-hidden ${
                    isBooked
                      ? "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed"
                      : timeSlot === slot
                        ? "bg-black text-white border-black"
                        : "border-neutral-100 hover:border-black"
                  }`}
                >
                  {slot}
                  {isBooked && (
                    <span className="absolute inset-0 flex items-center justify-center text-[6px] bg-white/50 text-neutral-400 tracking-widest">
                      ĐÃ ĐẶT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-5 text-[10px] tracking-[0.4em] uppercase hover:bg-neutral-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Đang xử lý...
          </span>
        ) : (
          "Xác nhận lịch thử váy"
        )}
      </button>
    </form>
  );
}
