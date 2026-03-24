// components/home/CTASection.tsx
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="w-full py-40 bg-black text-white relative overflow-hidden">
      {/* Họa tiết trang trí chìm */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <p className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-8 font-semibold">
          Khởi đầu ước mơ
        </p>
        <h2 className="font-cormorant text-5xl md:text-7xl font-light mb-12 tracking-tight">
          Tìm Thấy <span className="italic">Nàng Thơ</span> Của Bạn
        </h2>
        <Link
          href="/contact"
          className="bg-white text-black py-5 px-16 text-[11px] tracking-[0.4em] uppercase hover:bg-neutral-200 transition-all duration-300 rounded-none shadow-2xl"
        >
          Đặt Lịch Hẹn Ngay
        </Link>
      </div>
    </section>
  );
}
