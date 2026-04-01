"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Component chứa logic chính
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");

  const isInvalidEmail = (val: string) => {
    if (!val) return false;
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  useEffect(() => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "" }));
      return;
    }
    const timer = setTimeout(() => {
      if (isInvalidEmail(email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email không đúng định dạng (VD: example@gmail.com)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "" }));
      return;
    }
    const timer = setTimeout(() => {
      if (password.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Mật khẩu tối thiểu 6 ký tự",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [password]);

  const handleLogin = async () => {
    setServerError("");
    if (!email || !password) {
      setServerError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (errors.email || errors.password) {
      setServerError("Vui lòng sửa các lỗi nhập liệu phía trên");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error: any) {
      setServerError(error.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl shadow-black/5 p-6 sm:p-10 border border-neutral-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          ĐĂNG NHẬP
        </h1>
        <p className="text-neutral-500 mt-2 text-sm">
          Đăng nhập để tiếp tục khám phá
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm animate-in fade-in zoom-in duration-300">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="group">
          <label className="text-[11px] font-bold text-neutral-400 ml-1 mb-1.5 block uppercase tracking-widest">
            Email
          </label>
          <div
            className={`relative flex items-center border-2 rounded-2xl transition-all duration-300 px-4 ${errors.email ? "border-red-500 bg-red-50/30" : "border-neutral-100 bg-neutral-50 focus-within:border-black focus-within:bg-white"}`}
          >
            <Mail
              className={`w-5 h-5 flex-shrink-0 ${errors.email ? "text-red-500" : "text-neutral-400"}`}
            />
            <input
              type="email"
              placeholder="Địa chỉ email"
              className="w-full py-4 pl-3 bg-transparent outline-none text-base sm:text-[16px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-[12px] text-red-500 mt-2 ml-2 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>

        <div className="group">
          <div className="flex justify-between items-end ml-1 mb-1.5">
            <label className="text-[11px] font-bold text-neutral-400 block uppercase tracking-widest">
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[11px] font-bold text-neutral-400 hover:text-black transition uppercase tracking-widest"
            >
              Quên?
            </button>
          </div>
          <div
            className={`relative flex items-center border-2 rounded-2xl transition-all duration-300 px-4 ${errors.password ? "border-red-500 bg-red-50/30" : "border-neutral-100 bg-neutral-50 focus-within:border-black focus-within:bg-white"}`}
          >
            <Lock
              className={`w-5 h-5 flex-shrink-0 ${errors.password ? "text-red-500" : "text-neutral-400"}`}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full py-4 pl-3 bg-transparent outline-none text-base sm:text-[16px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              type="button"
              className="ml-2 text-neutral-400 hover:text-black transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
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

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang đăng nhập...</span>
            </div>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </div>

      <div className="my-10 flex items-center gap-3 text-neutral-200">
        <div className="flex-1 h-px bg-neutral-100"></div>
        <span className="text-[10px] font-bold text-neutral-400 tracking-[0.2em]">
          HOẶC
        </span>
        <div className="flex-1 h-px bg-neutral-100"></div>
      </div>

      <p className="text-center text-sm text-neutral-500 font-medium">
        Chưa có tài khoản?{" "}
        <a
          href="/register"
          className="text-black font-bold hover:underline underline-offset-4"
        >
          Tạo tài khoản mới
        </a>
      </p>
    </div>
  );
}

// Export chính được bọc trong Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-10">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
