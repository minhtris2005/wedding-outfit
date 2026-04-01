"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setEmailError(null);
      return;
    }

    const timer = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Định dạng email không hợp lệ");
      } else {
        setEmailError(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Email không tồn tại trong hệ thống");

      setSubmitted(true);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-rose-50/20 to-white px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-neutral-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black mb-8 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Quay lại đăng nhập
        </Link>

        {!submitted ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-cormorant text-4xl font-light uppercase tracking-tight text-neutral-900 mb-2">
              Quên mật khẩu
            </h1>
            <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
              Nhập email của bạn để nhận mật khẩu mới ngẫu nhiên.
            </p>

            {apiError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[11px] animate-in zoom-in-95">
                <AlertCircle className="w-4 h-4" /> {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2 block ml-1">
                  Email tài khoản
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    className={`w-full pl-12 pr-4 py-4 bg-neutral-50 border rounded-2xl outline-none transition-all text-sm ${
                      emailError
                        ? "border-rose-300 bg-rose-50/50"
                        : "border-neutral-200 focus:border-black focus:bg-white"
                    }`}
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-[10px] text-rose-500 mt-2 ml-1 animate-pulse">
                    ✕ {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !!emailError}
                className="w-full py-5 rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all disabled:opacity-20 flex items-center justify-center gap-3 shadow-lg"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Đang xử lý..." : "Gửi mật khẩu mới"}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="font-cormorant text-3xl font-light text-neutral-900 mb-4">
              Kiểm tra email
            </h2>
            <p className="text-xs text-neutral-500 mb-8 px-4 leading-relaxed">
              Mật khẩu mới đã được gửi tới{" "}
              <b className="text-neutral-800">{email}</b>. Vui lòng đăng nhập và
              đổi mật khẩu ngay.
            </p>
            <Link
              href={`/login?redirect=${encodeURIComponent("/profile?tab=password")}`}
              className="block w-full py-4 rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-lg"
            >
              Đăng nhập & Đổi mật khẩu ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
