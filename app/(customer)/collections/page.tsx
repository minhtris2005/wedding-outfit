"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DressCard from "@/components/collections/DressCard";
import FilterBar from "@/components/collections/FilterBar";
import { apiFetch } from "@/lib/api";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface Dress {
  id: number;
  name: string;
  price: number;
  mainImage: string;
  subImages: string[];
  size?: string;
  color?: string;
}

export default function CollectionsPage() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2 hàng x 3 cột = 6 items

  const { user } = useAuth();
  const router = useRouter();

  // ✅ Tự động cuộn lên đầu trang ngay khi vào trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadDresses();
  }, []);

  const loadDresses = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any>("/dresses");
      const dressList = Array.isArray(data) ? data : data.data || [];
      setDresses(dressList);

      // Delay nhỏ để hiệu ứng xuất hiện mượt mà
      setTimeout(() => setPageReady(true), 300);
    } catch (error: any) {
      console.error("Lỗi tải danh sách váy:", error);

      if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc dữ liệu dựa trên Search, Size và Color
  const filteredDresses = useMemo(() => {
    return dresses.filter((dress) => {
      const matchesSearch = dress.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSize = selectedSize === "" || dress.size === selectedSize;
      const matchesColor =
        selectedColor === "" || dress.color === selectedColor;
      return matchesSearch && matchesSize && matchesColor;
    });
  }, [dresses, searchTerm, selectedSize, selectedColor]);

  // Logic phân trang
  const totalPages = Math.ceil(filteredDresses.length / itemsPerPage);
  const currentItems = filteredDresses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset về trang 1 khi người dùng thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSize, selectedColor]);

  // ✅ Hàm xử lý chuyển trang kèm cuộn lên đầu mượt mà
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || !pageReady) {
    return <LoadingSpinner message="Đang tải bộ sưu tập..." />;
  }

  return (
    <div className="min-h-screen bg-white py-20 w-full overflow-x-hidden animate-fadeIn">
      <div className="w-full px-6 md:px-12 lg:px-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-4 font-bold">
            Bridal Collection
          </p>
          <h1 className="font-cormorant text-5xl font-light uppercase text-neutral-900">
            Bộ Sưu Tập
          </h1>
          <div className="w-16 h-px bg-black mx-auto mt-6 opacity-20"></div>

          {user && (
            <p className="text-xs text-neutral-400 mt-4 italic">
              Chào mừng trở lại, {user.email}
            </p>
          )}
        </div>

        {/* Thanh tìm kiếm và bộ lọc */}
        <FilterBar
          onSearch={setSearchTerm}
          onSizeChange={setSelectedSize}
          onColorChange={setSelectedColor}
        />

        {/* Thông tin số lượng kết quả */}
        <div className="mb-10 text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-medium border-l-2 border-neutral-900 pl-3">
          Hiển thị {filteredDresses.length} sản phẩm
          {searchTerm && ` cho từ khóa "${searchTerm}"`}
        </div>

        {filteredDresses.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-neutral-100 rounded-[3rem]">
            <p className="font-cormorant text-3xl italic text-neutral-300 mb-6">
              Rất tiếc, không tìm thấy sản phẩm nào...
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSize("");
                setSelectedColor("");
              }}
              className="text-[10px] uppercase tracking-[0.3em] bg-black text-white px-8 py-4 rounded-full hover:opacity-80 transition-all shadow-xl shadow-black/10"
            >
              Làm mới bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Grid Sản phẩm - Gap lớn để hiển thị rõ Shadow của Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {currentItems.map((dress) => (
                <DressCard key={dress.id} dress={dress} />
              ))}
            </div>

            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-24 gap-8">
                <div className="flex items-center gap-6">
                  {/* Nút Trước */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl border border-neutral-200 text-neutral-400 hover:border-black hover:text-black hover:bg-neutral-50 transition-all disabled:opacity-10 disabled:cursor-not-allowed shadow-sm"
                  >
                    ←
                  </button>

                  {/* Danh sách số trang */}
                  <div className="flex gap-3">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 rounded-2xl font-cormorant text-lg transition-all duration-300 ${
                          currentPage === i + 1
                            ? "bg-black text-white shadow-xl shadow-black/20"
                            : "text-neutral-400 hover:text-black hover:bg-neutral-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Nút Sau */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl border border-neutral-200 text-neutral-400 hover:border-black hover:text-black hover:bg-neutral-50 transition-all disabled:opacity-10 disabled:cursor-not-allowed shadow-sm"
                  >
                    →
                  </button>
                </div>

                <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-300 font-bold">
                  Trang {currentPage} trên {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
