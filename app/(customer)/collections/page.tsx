// app/collections/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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

  useEffect(() => {
    loadDresses();
  }, []);

  const loadDresses = async () => {
    setLoading(true);
    try {
      // Dùng apiFetch thay vì fetch thường
      const data = await apiFetch<any>("/dresses");

      // Xử lý response (có thể là array hoặc object có field data)
      const dressList = Array.isArray(data) ? data : data.data || [];
      setDresses(dressList);

      // Delay nhỏ để transition mượt
      setTimeout(() => setPageReady(true), 300);
    } catch (error: any) {
      console.error("Lỗi tải danh sách váy:", error);

      // Xử lý lỗi 401 - Unauthorized
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

  // Lọc dữ liệu
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

  // Phân trang
  const totalPages = Math.ceil(filteredDresses.length / itemsPerPage);
  const currentItems = filteredDresses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSize, selectedColor]);

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
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-4">
            Bridal Collection
          </p>
          <h1 className="font-cormorant text-5xl font-light uppercase">
            Bộ Sưu Tập
          </h1>
          <div className="w-16 h-px bg-black mx-auto mt-6"></div>

          {/* Hiển thị email nếu đã đăng nhập */}
          {user && (
            <p className="text-xs text-neutral-400 mt-4">
              Xin chào, {user.email}
            </p>
          )}
        </div>

        <FilterBar
          onSearch={setSearchTerm}
          onSizeChange={setSelectedSize}
          onColorChange={setSelectedColor}
        />

        {/* Hiển thị số lượng kết quả */}
        <div className="mb-8 text-xs text-neutral-400 uppercase tracking-wider">
          Tìm thấy {filteredDresses.length} sản phẩm
          {searchTerm && ` cho "${searchTerm}"`}
        </div>

        {filteredDresses.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-cormorant text-2xl italic text-neutral-400 mb-4">
              Không tìm thấy sản phẩm phù hợp
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSize("");
                setSelectedColor("");
              }}
              className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-all"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {currentItems.map((dress) => (
                <DressCard key={dress.id} dress={dress} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-20 gap-6">
                <div className="flex items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] border border-black hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black"
                  >
                    ← Trước
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 font-cormorant text-sm transition-all ${
                          currentPage === i + 1
                            ? "bg-black text-white"
                            : "text-neutral-400 hover:text-black hover:border hover:border-black"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 text-[10px] uppercase tracking-[0.3em] border border-black hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black"
                  >
                    Sau →
                  </button>
                </div>

                <p className="text-xs text-neutral-400">
                  Trang {currentPage} / {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
