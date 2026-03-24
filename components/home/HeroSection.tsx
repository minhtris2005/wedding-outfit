// components/home/HeroSection.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat "
        style={{ 
          backgroundImage: 'url("/hero-bg.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-6">
        <p className="text-xs tracking-[0.5em] uppercase mb-6 animate-fade-in">
          Luxury Wedding Collection 2026
        </p>
        <h1 className="font-cormorant text-5xl md:text-8xl font-light mb-8 leading-tight">
          Vẻ Đẹp Vĩnh Cửu
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link 
            href="http://localhost:3001/collections"
            className="px-10 py-4 bg-white text-black text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500"
          >
            Xem bộ sưu tập
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="w-px h-20 bg-gradient-to-b from-white to-transparent mx-auto"></div>
      </div>
    </section>
  );
}