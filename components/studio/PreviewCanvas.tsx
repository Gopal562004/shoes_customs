"use client";

import { useRef, useState, useEffect } from "react";
import { useCustomizationStore } from "@/stores/customization-store";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  RefreshCw,
  Bug,
  Maximize2,
  Minimize2,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

export function PreviewCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { selectedProduct, customizations } = useCustomizationStore();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [loadedMasks, setLoadedMasks] = useState<Record<string, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && canvasRef.current) {
      canvasRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Map part names to your specific image files
const getImagePath = (part: string = "base"): string => {
  if (!selectedProduct) return "";

  const isNike = selectedProduct.name.toLowerCase().includes("air max");
  const isJordan = selectedProduct.name.toLowerCase().includes("jordan");

  // Nike image mapping
  const nikeImageMap: Record<string, string> = {
    base: "mke_base.png",
    upper: "mke_upper.png",
    sole: "mke_sole.png",
    midsole: "mke_mid_sole.png",
    laces: "mke_lace.png",
    swoosh: "mke_exestave.png",
    heel: "heel.png",
    toe: "toe.png",
    text: "mke_text.png",
  };

  // Jordan image mapping
  const jordanImageMap: Record<string, string> = {
    base: "j_base.png",
    upper: "j_upper.png",
    sole: "j_sole.png",
    middle: "j_middle.png",
    lace: "j_lace.png",
    top: "j_top.png",
    text: "j_text.png",
  };

  let fileName = "";
  let folder = "";

  if (isNike) {
    folder = "nike-airmax";
    fileName = nikeImageMap[part] || `${part}.png`;
  } else if (isJordan) {
    folder = "jordan";
    fileName = jordanImageMap[part] || `${part}.png`;
  } else {
    return ""; // Unknown product
  }

  return `/sneakers/${folder}/${fileName}`;
};

  // Test if image exists
  const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Test all mask images on mount
  useEffect(() => {
    if (selectedProduct) {
      const testMasks = async () => {
        const results: Record<string, boolean> = {};
        for (const part of selectedProduct.customizableParts) {
          const url = getImagePath(part);
          const exists = await testImageLoad(url);
          results[part] = exists;
        }
        setLoadedMasks(results);
      };
      testMasks();
    }
  }, [selectedProduct]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle responsive sizing
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (imageError || !selectedProduct) {
    return (
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 md:p-4 lg:p-6 shadow-lg">
        <CSSFallbackSneaker />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 md:p-4 lg:p-6 shadow-lg ${
        isFullscreen ? "fixed inset-0 z-50 p-0 m-0 rounded-none" : ""
      }`}
    >
      {/* Controls */}
      <div
        className={`absolute z-10 flex gap-1 md:gap-2 ${
          isMobileView ? "top-2 right-2" : "top-4 right-4"
        }`}
      >
        <Button
          size={isMobileView ? "icon" : "sm"}
          variant={debugMode ? "destructive" : "outline"}
          onClick={() => setDebugMode(!debugMode)}
          title="Debug Mode"
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          <Bug className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <Button
          size={isMobileView ? "icon" : "sm"}
          variant="outline"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <Button
          size={isMobileView ? "icon" : "sm"}
          variant="outline"
          onClick={handleZoomIn}
          title="Zoom In"
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <Button
          size={isMobileView ? "icon" : "sm"}
          variant="outline"
          onClick={() => setRotation((prev) => prev + 90)}
          title="Rotate"
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          <RotateCw className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <Button
          size={isMobileView ? "icon" : "sm"}
          variant="outline"
          onClick={handleReset}
          title="Reset View"
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <Button
          size={isMobileView ? "icon" : "sm"}
          variant="outline"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          {isFullscreen ? (
            <Minimize2 className="h-3 w-3 md:h-4 md:w-4" />
          ) : (
            <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
          )}
        </Button>
        <Button
          size={isMobileView ? "icon" : "sm"}
          onClick={() => alert("Download feature")}
          title="Download"
          className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
        >
          <Download className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </div>

      {/* Debug Info */}
      {debugMode && (
        <div
          className={`absolute z-10 bg-red-100 border border-red-300 p-2 rounded text-xs ${
            isMobileView ? "top-2 left-2 max-w-[120px]" : "top-4 left-4"
          }`}
        >
          <strong>Debug Mode</strong>
          <div className="mt-1 grid grid-cols-2 gap-1">
            {selectedProduct.customizableParts.map((part) => (
              <div key={part} className="flex items-center gap-1">
                <span className="truncate text-[10px]">{part}:</span>
                <span
                  className={`text-[10px] ${
                    loadedMasks[part] ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {loadedMasks[part] ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div
        className={`flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-white to-gray-100 ${
          isFullscreen
            ? "h-screen"
            : "h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px]"
        }`}
      >
        <motion.div
          ref={canvasRef}
          className="relative"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.3s ease",
            width: isMobileView ? "200px" : isFullscreen ? "500px" : "300px",
            height: isMobileView ? "130px" : isFullscreen ? "320px" : "200px",
          }}
        >
          {/* Base Image */}
          <img
            src={getImagePath("base")}
            alt="Sneaker base"
            className="absolute inset-0 w-full h-full object-contain"
            onError={() => setImageError(true)}
          />

          {/* Color Overlays for each part */}
          {selectedProduct.customizableParts.map((part) => {
            const partColor = customizations[part]?.color;
            if (!partColor) return null;

            const maskUrl = getImagePath(part);
            const isLoaded = loadedMasks[part];

            return (
              <div
                key={part}
                className="absolute inset-0"
                style={{
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskImage: `url(${maskUrl})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  backgroundColor: partColor,
                  opacity: isLoaded ? 0.8 : 0.5,
                  mixBlendMode: isLoaded ? "normal" : "multiply",
                  border: debugMode ? "1px solid red" : "none",
                }}
              />
            );
          })}

          {/* Text Engraving */}
          {customizations.text?.text && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                color: customizations.text.textColor || "#000000",
                fontSize: isMobileView ? "16px" : "24px",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(255,255,255,0.8)",
                whiteSpace: "nowrap",
              }}
            >
              {customizations.text.text}
            </div>
          )}
        </motion.div>
      </div>

      {/* Zoom Info */}
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-600">
            Zoom: {(zoom * 100).toFixed(0)}% • Rotation: {rotation}°
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMobileView(!isMobileView)}
            className="h-6 w-6 p-0 md:hidden"
            title="Toggle mobile view"
          >
            <Smartphone className="h-3 w-3" />
          </Button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-gray-600 mt-2">
          • Use controls to zoom/rotate • Click parts in sidebar to customize
        </p>
        {debugMode && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="font-semibold">Debug: ✓=Loaded, ✗=Missing</p>
            <p>Check console for detailed info</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CSSFallbackSneaker() {
  const { customizations } = useCustomizationStore();

  return (
    <div className="flex items-center justify-center h-[300px] md:h-[400px] lg:h-[500px]">
      <div className="relative w-64 md:w-80 h-32 md:h-40">
        {/* Fallback sneaker visualization */}
        <div className="absolute inset-0">
          {/* Sole */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 md:h-8 rounded-full"
            style={{
              backgroundColor: customizations.sole?.color || "#333333",
            }}
          />

          {/* Upper */}
          <div
            className="absolute top-0 left-0 right-0 h-20 md:h-24 rounded-xl"
            style={{
              backgroundColor: customizations.upper?.color || "#666666",
            }}
          />

          {/* Laces */}
          <div
            className="absolute top-8 md:top-10 left-6 md:left-8 right-6 md:right-8 h-1 md:h-2 rounded-full"
            style={{
              backgroundColor: customizations.laces?.color || "#ffffff",
            }}
          />

          {/* Swoosh */}
          <div
            className="absolute top-10 md:top-14 right-6 md:right-8 w-12 md:w-16 h-4 md:h-6"
            style={{
              backgroundColor: customizations.swoosh?.color || "#ff0000",
              clipPath:
                "polygon(0% 50%, 30% 0%, 100% 0%, 70% 50%, 100% 100%, 30% 100%)",
            }}
          />

          {/* Text */}
          {customizations.text?.text && (
            <div
              className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 text-center font-bold text-sm md:text-base"
              style={{ color: customizations.text.textColor || "#000000" }}
            >
              {customizations.text.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
