// components/home/RentalProcess.tsx
const steps = [
  {
    number: "01",
    title: "Tìm Kiếm & Lựa Chọn",
    description: "Khám phá bộ sưu tập trực tuyến và chọn những thiết kế chạm đến trái tim bạn."
  },
  {
    number: "02",
    title: "Trải Nghiệm Trực Tiếp",
    description: "Đặt lịch hẹn thử váy tại không gian studio sang trọng và nhận tư vấn chuyên sâu."
  },
  {
    number: "03",
    title: "Tinh Chỉnh Hoàn Hảo",
    description: "Chúng tôi điều chỉnh số đo để đảm bảo chiếc váy ôm trọn vóc dáng của bạn."
  },
  {
    number: "04",
    title: "Tỏa Sáng Ngày Chung Đôi",
    description: "Nhận váy đã được chuẩn bị hoàn hảo và sẵn sàng cho khoảnh khắc tuyệt vời nhất."
  }
];

export default function RentalProcess() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {steps.map((step, index) => (
        <div key={index} className="relative group cursor-default">
          <div className="font-cormorant text-6xl text-neutral-100 absolute -top-20 -left-2 z-0 group-hover:text-black transition-colors">
            {step.number}
          </div>
          <div className="relative z-10">
            <h3 className="font-cormorant text-xl font-medium text-black mb-4">
              {step.title}
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed italic">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}