"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData: any;
  // Đã bỏ fetchWithAuth
}

export default function DressModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    mainImage: "",
    subImages: [""],
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);

  // Reset form khi mở modal với initialData mới
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price?.toString() || "",
        mainImage: initialData?.mainImage || "",
        subImages: initialData?.subImages?.length
          ? [...initialData.subImages]
          : [""],
        isFeatured: initialData?.isFeatured || false,
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.name || !form.price || !form.mainImage) {
      return alert("Vui lòng nhập đầy đủ các thông tin bắt buộc!");
    }

    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/dresses/${initialData.id}` : "/dresses";

    try {
      await apiFetch(url, {
        method,
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          subImages: form.subImages.filter((img) => img && img.trim() !== ""),
        }),
      });

      onSave();
      onClose();
      alert(initialData ? "Cập nhật thành công!" : "Thêm mới thành công!");
    } catch (err: any) {
      console.error("Lỗi khi lưu:", err);

      if (err.message?.includes("401")) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      } else {
        alert(err.message || "Có lỗi xảy ra khi lưu dữ liệu!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "✨ Chỉnh sửa sản phẩm" : "➕ Thêm váy cưới mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black p-2 transition-colors"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CỘT TRÁI: THÔNG TIN CHỮ */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-rose-300 outline-none transition-all mt-1"
                placeholder="VD: Váy cưới công chúa"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Mô tả chi tiết
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border-2 border-gray-100 p-3 rounded-xl h-32 focus:border-rose-300 outline-none transition-all mt-1"
                placeholder="Chất liệu vải, kiểu dáng..."
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Giá niêm yết (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-rose-300 outline-none transition-all mt-1"
                placeholder="0"
                disabled={loading}
              />
            </div>

            {/* Ô TÍCH CHỌN NỔI BẬT */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="w-6 h-6 accent-rose-500 rounded-lg cursor-pointer"
                  disabled={loading}
                />
                <span className="font-bold text-gray-700 group-hover:text-rose-500 transition-colors">
                  Đánh dấu sản phẩm NỔI BẬT ⭐
                </span>
              </label>
            </div>
          </div>

          {/* CỘT PHẢI: HÌNH ẢNH VÀ PREVIEW */}
          <div className="space-y-5 bg-gray-50/50 p-5 rounded-2xl border border-dashed border-gray-200">
            {/* ẢNH CHÍNH */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Link ảnh chính <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mt-1">
                <input
                  value={form.mainImage}
                  onChange={(e) =>
                    setForm({ ...form, mainImage: e.target.value })
                  }
                  className="flex-1 border-2 border-gray-100 p-3 rounded-xl focus:border-rose-300 outline-none transition-all"
                  placeholder="Dán link ảnh tại đây..."
                  disabled={loading}
                />
                <div className="w-12 h-12 relative rounded-lg border bg-white overflow-hidden flex-shrink-0 shadow-sm">
                  {form.mainImage ? (
                    <Image
                      src={form.mainImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">
                      No Img
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ẢNH PHỤ */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Bộ sưu tập ảnh phụ
              </label>
              {form.subImages.map((img, i) => (
                <div key={i} className="flex gap-3 mb-3 items-center mt-2">
                  <input
                    value={img}
                    onChange={(e) => {
                      const newImgs = [...form.subImages];
                      newImgs[i] = e.target.value;
                      setForm({ ...form, subImages: newImgs });
                    }}
                    className="flex-1 border-2 border-gray-100 p-2 rounded-lg text-sm focus:border-rose-200 outline-none"
                    placeholder="Link ảnh phụ..."
                    disabled={loading}
                  />
                  <div className="w-10 h-10 relative rounded border bg-white overflow-hidden flex-shrink-0">
                    {img ? (
                      <Image
                        src={img}
                        alt={`Sub ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-200">
                        Empty
                      </div>
                    )}
                  </div>
                  {form.subImages.length > 1 && (
                    <button
                      onClick={() =>
                        setForm({
                          ...form,
                          subImages: form.subImages.filter(
                            (_, idx) => idx !== i,
                          ),
                        })
                      }
                      className="text-red-400 hover:text-red-600 font-bold px-1 transition-colors"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {form.subImages.length < 3 && (
                <button
                  onClick={() =>
                    setForm({ ...form, subImages: [...form.subImages, ""] })
                  }
                  className="text-rose-500 text-xs font-bold bg-rose-50 px-3 py-1 rounded-full hover:bg-rose-100 transition-colors mt-1"
                  disabled={loading}
                >
                  + Thêm ô nhập ảnh
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex gap-4">
          <button
            onClick={handleSave}
            className="flex-2 bg-rose-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "ĐANG XỬ LÝ..." : "LƯU THÔNG TIN SẢN PHẨM"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
            disabled={loading}
          >
            HỦY BỎ
          </button>
        </div>
      </div>
    </div>
  );
}
