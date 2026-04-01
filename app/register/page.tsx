"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  AlertCircle,
  XCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // State chứa dữ liệu form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State chứa lỗi của từng trường
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // State ẩn/hiện mật khẩu
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const isInvalidEmail = (email: string) => {
    if (!email) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // --- LOGIC BAT LOI SAU 2S ---

  // 1. Kiểm tra Email
  useEffect(() => {
    if (!formData.email) return;
    const timer = setTimeout(() => {
      if (isInvalidEmail(formData.email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email không đúng định dạng(VD: example@gmail.com)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.email]);

  // 2. Kiểm tra Mật khẩu chính
  useEffect(() => {
    if (!formData.password) return;
    const timer = setTimeout(() => {
      if (formData.password.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Mật khẩu phải từ 6 ký tự trở lên",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.password]);

  // 3. Kiểm tra Nhập lại mật khẩu (So khớp)
  useEffect(() => {
    if (!formData.confirmPassword) return;
    const timer = setTimeout(() => {
      if (formData.confirmPassword !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Mật khẩu nhập lại không khớp",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.confirmPassword, formData.password]);

  const handleRegister = async () => {
    setServerError("");
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      Object.values(errors).some((x) => x !== "")
    ) {
      setServerError("Vui lòng kiểm tra lại thông tin đăng ký");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Đăng ký thất bại");
        return;
      }
      router.push("/login");
    } catch (error) {
      setServerError("Không thể kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl shadow-black/5 p-6 sm:p-10 border border-neutral-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight text-uppercase">
            ĐĂNG KÝ
          </h1>
          <p className="text-neutral-500 mt-2 text-sm">
            Bắt đầu trải nghiệm tuyệt vời ngay!
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm animate-in fade-in">
            <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div className="group">
            <div
              className={`relative flex items-center border-2 rounded-2xl transition-all duration-300 px-4 ${errors.email ? "border-red-500 bg-red-50/30" : "border-neutral-100 bg-neutral-50 focus-within:border-black focus-within:bg-white"}`}
            >
              <Mail
                className={`w-5 h-5 ${errors.email ? "text-red-500" : "text-neutral-400"}`}
              />
              <input
                type="email"
                placeholder="Địa chỉ Email"
                className="w-full py-4 pl-3 bg-transparent outline-none text-base sm:text-[16px]"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <p className="text-[12px] text-red-500 mt-2 ml-2 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="group">
            <div
              className={`relative flex items-center border-2 rounded-2xl transition-all duration-300 px-4 ${errors.password ? "border-red-500 bg-red-50/30" : "border-neutral-100 bg-neutral-50 focus-within:border-black focus-within:bg-white"}`}
            >
              <Lock
                className={`w-5 h-5 ${errors.password ? "text-red-500" : "text-neutral-400"}`}
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full py-4 pl-3 bg-transparent outline-none text-base sm:text-[16px]"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-neutral-400 hover:text-black transition-colors"
              >
                {showPass ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[12px] text-red-500 mt-2 ml-2 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="group">
            <div
              className={`relative flex items-center border-2 rounded-2xl transition-all duration-300 px-4 ${errors.confirmPassword ? "border-red-500 bg-red-50/30" : "border-neutral-100 bg-neutral-50 focus-within:border-black focus-within:bg-white"}`}
            >
              <Lock
                className={`w-5 h-5 ${errors.confirmPassword ? "text-red-500" : "text-neutral-400"}`}
              />
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                className="w-full py-4 pl-3 bg-transparent outline-none text-base sm:text-[16px]"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="text-neutral-400 hover:text-black transition-colors"
              >
                {showConfirmPass ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[12px] text-red-500 mt-2 ml-2 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
              </p>
            )}
            {!errors.confirmPassword &&
              formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <p className="text-[12px] text-green-600 mt-2 ml-2 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mật khẩu đã khớp
                </p>
              )}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </div>
            ) : (
              "Đăng ký ngay"
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500 font-medium">
          Bạn đã là thành viên?{" "}
          <a
            href="/login"
            className="text-black font-bold hover:underline underline-offset-4"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
