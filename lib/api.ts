const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
//hello
let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const fetchWithRetry = async (): Promise<T> => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Nếu token hết hạn
    if (res.status === 401) {
      if (isRefreshing) {
        // Đang refresh - xếp hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(fetchWithRetry()),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // Gọi refresh token
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        // Refresh thành công - xử lý queue và retry request gốc
        processQueue();
        isRefreshing = false;
        return await fetchWithRetry();
      } catch (error) {
        // Refresh thất bại - reject tất cả queue và redirect login
        processQueue(error);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Session expired - please login again");
      }
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({
        message: "Something went wrong",
      }));
      throw new Error(error.message || "Something went wrong");
    }

    return res.json();
  };

  return fetchWithRetry();
}
