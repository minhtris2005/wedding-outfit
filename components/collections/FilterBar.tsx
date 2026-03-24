// components/Collections/FilterBar.tsx
import { Search } from "lucide-react"; // Cài lucide-react nếu chưa có

export default function FilterBar({ onSearch, onSizeChange, onColorChange }: any) {
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

      {/* Selects */}
      <div className="flex gap-4 w-full md:w-auto">
        <select 
          onChange={(e) => onSizeChange(e.target.value)}
          className="flex-1 md:w-40 px-4 py-3 border border-neutral-200 focus:border-black outline-none text-xs uppercase tracking-widest cursor-pointer"
        >
          <option value="">Tất cả Size</option>
          <option value="S">Size S</option>
          <option value="M">Size M</option>
          <option value="L">Size L</option>
        </select>

        <select 
          onChange={(e) => onColorChange(e.target.value)}
          className="flex-1 md:w-40 px-4 py-3 border border-neutral-200 focus:border-black outline-none text-xs uppercase tracking-widest cursor-pointer"
        >
          <option value="">Tất cả Màu</option>
          <option value="Trắng">Trắng Tuyết</option>
          <option value="Kem">Kem Ivory</option>
          <option value="Hồng">Hồng Pastel</option>
        </select>
      </div>
    </div>
  );
}