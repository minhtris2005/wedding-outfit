// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // app/profile/page.tsx (phần handlePasswordChange)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    setLoading(true);
    try {
      // Dùng fetch trực tiếp, không qua apiFetch
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          credentials: "include", // Vẫn gửi cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // Xử lý lỗi từ server
        if (res.status === 401) {
          throw new Error("Mật khẩu hiện tại không đúng");
        }
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      // Thành công
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <div className="inline-block mb-4">
              <span className="text-[10px] tracking-[0.5em] uppercase text-rose-400 bg-rose-50 px-4 py-2 rounded-full">
                My Profile
              </span>
            </div>
            <h1 className="font-cormorant text-5xl md:text-6xl font-light uppercase tracking-[0.1em] text-neutral-900">
              Thông tin cá nhân
            </h1>
            <div className="w-24 h-[2px] bg-rose-200 mt-6 mx-auto md:mx-0" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-4 px-1 text-xs uppercase tracking-widest transition-all ${
                activeTab === "info"
                  ? "text-rose-600 border-b-2 border-rose-600 font-medium"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              👤 Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`pb-4 px-1 text-xs uppercase tracking-widest transition-all ${
                activeTab === "password"
                  ? "text-rose-600 border-b-2 border-rose-600 font-medium"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              🔒 Đổi mật khẩu
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-rose-50 text-rose-600 border border-rose-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "info" ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              {/* Avatar Section */}
              <div className="bg-gradient-to-r from-rose-50 to-transparent p-8 border-b border-neutral-100">
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-4xl border-4 border-white shadow-lg">
                    {user?.email?.[0].toUpperCase() || "👤"}
                  </div>
                  <div>
                    <h2 className="font-cormorant text-2xl text-neutral-900">
                      {user?.email?.split("@")[0] || "User"}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Tham gia từ: {new Date().toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2 block">
                        Email
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          📧
                        </div>
                        <p className="text-sm font-medium text-neutral-800">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2 block">
                        Vai trò
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          👑
                        </div>
                        <p>
                          <span
                            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium ${
                              user?.role === "admin"
                                ? "bg-black text-white"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {user?.role === "admin"
                              ? "Quản trị viên"
                              : "Khách hàng"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2 block">
                        ID người dùng
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg">
                          🆔
                        </div>
                        <p className="text-sm font-mono text-neutral-500">
                          {user?.id}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2 block">
                        Trạng thái
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          Đang hoạt động
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-neutral-100 flex gap-4">
                  <Link
                    href={user?.role === "admin" ? "/admin" : "/"}
                    className="text-[10px] uppercase tracking-widest px-6 py-3 bg-black text-white rounded-lg hover:bg-rose-600 transition-all"
                  >
                    {user?.role === "admin"
                      ? "← Về Dashboard"
                      : "← Về Trang chủ"}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Form đổi mật khẩu */
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-100 p-8">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2 block">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      🔒
                    </span>
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-rose-300 outline-none transition-all text-sm"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2 block">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      🔐
                    </span>
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-rose-300 outline-none transition-all text-sm"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2 block">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      ✅
                    </span>
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-rose-300 outline-none transition-all text-sm"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ĐANG XỬ LÝ...
                      </>
                    ) : (
                      "CẬP NHẬT MẬT KHẨU"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
