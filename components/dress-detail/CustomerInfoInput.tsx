// components/Booking/CustomerInfoInput.tsx
interface Props {
  name: string;
  phone: string;
  setName: (val: string) => void;
  setPhone: (val: string) => void;
}

export default function CustomerInfoInput({ name, phone, setName, setPhone }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="group relative">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1 block">Tên của bạn</label>
        <input
          type="text"
          className="w-full bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-black transition-all text-sm font-light tracking-wide placeholder:text-neutral-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="NGUYỄN VĂN A"
        />
      </div>
      <div className="group relative">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1 block">Số điện thoại</label>
        <input
          type="tel"
          className="w-full bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-black transition-all text-sm font-light tracking-wide placeholder:text-neutral-200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="0912 XXX XXX"
        />
      </div>
    </div>
  );
}