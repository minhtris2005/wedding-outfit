"use client";
import { useState } from "react";
import BookingFlow from "./BookingFlow"; // Logic thuê (Step 1 + 2)
import SimpleFittingForm from "./SimpleFittingForm"; // Logic chỉ đặt lịch thử

export default function BookingWrapper({ dressId }: { dressId: number }) {
  const [activeTab, setActiveTab] = useState<"none" | "rental" | "fitting">("none");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab("rental")}
          className={`py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 border ${
            activeTab === "rental" ? "bg-black text-white" : "bg-white text-black border-black hover:bg-neutral-50"
          }`}
        >
          Đặt lịch thuê
        </button>
        <button
          onClick={() => setActiveTab("fitting")}
          className={`py-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 border ${
            activeTab === "fitting" ? "bg-black text-white" : "bg-white text-black border-black hover:bg-neutral-50"
          }`}
        >
          Đặt lịch thử váy
        </button>
      </div>

      {/* Hiển thị logic dựa trên nút bấm */}
      <div className="transition-all duration-500 overflow-hidden">
        {activeTab === "rental" && (
          <div className="mt-8 p-8 border border-neutral-100 bg-neutral-50 animate-in fade-in slide-in-from-top-4">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-cormorant text-2xl">Lịch Thuê Váy</h3>
                <button onClick={() => setActiveTab("none")} className="text-xs uppercase tracking-tighter text-neutral-400">Đóng ✕</button>
             </div>
             <BookingFlow dressId={dressId} />
          </div>
        )}

        {activeTab === "fitting" && (
          <div className="mt-8 p-8 border border-neutral-100 bg-neutral-50 animate-in fade-in slide-in-from-top-4">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-cormorant text-2xl">Lịch Thử Váy</h3>
                <button onClick={() => setActiveTab("none")} className="text-xs uppercase tracking-tighter text-neutral-400">Đóng ✕</button>
             </div>
             <SimpleFittingForm dressId={dressId} />
          </div>
        )}
      </div>
    </div>
  );
}