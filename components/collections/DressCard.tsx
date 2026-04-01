// components/Collections/DressCard.tsx
import Image from "next/image";
import Link from "next/link";

interface Dress {
  id: number;
  name: string;
  price: number;
  mainImage: string;
}

export default function DressCard({ dress }: { dress: Dress }) {
  return (
    <Link
      href={`/dresses/${dress.id}`}
      className="group block bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 border border-neutral-100/50"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Image
          src={dress.mainImage || "/placeholder.jpg"}
          alt={dress.name}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Lớp phủ nhẹ khi hover để tăng tính thẩm mỹ */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Info Section */}
      <div className="text-center p-6 bg-white">
        <h3 className="font-cormorant text-2xl font-light text-black mb-3 tracking-wide truncate px-2">
          {dress.name}
        </h3>

        {/* Thanh gạch trang trí */}
        <div className="w-8 h-[1px] bg-neutral-200 mx-auto mb-4 group-hover:w-16 group-hover:bg-rose-300 transition-all duration-500"></div>

        <p className="text-sm text-neutral-600 tracking-widest font-medium">
          {Number(dress.price).toLocaleString("vi-VN")}
          <span className="text-[10px] ml-1 opacity-60">VNĐ</span>
        </p>
      </div>
    </Link>
  );
}
