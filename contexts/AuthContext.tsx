"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ==================== REFRESH TOKEN ====================
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include", // Gửi cookie chứa refresh token
        },
      );

      if (res.ok) {
        console.log("✅ Token refreshed");
        return true;
      } else {
        console.log("❌ Refresh failed - refresh token expired");
        return false;
      }
    } catch (error) {
      console.error("Refresh error:", error);
      return false;
    }
  }, []);

  // ==================== FETCH USER ====================
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          credentials: "include",
        },
      );

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else if (res.status === 401) {
        // Token expired - thử refresh
        console.log("🔴 Token expired, trying to refresh...");
        const refreshed = await refreshToken();

        if (refreshed) {
          // Refresh thành công - thử lại fetch user
          const retryRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
            {
              credentials: "include",
            },
          );
          if (retryRes.ok) {
            const userData = await retryRes.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          // Refresh thất bại - logout
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  // ==================== AUTO REFRESH ====================
  useEffect(() => {
    if (!user) return;

    // Refresh token mỗi 13 phút (trước khi hết hạn 2 phút)
    const interval = setInterval(
      async () => {
        console.log("🔄 Auto refreshing token...");
        const success = await refreshToken();

        if (!success) {
          // Refresh thất bại (refresh token hết hạn) -> logout
          console.log("❌ Auto refresh failed, logging out...");
          await logout();
        }
      },
      13 * 60 * 1000,
    ); // 13 phút

    return () => clearInterval(interval);
  }, [user]);

  // ==================== LOGIN ====================
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      await fetchUser();
      router.push(data.user?.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // ==================== INIT ====================
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
