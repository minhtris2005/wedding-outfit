// components/Collections/FilterBar.tsx
import { Search } from "lucide-react"; // Cài lucide-react nếu chưa có

export default function FilterBar({
  onSearch,
  onSizeChange,
  onColorChange,
}: any) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between border-b border-neutral-100 pb-8">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="Tìm tên váy..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-black outline-none transition-all text-sm font-light tracking-widest"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      </div>
    </div>
  );
}
