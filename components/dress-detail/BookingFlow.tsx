"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import RentalCalendar from "./RentalCalendar";
import FittingForm from "./FittingForm";

type Step = 1 | 2;

export default function BookingFlow({ dressId }: { dressId: number }) {
  const [step, setStep] = useState<Step>(1);
  const [rentRange, setRentRange] = useState<DateRange | undefined>();

  return (
    <div className="mt-8 border p-6 rounded-xl bg-gray-50">
      {/* ============================= */}
      {/* STEP 1 – CHỌN NGÀY THUÊ */}
      {/* ============================= */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Bước 1: Chọn ngày thuê
          </h2>

          <RentalCalendar
            dressId={dressId}
            selectedRange={rentRange} // Truyền state rentRange hiện tại vào đây
            onRangeSelect={(range) => setRentRange(range)}
          />

          <button
            onClick={() => {
              if (!rentRange?.from || !rentRange?.to) {
                alert("Vui lòng chọn khoảng ngày thuê");
                return;
              }
              setStep(2);
            }}
            className="mt-6 bg-black text-white px-6 py-2 rounded"
          >
            Tiếp tục
          </button>
        </>
      )}

      {/* ============================= */}
      {/* STEP 2 – FITTING FORM */}
      {/* ============================= */}
      {step === 2 && (
        <>
          <div className="mb-4">
            <button
              onClick={() => setStep(1)}
              className="text-sm underline text-gray-600"
            >
              ← Quay lại chọn ngày thuê
            </button>
          </div>

          <FittingForm
            dressId={dressId}
            rentalRange={
              rentRange?.from && rentRange?.to
                ? { from: rentRange.from, to: rentRange.to }
                : undefined
            }
          />
        </>
      )}
    </div>
  );
}