import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar cố định bên trái */}
      <AdminSidebar />

      {/* Nội dung trang bên phải, cách ra 1 khoảng bằng độ rộng sidebar */}
      <main className="flex-1 ml-64 p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}