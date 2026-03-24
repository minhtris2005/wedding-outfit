// components/common/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Không làm gì khi đang loading
    if (loading) return;

    // Kiểm tra quyền
    let authorized = false;

    if (!user) {
      console.log("🔒 Chưa đăng nhập, redirect to login");
      router.push("/login");
    } else if (requiredRole && user.role !== requiredRole) {
      console.log(
        `🔒 User role ${user.role} không được phép (cần ${requiredRole})`,
      );
      router.push("/");
    } else {
      authorized = true;
    }

    setIsAuthorized(authorized);

    // Thêm delay nhỏ để tránh flash UI
    if (authorized) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router, requiredRole]);

  // Đang loading auth
  if (loading) {
    return <LoadingSpinner message="Đang xác thực..." />;
  }

  // Chưa authorized (sẽ redirect)
  if (!isAuthorized) {
    return <LoadingSpinner message="Đang chuyển hướng..." />;
  }

  // Đã authorized nhưng chưa show content (delay nhỏ)
  if (!showContent) {
    return <LoadingSpinner message="Đang tải giao diện..." />;
  }

  // Hiển thị nội dung
  return <>{children}</>;
}
