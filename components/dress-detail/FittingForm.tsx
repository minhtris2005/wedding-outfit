"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import CustomerInfoInput from "./CustomerInfoInput";

interface Props {
  dressId: number;
  rentalRange: { from: Date; to: Date } | undefined;
}

export default function FittingForm({ dressId, rentalRange }: Props) {
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

  // Lấy ngày đầu tiên của tháng sau (để giới hạn input date)
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3); // Cho phép chọn 3 tháng tới
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

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
      } catch {
        setBookedSlots([]);
      }
    };

    fetchSlots();
  }, [fittingDate, dressId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rentalRange?.from || !rentalRange?.to) {
      alert("Vui lòng chọn khoảng ngày thuê");
      return;
    }

    if (!timeSlot) {
      alert("Vui lòng chọn khung giờ thử");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          customerName,
          phone,
          rentStart: rentalRange.from.toISOString().split("T")[0],
          rentEnd: rentalRange.to.toISOString().split("T")[0],
          fittingDate,
          timeSlot,
          dressId,
        }),
      });

      alert("Đặt lịch thuê và lịch thử thành công!");
      setCustomerName("");
      setPhone("");
      setFittingDate("");
      setTimeSlot("");
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Format ngày để hiển thị đẹp hơn
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-10 animate-in fade-in duration-700"
    >
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="font-cormorant text-2xl font-light uppercase tracking-widest text-black">
          Hoàn tất thông tin
        </h2>
      </div>

      {/* 1. Thông tin khách hàng dùng component chung */}
      <CustomerInfoInput
        name={customerName}
        phone={phone}
        setName={setCustomerName}
        setPhone={setPhone}
      />

      {/* 2. Chọn ngày thử */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
          Ngày đến thử váy (trước ngày thuê)
        </label>

        {/* Hiển thị ngày đã chọn (nếu có) */}
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
          className="w-full bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-black transition-all text-sm font-light"
          value={fittingDate}
          onChange={(e) => {
            setFittingDate(e.target.value);
            setTimeSlot("");
          }}
          min={today}
          max={maxDate}
          required
        />

        {/* Hiển thị range được phép chọn */}
        <p className="text-[8px] text-neutral-400 mt-1">
          Chỉ được chọn từ ngày {formatDateDisplay(today)} đến ngày{" "}
          {formatDateDisplay(maxDate)}
        </p>
      </div>

      {/* 3. Chọn khung giờ */}
      {fittingDate && (
        <div className="space-y-4 animate-fadeIn">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium block">
            Khung giờ hẹn cho ngày {formatDateDisplay(fittingDate)}
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

      {/* 4. Nút gửi */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-6 text-[10px] tracking-[0.4em] uppercase hover:bg-neutral-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Đang xử lý...
          </span>
        ) : (
          "Xác nhận đặt thuê ngay"
        )}
      </button>
    </form>
  );
}
