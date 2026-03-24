// components/Collections/DressCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Dress {
  id: number;
  name: string;
  price: number;
  mainImage: string; // Đổi từ imageUrl thành mainImage ở đây
}

export default function DressCard({ dress }: { dress: Dress }) {
  return (
    <Link href={`/dresses/${dress.id}`} className="group block overflow-hidden bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6">
        <Image
          src={dress.mainImage || '/placeholder.jpg'} // Sử dụng mainImage
          alt={dress.name}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
      </div>

      <div className="text-center px-2 pb-4">
        <h3 className="font-cormorant text-2xl font-light text-black mb-2 tracking-wide">
          {dress.name}
        </h3>
        <div className="w-8 h-px bg-neutral-200 mx-auto mb-3 group-hover:w-16 transition-all duration-500"></div>
        <p className="text-sm text-neutral-600 tracking-wider font-light">
          {Number(dress.price).toLocaleString("vi-VN")} <span className="text-[10px] opacity-70">VNĐ</span>
        </p>
      </div>
    </Link>
  );
}