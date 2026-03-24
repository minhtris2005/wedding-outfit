// app/LayoutContent.tsx
"use client"; // ĐẶT Ở ĐẦU FILE NÀY

import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAdminPage && !isAuthPage && <Header />}
      <main className="w-full min-h-screen">{children}</main>
    </>
  );
}
