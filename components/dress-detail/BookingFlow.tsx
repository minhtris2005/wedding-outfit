"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import RentalCalendar from "./RentalCalendar";
import FittingForm from "./FittingForm";

type Step = 1 | 2;

export default function BookingFlow({ dressId }: { dressId: number }) {
  const [step, setStep] = useState<Step>(1);
  const [rentRange, setRentRange] = useState<DateRange | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hàm hiển thị thông báo lỗi custom
  const showAlert = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  return (
    <div className="relative mt-8 border border-neutral-100 p-8 rounded-3xl bg-neutral-50/50">
      {/* Toast thông báo lỗi */}
      {errorMsg && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-black text-white text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full shadow-xl whitespace-nowrap">
            {errorMsg}
          </div>
        </div>
      )}

      {/* ============================= */}
      {/* STEP 1 – CHỌN NGÀY THUÊ */}
      {/* ============================= */}
      {step === 1 && (
        <div className="animate-in fade-in duration-500">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold mb-1">
              Bước 01
            </p>
            <h2 className="font-cormorant text-2xl text-neutral-900 uppercase tracking-tight">
              Chọn ngày thuê
            </h2>
          </div>

          <RentalCalendar
            dressId={dressId}
            selectedRange={rentRange}
            onRangeSelect={(range) => setRentRange(range)}
          />

          <button
            onClick={() => {
              if (!rentRange?.from || !rentRange?.to) {
                showAlert("Vui lòng chọn khoảng ngày thuê");
                return;
              }
              setStep(2);
              // Cuộn lên đầu form để người dùng dễ nhìn
              window.scrollTo({ top: 100, behavior: "smooth" });
            }}
            className="mt-8 w-full bg-black text-white text-[11px] uppercase tracking-[0.3em] font-bold py-5 rounded-2xl hover:opacity-80 transition-all shadow-lg shadow-black/5"
          >
            Tiếp tục đặt lịch
          </button>
        </div>
      )}

      {/* ============================= */}
      {/* STEP 2 – FITTING FORM */}
      {/* ============================= */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold mb-1">
                Bước 02
              </p>
              <h2 className="font-cormorant text-2xl text-neutral-900 uppercase tracking-tight">
                Thông tin đặt lịch
              </h2>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors flex items-center gap-2 border-b border-transparent hover:border-black pb-1"
            >
              ← Quay lại
            </button>
          </div>

          {/* TRUYỀN RENTAL RANGE SANG FITTING FORM */}
          <FittingForm dressId={dressId} rentalRange={rentRange} />
        </div>
      )}
    </div>
  );
}
