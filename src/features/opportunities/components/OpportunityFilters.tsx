"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Filter, MapPin, Clock } from "lucide-react";

const CATEGORIES = ["طبي", "تعليمي", "لوجستي", "دعم نفسي", "تقني", "إغاثي"];
const LOCATIONS = [
  "كل المناطق",
  "شمال غزة ",
  "غزة",
  "دير البلح",
  "خانيونس",
  "رفح",
];

export function OpportunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("كل المناطق");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  useEffect(() => {
    const cats = searchParams.get("category");
    setSelectedCategories(cats ? cats.split(",") : []);

    const loc = searchParams.get("location");
    setSelectedLocation(loc ? loc : "كل المناطق");

    const time = searchParams.get("time_slot");
    setSelectedTimeSlot(time ? time : null);
  }, [searchParams]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0)
      params.set("category", selectedCategories.join(","));
    if (selectedLocation !== "كل المناطق")
      params.set("location", selectedLocation);
    if (selectedTimeSlot) params.set("time_slot", selectedTimeSlot);

    router.push(`/opportunities?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1 justify-end flex-row-reverse">
          <h2 className="text-[15px] font-medium text-[#1A1A1A]">
            تصفية النتائج
          </h2>
          <Filter className="w-4 h-4 text-[#1A1A1A]" />
        </div>
        <p className="text-[12px] text-[#666666] text-right">
          حدد الخيارات للعثور على الفرصة المناسبة
        </p>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-row-reverse justify-end">
            <h3 className="text-[13px] font-medium text-[#1A1A1A]">
              التصنيفات
            </h3>
          </div>
          <div className="flex flex-col gap-2.5 items-end">
            {CATEGORIES.map((category) => {
              const isChecked = selectedCategories.includes(category);
              return (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer flex-row-reverse"
                >
                  <div
                    className={`w-4 h-4 rounded-sm border-[0.5px] flex items-center justify-center transition-colors ${isChecked ? "bg-[#3C3489] border-[#3C3489]" : "border-[#E5E5E5] bg-white"}`}
                  >
                    {isChecked && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-[14px] text-[#1A1A1A]">{category}</span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isChecked}
                    onChange={() => toggleCategory(category)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-row-reverse justify-end">
            <h3 className="text-[13px] font-medium text-[#1A1A1A]">
              الموقع الجغرافي
            </h3>
            <MapPin className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <select
            className="w-full border-[0.5px] border-[#E5E5E5] rounded-lg px-3.5 py-2.5 text-[14px] text-[#1A1A1A] outline-none focus:border-[#3C3489] appearance-none bg-white text-right"
            dir="rtl"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-row-reverse justify-end">
            <h3 className="text-[13px] font-medium text-[#1A1A1A]">
              التوقيت المتاح
            </h3>
            <Clock className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div className="flex gap-2 flex-row-reverse">
            <button
              onClick={() =>
                setSelectedTimeSlot(
                  selectedTimeSlot === "morning" ? null : "morning",
                )
              }
              className={`flex-1 rounded-lg py-2 text-center text-[14px] transition-colors border-[0.5px] ${selectedTimeSlot === "morning" ? "bg-[#3C3489] text-white border-[#3C3489]" : "bg-white text-[#666666] border-[#E5E5E5] hover:bg-gray-50"}`}
            >
              صباحي
            </button>
            <button
              onClick={() =>
                setSelectedTimeSlot(
                  selectedTimeSlot === "afternoon" ? null : "afternoon",
                )
              }
              className={`flex-1 rounded-lg py-2 text-center text-[14px] transition-colors border-[0.5px] ${selectedTimeSlot === "afternoon" ? "bg-[#3C3489] text-white border-[#3C3489]" : "bg-white text-[#666666] border-[#E5E5E5] hover:bg-gray-50"}`}
            >
              مسائي
            </button>
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-[#3C3489] text-white rounded-lg py-2.5 text-[14px] font-medium mt-4 hover:bg-[#2e286e] transition-colors"
        >
          تحديث النتائج
        </button>
      </div>
    </div>
  );
}
