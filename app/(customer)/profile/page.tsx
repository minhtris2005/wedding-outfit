"use client";

import { useState, useEffect, Suspense } from "react"; // Thêm Suspense
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const ErrorMessage = ({ text }: { text?: string }) => {
  if (!text) return null;
  return (
    <p className="text-[10px] text-rose-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 font-medium tracking-wide">
      ✕ {text}
    </p>
  );
};

// Tách nội dung Profile ra một component con
function ProfileContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "password") setActiveTab("password");
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (
      !passwordForm.currentPassword &&
      !passwordForm.newPassword &&
      !passwordForm.confirmPassword
    ) {
      setErrors({});
      return;
    }

    const timer = setTimeout(() => {
      const newErrors: { [key: string]: string } = {};
      if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (
        passwordForm.confirmPassword &&
        passwordForm.newPassword !== passwordForm.confirmPassword
      ) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
      setErrors(newErrors);
    }, 300);

    return () => clearTimeout(timer);
  }, [passwordForm]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setStatusMsg({ type: "error", text: "Vui lòng điền đầy đủ các trường" });
      return;
    }
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Mật khẩu hiện tại không đúng");

      setStatusMsg({ type: "success", text: "Cập nhật mật khẩu thành công!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error: any) {
      setStatusMsg({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({
    visible,
    toggle,
  }: {
    visible: boolean;
    toggle: () => void;
  }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
    >
      {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/20 to-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="font-cormorant text-5xl md:text-6xl font-light uppercase tracking-tight text-neutral-900">
            Hồ sơ của tôi
          </h1>
        </div>

        <div className="flex gap-8 mb-10 border-b border-neutral-100">
          {["info", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setStatusMsg(null);
              }}
              className={`pb-4 text-[10px] uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab
                  ? "text-black font-bold"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab === "info" ? "Thông tin cá nhân" : "Bảo mật & Mật khẩu"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in" />
              )}
            </button>
          ))}
        </div>

        {statusMsg && (
          <div
            className={`mb-8 p-4 rounded-xl text-[11px] flex items-center gap-3 animate-in fade-in zoom-in-95 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            <span>{statusMsg.type === "success" ? "✓" : "✕"}</span>
            {statusMsg.text}
          </div>
        )}

        {activeTab === "info" ? (
          <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="p-10 flex flex-col md:flex-row gap-10 items-start">
              <div className="w-24 h-24 rounded-2xl bg-neutral-900 flex items-center justify-center text-3xl text-white shadow-xl">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400">
                      Địa chỉ Email
                    </label>
                    <p className="text-sm font-medium text-neutral-800">
                      {user?.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400">
                      Vai trò
                    </label>
                    <p className="text-sm font-medium text-neutral-800">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-neutral-50">
                  <Link
                    href="/"
                    className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                  >
                    ← Quay lại cửa hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md animate-in fade-in duration-500">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Mật khẩu tạm thời (vừa nhận)
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="w-full pl-5 pr-12 py-4 bg-white border border-neutral-200 rounded-2xl outline-none text-sm focus:border-black transition-all"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                  <EyeIcon
                    visible={showCurrent}
                    toggle={() => setShowCurrent(!showCurrent)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    className={`w-full pl-5 pr-12 py-4 bg-white border rounded-2xl outline-none text-sm transition-all ${errors.newPassword ? "border-rose-200 bg-rose-50/20" : "focus:border-black"}`}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <EyeIcon
                    visible={showNew}
                    toggle={() => setShowNew(!showNew)}
                  />
                </div>
                <ErrorMessage text={errors.newPassword} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Xác nhận lại
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className={`w-full pl-5 pr-12 py-4 bg-white border rounded-2xl outline-none text-sm transition-all ${errors.confirmPassword ? "border-rose-200 bg-rose-50/20" : "focus:border-black"}`}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <EyeIcon
                    visible={showConfirm}
                    toggle={() => setShowConfirm(!showConfirm)}
                  />
                </div>
                <ErrorMessage text={errors.confirmPassword} />
              </div>

              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="w-full bg-black text-white py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all disabled:opacity-20 shadow-xl"
              >
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Export chính bọc trong Suspense và ProtectedRoute
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-neutral-400">
            Đang tải...
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </ProtectedRoute>
  );
}
