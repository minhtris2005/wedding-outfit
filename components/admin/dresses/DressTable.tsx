"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dress } from "@/app/admin/dresses/page";
import { apiFetch } from "@/lib/api";

interface Props {
  dresses: Dress[];
  onEdit: (dress: Dress) => void;
  onDelete: () => void;
  // Đã bỏ fetchWithAuth
}

export default function DressTable({ dresses, onEdit, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await apiFetch(`/dresses/${id}`, {
        method: "DELETE",
      });

      onDelete(); // Reload danh sách
      alert("Xóa sản phẩm thành công!");
    } catch (err: any) {
      console.error("Lỗi khi xóa:", err);

      if (err.message?.includes("401")) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      } else {
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold">
          <tr>
            <th className="px-6 py-4">Sản phẩm</th>
            <th className="px-6 py-4">Giá</th>
            <th className="px-6 py-4 text-center">Nổi bật</th>
            <th className="px-6 py-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {dresses.map((dress) => (
            <React.Fragment key={dress.id}>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded border overflow-hidden">
                      <Image
                        src={dress.mainImage || "https://placehold.co/100"}
                        alt={dress.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-800">
                      {dress.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {Number(dress.price).toLocaleString()}đ
                </td>
                <td className="px-6 py-4 text-center">
                  {dress.isFeatured ? "⭐" : ""}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === dress.id ? null : dress.id)
                    }
                    className="text-gray-500 text-sm mr-4 hover:text-gray-700"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => onEdit(dress)}
                    className="text-blue-600 text-sm mr-4 font-bold hover:text-blue-800"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(dress.id)}
                    className="text-red-500 text-sm font-bold hover:text-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              {expandedId === dress.id && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-10 py-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                          Ảnh chính
                        </p>
                        <div className="relative aspect-[3/4] w-48 rounded-lg overflow-hidden border shadow-sm">
                          <Image
                            src={dress.mainImage || "https://placehold.co/400"}
                            alt={dress.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                          Ảnh phụ
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {dress.subImages?.map((img, i) => (
                            <div
                              key={i}
                              className="relative w-20 h-20 rounded border overflow-hidden bg-white"
                            >
                              <Image
                                src={img || "https://placehold.co/100"}
                                alt={`Phụ ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {(!dress.subImages ||
                            dress.subImages.length === 0) && (
                            <p className="text-sm text-gray-400 italic">
                              Không có ảnh phụ
                            </p>
                          )}
                        </div>
                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase mb-1">
                          Mô tả
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          {dress.description || "Chưa có mô tả"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
