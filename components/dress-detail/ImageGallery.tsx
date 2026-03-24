"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images, name }: { images: string[], name: string }) {
  const [mainImg, setMainImg] = useState(images[0]);

  return (
    <div className="lg:col-span-7 space-y-6">
      {/* ẢNH CHÍNH */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 shadow-sm">
        <Image
          src={mainImg || "/placeholder.jpg"}
          alt={name}
          fill
          priority
          quality={100}
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          className="object-cover transition-all duration-700 ease-in-out hover:scale-105"
        />
      </div>

      {/* DANH SÁCH ẢNH PHỤ */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, index) => (
          <button 
            key={index} 
            onClick={() => setMainImg(img)}
            className={`relative aspect-[3/4] overflow-hidden transition-all duration-300 border-b-2 ${
              mainImg === img ? "border-black opacity-100" : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            <Image
              src={img || "/placeholder.jpg"}
              alt={`${name} detail ${index}`}
              fill
              priority
              quality={100}
              unoptimized 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}