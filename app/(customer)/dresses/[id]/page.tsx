import { notFound } from "next/navigation";
import BookingWrapper from "@/components/dress-detail/BookingWrapper";
import ImageGallery from "@/components/dress-detail/ImageGallery";
import Link from "next/link";
import { ChevronRight, Ruler } from "lucide-react"; // Cài lucide-react nếu chưa có

interface Dress {
  id: number;
  name: string;
  description: string;
  price: number;
  mainImage: string;
  subImages: string[];
}

async function getDress(id: string): Promise<Dress | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dresses/${id}`, {
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
      <div className="w-full px-4 md:px-12 lg:px-24 py-12">
        {/* ✅ Bố cục chính: Sử dụng Sticky Layout cho phần thông tin */}
        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-12 items-start">
          {/* ✅ 1. Bên trái: ImageGallery - Chiếm 5/12 màn hình (Thu nhỏ so với 7/12 cũ) */}
          {/* Trên Mobile nó sẽ hiện trước, trên Desktop nó nằm bên trái */}
          <div className="lg:col-span-5 w-full">
            <ImageGallery images={allImages} name={dress.name} />
          </div>

          {/* ✅ 2. Bên phải: Phần thông tin - Chiếm 7/12 màn hình (Rộng hơn để text dễ đọc) */}
          {/* Thêm h-screen để Sticky hoạt động mượt mà */}
          <div className="lg:col-span-7 flex flex-col pt-2 lg:sticky lg:top-12 lg:h-screen lg:overflow-y-auto no-scrollbar">
            {/* Breadcrumb - Tinh tế hơn */}
            <nav className="mb-10 text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium flex items-center gap-2">
              <Link href="/" className="hover:text-black transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <Link
                href="/collections"
                className="hover:text-black transition-colors"
              >
                Bộ sưu tập
              </Link>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <span className="text-neutral-900 font-bold truncate">
                {dress.name}
              </span>
            </nav>

            {/* Tên sản phẩm - Font chữ và Spacing sang trọng hơn */}
            <h1 className="font-cormorant text-5xl md:text-6xl font-light text-black mb-6 uppercase tracking-tight leading-tight">
              {dress.name}
            </h1>

            {/* Vùng Giá tiền & Trạng thái */}
            <div className="flex items-center justify-between gap-4 mb-10 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-medium">
                  Giá thuê / ngày
                </span>
                <span className="text-3xl font-light text-neutral-950">
                  {Number(dress.price).toLocaleString("vi-VN")}
                  <span className="text-sm ml-1.5 opacity-60">VNĐ</span>
                </span>
              </div>
            </div>

            {/* Mô tả sản phẩm - White space-pre-line để giữ xuống hàng */}
            <div className="prose prose-neutral mb-12 max-w-none">
              <label className="text-[11px] font-bold text-neutral-400 block uppercase tracking-widest mb-3">
                Mô tả chi tiết
              </label>
              <p className="text-[15px] leading-relaxed text-neutral-600 font-light whitespace-pre-line bg-white/50 p-1">
                {dress.description}
              </p>
            </div>

            {/* Booking Component - Nút đặt lịch */}
            <BookingWrapper dressId={dress.id} />

            {/* ✅ Phần Premium Features - Thiết kế lại gọn gàng hơn */}
            <div className="mt-16 pt-10 border-t border-neutral-100 space-y-6">
              <label className="text-[11px] font-bold text-neutral-400 block uppercase tracking-widest mb-2">
                Dịch vụ đi kèm
              </label>

              <div className="flex items-start gap-4 p-5 rounded-xl border border-neutral-50 bg-neutral-50/50">
                <Ruler className="w-6 h-6 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm uppercase tracking-wider font-bold text-neutral-900">
                    Premium Fitting
                  </p>
                  <p className="text-[13px] text-neutral-500 font-light mt-1">
                    Hỗ trợ chỉnh sửa váy trực tiếp theo số đo riêng của bạn, đảm
                    bảo vừa vặn hoàn hảo.
                  </p>
                </div>
              </div>
            </div>

            {/* Thêm khoảng trống cuối trang khi cuộn sticky */}
            <div className="h-20 lg:h-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
