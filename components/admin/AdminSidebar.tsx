"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Trang chủ", href: "/", icon: "🏠" },
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Quản lý sản phẩm", href: "/admin/dresses", icon: "👗" },
  { name: "Đơn thuê", href: "/admin/rentals", icon: "📦" },
  { name: "Lịch thử", href: "/admin/fittings", icon: "📅" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-rose-600 tracking-tight">
          Váy Cưới Admin
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-black transition-colors text-sm"
        >
          ↩ Quay lại trang chủ
        </Link>
      </div>
    </aside>
  );
}
