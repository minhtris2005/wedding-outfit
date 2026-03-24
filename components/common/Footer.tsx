// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-serif mb-6 uppercase tracking-widest">Bridal Studio</h3>
          <p className="text-gray-400">Nâng tầm vẻ đẹp của bạn trong từng khoảnh khắc hạnh phúc nhất đời người.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-6 uppercase">Liên hệ</h4>
          <ul className="space-y-3 text-gray-400">
            <li>Địa chỉ: 123 Đường ABC, Quận 1, TP. HCM</li>
            <li>Hotline: 0123 456 789</li>
            <li>Email: contact@bridalstudio.vn</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-6 uppercase">Giờ làm việc</h4>
          <p className="text-gray-400">Thứ 2 - Chủ Nhật: 09:00 - 21:00</p>
        </div>
      </div>
      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
        © 2026 Bridal Studio. All rights reserved.
      </div>
    </footer>
  );
}