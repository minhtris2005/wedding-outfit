"use client";

import { useState } from "react";
import {
  User,
  Lock,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import PasswordTab from "@/components/profile/PasswordTab"; // Import component vừa tạo

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info"); // info hoặc password

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full md:w-72 space-y-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center gap-4 mb-8 p-2">
              <div>
                <h2 className="font-bold text-neutral-900 leading-none">
                  {user?.email}
                </h2>
                <p className="text-[11px] text-neutral-400 uppercase tracking-tighter mt-1 italic">
                  Thành viên
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === "info" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-50"}`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Thông tin
                </span>
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === "password" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-50"}`}
              >
                <Lock className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Mật khẩu
                </span>
              </button>

              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 mt-4 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Đăng xuất
                </span>
              </button>
            </nav>
          </div>
        </aside>

        {/* CONTENT CHÍNH */}
        <main className="flex-1 bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-neutral-100">
          {activeTab === "info" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-neutral-900 uppercase tracking-tight">
                  Thông tin tài khoản
                </h3>
                <p className="text-neutral-500 text-sm mt-1">
                  Quản lý thông tin cá nhân của bạn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
                    Vai trò
                  </label>
                  <div className="p-4 bg-neutral-50 rounded-2xl border-2 border-neutral-100 font-medium">
                    {user?.role}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <div className="p-4 bg-neutral-50 rounded-2xl border-2 border-neutral-100 font-medium">
                    {user?.email}
                  </div>
                </div>
                {/* Bạn có thể thêm SĐT hoặc địa chỉ tại đây */}
              </div>
            </div>
          ) : (
            <PasswordTab /> /* Gọi component đổi mật khẩu ở đây */
          )}
        </main>
      </div>
    </div>
  );
}
