import { notFound } from "next/navigation";
import BookingWrapper from "@/components/dress-detail/BookingWrapper";
import ImageGallery from "@/components/dress-detail/ImageGallery";
import Link from "next/link";

interface Dress {
  id: number;
  name: string;
  description: string;
  price: number;
  mainImage: string;
  subImages: string[];
}

async function getDress(id: string): Promise<Dress | null> {
  const res = await fetch(`http://localhost:3000/dresses/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function DressDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dress = await getDress(id);

  if (!dress) return notFound();
  const allImages = [dress.mainImage, ...(dress.subImages || [])];

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-6 md:px-12 lg:px-20 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          <ImageGallery images={allImages} name={dress.name} />

          <div className="lg:col-span-5 flex flex-col pt-4">
            <nav className="mb-8 text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
              <Link href="/" className="hover:text-black">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link href="/collections" className="hover:text-black">
                Bộ sưu tập
              </Link>
            </nav>

            <h1 className="font-cormorant text-4xl md:text-5xl font-light text-black mb-4 uppercase tracking-tight">
              {dress.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-2xl font-light text-neutral-900">
                {Number(dress.price).toLocaleString("vi-VN")} VNĐ
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase">
                Giá thuê / ngày
              </span>
            </div>

            <div className="w-full h-px bg-neutral-100 mb-8" />

            <div className="prose prose-neutral mb-12">
              <p className="text-sm leading-relaxed text-neutral-500 font-light whitespace-pre-line italic">
                {dress.description}
              </p>
            </div>

            <BookingWrapper dressId={dress.id} />

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4 py-6 border-t border-neutral-50">
                <span className="text-xl">✨</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold">
                    Premium Quality
                  </p>
                  <p className="text-[11px] text-neutral-400 font-light">
                    Chỉnh sửa theo số đo riêng của khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
