// Create app/components/ImageTest.tsx
"use client";

import { useCustomizationStore } from "@/stores/customization-store";

export function ImageTest() {
  const { selectedProduct } = useCustomizationStore();

  const getImagePath = (part: string = "base"): string => {
    const imageMap: Record<string, string> = {
      base: "mke_base.png",
      upper: "mke_upper.png",
      sole: "mke_sole.png",
      midsole: "mke_mid_sole.png",
      laces: "mke_lace.png",
      swoosh: "mke_exestave.png",
    };

    const fileName = imageMap[part] || `${part}.png`;
    const folder = "nike-airmax";
    return `/sneakers/${folder}/${fileName}`;
  };

  const parts = ["base", "upper", "sole", "midsole", "laces", "swoosh"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Test</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {parts.map((part) => (
          <div key={part} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{part}</h3>
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <img
                src={getImagePath(part)}
                alt={part}
                className="max-h-full max-w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `<div class="text-red-500 text-center p-4">
                      <div class="font-bold">❌ Failed to load</div>
                      <div class="text-sm">${getImagePath(part)}</div>
                     </div>`;
                }}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  console.log(`${part} loaded:`, {
                    src: img.src,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    complete: img.complete,
                  });
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 truncate">
              {getImagePath(part)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
