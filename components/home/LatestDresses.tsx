// components/home/LatestDresses.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Dress {
  id: number;
  name: string;
  price: number;
  mainImage: string;
  subImages: string[];
}

export default function LatestDresses() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const itemsPerPage = 8; // 2 hàng x 4 cột

  useEffect(() => {
    loadDresses();
  }, [currentPage]);

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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {dresses.map((dress) => {
          const isHovered = hoveredId === dress.id;
          const displayImage =
            isHovered && dress.subImages?.[0]
              ? dress.subImages[0]
              : dress.mainImage;

          return (
            <Link
              key={dress.id}
              href={`/dresses/${dress.id}`}
              className="group block text-center"
              onMouseEnter={() => setHoveredId(dress.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-6 rounded-sm">
                {/* Flash effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10 pointer-events-none"></div>

                <Image
                  src={displayImage || "/placeholder.jpg"}
                  alt={dress.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
              </div>
              <h4 className="font-cormorant text-xl text-neutral-800 tracking-widest uppercase mb-2">
                {dress.name}
              </h4>
              <div className="w-8 h-[1px] bg-neutral-300 mx-auto group-hover:w-16 transition-all"></div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-16 gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-xs border border-black hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            ←
          </button>

          <span className="text-sm text-neutral-500">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-xs border border-black hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
