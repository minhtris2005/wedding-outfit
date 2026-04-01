"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function PasswordTab() {
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
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 1. Logic check validation sau 2s (chỉ check độ dài và khớp)
  useEffect(() => {
    if (!passwordForm.newPassword && !passwordForm.confirmPassword) {
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
    }, 300); // Check sau 2 giây như bạn muốn

    return () => clearTimeout(timer);
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  // 2. Logic nhấn LƯU
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Kiểm tra trùng mật khẩu cũ TRƯỚC khi gửi API
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setStatusMsg({
        type: "error",
        text: "Mật khẩu mới không được trùng với mật khẩu cũ",
      });
      return;
    }

    if (Object.keys(errors).length > 0 || !passwordForm.currentPassword) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          credentials: "include", // QUAN TRỌNG: Để trình duyệt tự gửi Cookie chứa Token
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // Nếu Backend trả về 401 Unauthorized -> Token sai/hết hạn
        // Nếu Backend trả về 400 -> Mật khẩu cũ sai (logic ở BE)
        throw new Error(data.message || "Không thể cập nhật mật khẩu");
      }

      setStatusMsg({ type: "success", text: "Cập nhật mật khẩu thành công!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Hiện msg rõ ràng: "Mật khẩu hiện tại không đúng" hoặc "Phiên đăng nhập hết hạn"
      setStatusMsg({
        type: "error",
        text:
          error.message === "Unauthorized"
            ? "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
            : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const ToggleEye = ({ field }: { field: keyof typeof show }) => (
    <button
      type="button"
      onClick={() => setShow({ ...show, [field]: !show[field] })}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
    >
      {show[field] ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-bold uppercase tracking-tight">
          Đổi mật khẩu
        </h3>
        <p className="text-neutral-500 text-sm">
          Vui lòng không chia sẻ mật khẩu với người khác.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-rose-50 border-rose-100 text-rose-700"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-[11px] font-bold uppercase">
            {statusMsg.text}
          </span>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 ml-1">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              required
              className="w-full pl-5 pr-12 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />
            <ToggleEye field="current" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 ml-1">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              required
              className={`w-full pl-5 pr-12 py-4 bg-neutral-50 border rounded-2xl outline-none transition-all text-sm ${errors.newPassword ? "border-rose-300" : "focus:border-black focus:bg-white"}`}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />
            <ToggleEye field="new" />
          </div>
          {errors.newPassword && (
            <p className="text-[10px] text-rose-500 ml-1 italic">
              {errors.newPassword}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 ml-1">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              required
              className={`w-full pl-5 pr-12 py-4 bg-neutral-50 border rounded-2xl outline-none transition-all text-sm ${errors.confirmPassword ? "border-rose-300" : "focus:border-black focus:bg-white"}`}
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
            <ToggleEye field="confirm" />
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] text-rose-500 ml-1 italic">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all disabled:opacity-20 shadow-xl shadow-black/5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "CẬP NHẬT MẬT KHẨU"
          )}
        </button>
      </form>
    </div>
  );
}
