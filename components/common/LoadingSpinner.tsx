// components/common/LoadingSpinner.tsx
export function LoadingSpinner({
  fullScreen = true,
  message = "Đang tải dữ liệu...",
}) {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[400px]"} flex items-center justify-center`}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-200 rounded-full mx-auto"></div>
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto -mt-12"></div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
