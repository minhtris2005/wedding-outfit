// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API forgot password
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Forgot password failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-neutral-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại đăng nhập
        </Link>

        {!submitted ? (
          <>
            <h1 className="text-2xl font-semibold mb-2">Quên mật khẩu?</h1>
            <p className="text-sm text-neutral-500 mb-8">
              Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi hướng dẫn"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Kiểm tra email của bạn
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến {email}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-black underline underline-offset-4"
            >
              Gửi lại email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
