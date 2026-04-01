"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { ArrowRight } from "lucide-react";

interface Dress {
  id: number;
  name: string;
  price: number;
  mainImage: string;
}

export default function FeaturedDresses() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  useEffect(() => {
    const loadDresses = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<any>(
          `/dresses/featured?page=${currentPage}&limit=${itemsPerPage}`,
        );

        if (Array.isArray(data)) {
          setDresses(data);
          setTotalPages(Math.ceil(data.length / itemsPerPage) || 1);
        } else {
          setDresses(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi tải váy nổi bật:", error);
        setDresses([]);
      } finally {
        setLoading(false);
      }
    };

    loadDresses();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
        {dresses.map((dress) => (
          <div
            key={dress.id}
            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 border border-neutral-100/50"
          >
            {/* Image Section - Không chuyển ảnh, chỉ giữ lại mainImage */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={dress.mainImage || "/placeholder.jpg"}
                alt={dress.name}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Lớp phủ nhẹ khi hover để tăng tính thẩm mỹ */}
              <div className="absolute inset-0 bg-black/[0.02] group-hover:bg-transparent transition-colors duration-500"></div>
            </div>

            {/* Info Section */}
            <div className="p-7 flex items-center justify-between gap-4">
              {/* Left Side: Name & Price */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-neutral-800 text-lg truncate mb-1.5 tracking-tight">
                  {dress.name}
                </h3>
                <p className="text-rose-500 font-bold text-[15px] flex items-baseline gap-1">
                  {Number(dress.price).toLocaleString("vi-VN")}
                  <span className="text-[10px] uppercase tracking-tighter">
                    VNĐ
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    / NGÀY
                  </span>
                </p>
              </div>

              {/* Right Side: Link duy nhất click được */}
              <Link
                href={`/dresses/${dress.id}`}
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 text-white hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-rose-200 group/btn shrink-0"
              >
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-20 gap-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-200 text-neutral-400 hover:border-black hover:text-black transition-all disabled:opacity-20"
          >
            ←
          </button>

          <span className="text-xs font-bold tracking-[0.2em] text-neutral-400">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-200 text-neutral-400 hover:border-black hover:text-black transition-all disabled:opacity-20"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
