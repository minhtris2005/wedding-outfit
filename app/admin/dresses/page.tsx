"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import DressTable from "@/components/admin/dresses/DressTable";
import DressModal from "@/components/admin/dresses/DressModal";

export interface Dress {
  id: number;
  name: string;
  description: string;
  price: number;
  mainImage: string;
  subImages: string[];
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminDressesPage() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Load danh sách váy
  const loadDresses = useCallback(async () => {
    setLoading(true);
    try {
      // Dùng apiFetch thay vì tự viết fetchWithAuth
      const data = await apiFetch<any>("/dresses");

      // Xử lý response (có thể là array hoặc object có field data)
      const finalData = Array.isArray(data) ? data : data.data || [];
      setDresses(finalData);

      // Delay nhỏ để transition mượt
      setTimeout(() => setPageReady(true), 300);
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách váy:", err);

      // Xử lý lỗi
      if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDresses();
  }, [loadDresses]);

  const handleOpenAdd = () => {
    setSelectedDress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dress: Dress) => {
    setSelectedDress(dress);
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Quản lý váy cưới
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý kho hàng và thông tin sản phẩm trực tuyến
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-rose-700 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="text-xl">+</span> Thêm sản phẩm mới
          </button>
        </div>

        <DressTable
          dresses={dresses}
          onEdit={handleOpenEdit}
          onDelete={loadDresses}
          // Không cần truyền fetchWithAuth nữa, vì DressTable sẽ dùng apiFetch
        />

        <DressModal
          key={
            selectedDress
              ? `edit-${selectedDress.id}`
              : isModalOpen
                ? "add-new"
                : "closed"
          }
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadDresses}
          initialData={selectedDress}
          // Không cần truyền fetchWithAuth nữa
        />
      </div>
    </ProtectedRoute>
  );
}
