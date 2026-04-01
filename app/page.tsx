// app/page.tsx
import { Suspense } from "react";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/HeroSection";
import RentalProcess from "@/components/home/RentalProcess";
import FeaturedDresses from "@/components/home/FeaturedDresses";
import LatestDresses from "@/components/home/LatestDresses";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white overflow-x-hidden">
      <main className="grow w-full">
        {/* 1. Hero Section */}
        <div className="w-full">
          <HeroSection />
        </div>

        {/* 2. Process Section */}
        <section className="py-24 w-full bg-white border-b border-neutral-100">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="text-center mb-20">
              <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-4 font-medium">
                Quy trình
              </p>
              <h2 className="font-cormorant text-4xl md:text-5xl font-light text-black pb-8 italic">
                Hành Trình Của Bạn
              </h2>
            </div>
            <RentalProcess />
          </div>
        </section>

        {/* 3. Featured Collection - với Suspense */}
        <section className="py-24 w-full bg-neutral-50">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 border-b border-neutral-200 pb-8">
              <div>
                <p className="text-[15px] tracking-[0.5em] uppercase text-neutral-400 mb-4 font-medium">
                  Bộ sưu tập
                </p>
                <h2 className="font-cormorant text-4xl md:text-6xl font-light text-black uppercase tracking-tight">
                  Váy Cưới Nổi Bật
                </h2>
              </div>
              <a
                href="/collections"
                className="text-xs tracking-[0.3em] uppercase border-b border-black pb-2 opacity-50 hover:opacity-100 transition-all font-medium"
              >
                Khám phá tất cả
              </a>
            </div>

            <Suspense
              fallback={
                <LoadingSpinner
                  fullScreen={false}
                  message="Đang tải bộ sưu tập..."
                />
              }
            >
              <FeaturedDresses />
            </Suspense>
          </div>
        </section>

        {/* 4. Latest Arrivals - với Suspense */}
        <section className="py-24 w-full bg-white">
          <div className="w-full px-6 md:px-12 lg:px-20">
            <div className="text-center mb-20">
              <p className="text-[15px] tracking-[0.5em] uppercase text-neutral-400 mb-4">
                Cập nhật mới
              </p>
              <h2 className="font-cormorant text-4xl md:text-5xl font-light text-black uppercase">
                Thiết Kế 2026
              </h2>
              <div className="w-12 h-[2px] bg-neutral-200 mx-auto mt-6"></div>
            </div>

            <Suspense
              fallback={
                <LoadingSpinner
                  fullScreen={false}
                  message="Đang tải sản phẩm mới..."
                />
              }
            >
              <LatestDresses />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
