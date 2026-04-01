"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Dress {
  id: number;
  name: string;
  mainImage: string;
}

export default function LatestDresses() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8; // 2 hàng x 4 cột

  useEffect(() => {
    const loadDresses = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<any>(
          `/dresses/latest?page=${currentPage}&limit=${itemsPerPage}`,
        );

        if (Array.isArray(data)) {
          setDresses(data);
          setTotalPages(Math.ceil(data.length / itemsPerPage) || 1);
        } else {
          setDresses(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi tải váy mới nhất:", error);
        setDresses([]);
      } finally {
        setLoading(false);
      }
    };

    loadDresses();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {dresses.map((dress) => (
          <Link
            key={dress.id}
            href={`/dresses/${dress.id}`}
            className="group block bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 border border-neutral-100 text-center"
          >
            {/* Image Section - Chỉ dùng mainImage, không hover đổi ảnh */}
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* Hiệu ứng flash nhẹ khi hover */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 pointer-events-none"></div>

              <Image
                src={dress.mainImage || "/placeholder.jpg"}
                alt={dress.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            </div>

            {/* Info Section - Giữ nguyên style text căn giữa như ban đầu */}
            <div className="p-6">
              <h4 className="font-cormorant text-lg md:text-xl text-neutral-800 tracking-widest uppercase mb-3 px-2 truncate">
                {dress.name}
              </h4>
              <div className="w-8 h-[1px] bg-neutral-200 mx-auto group-hover:w-16 group-hover:bg-rose-400 transition-all duration-500"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-black hover:bg-black hover:text-white transition-all disabled:opacity-20"
          >
            ←
          </button>

          <span className="text-sm font-medium text-neutral-500">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-black hover:bg-black hover:text-white transition-all disabled:opacity-20"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
