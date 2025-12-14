// components/gallery/DesignCard.tsx
"use client";

import { SavedDesign } from "@/types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Edit2,
  Copy,
  Trash2,
  Download,
  Share2,
  Calendar,
  Tag,
  Palette,
  Layers,
  Type,
  ZoomIn,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { mockProducts } from "@/lib/mock-data";

interface DesignCardProps {
  design: SavedDesign;
  viewMode: "grid" | "list";
  onEdit: (design: SavedDesign) => void;
  onDuplicate: (design: SavedDesign) => void;
  onDelete: (designId: string) => void;
  onExport: (design: SavedDesign) => void;
  onShare: (design: SavedDesign) => void;
}

export function DesignCard({
  design,
  viewMode,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
  onShare,
}: DesignCardProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Find product info for this design
  const product =
    mockProducts.find((p) => p.id === design.productId) || mockProducts[0];
  const isNike = product.name.toLowerCase().includes("air max");
  const isJordan = product.name.toLowerCase().includes("jordan");

  // Safely format date
  const formatDate = (dateString?: string) => {
    try {
      return format(
        new Date(dateString || new Date().toISOString()),
        "MMM dd, yyyy"
      );
    } catch {
      return "Unknown date";
    }
  };

  // Safely get all properties with fallbacks
  const designName = design?.name || "Untitled Design";
  const designDescription = design?.description || "Custom sneaker design";
  const designCreatedAt = design?.created_at;
  const designTags = design?.tags || [];
  const designCustomizations = design?.customizations || {};

  // Calculate statistics
  const stats = useMemo(() => {
    const colorCount = Object.values(designCustomizations).filter(
      (c) => c?.color
    ).length;
    const materialCount = Object.values(designCustomizations).filter(
      (c) => c?.material
    ).length;
    const hasText = !!designCustomizations?.text?.text;

    return { colorCount, materialCount, hasText };
  }, [designCustomizations]);

  // Generate image path function - WORKS FOR BOTH NIKE AND JORDAN
  const getImagePath = (part: string = "base"): string => {
    // Map UI part names to file names
    const partMapping: Record<string, string> = {
      // Common parts
      base: "base",
      upper: "upper",
      sole: "sole",
      text: "text",

      // Nike specific
      midsole: "mid_sole", // UI "midsole" -> file "mid_sole"
      laces: "lace", // UI "laces" -> file "lace"
      swoosh: "exestave", // UI "swoosh" -> file "exestave"
      heel: "heel",
      toe: "toe",

      // Jordan specific
      middle: "middle", // UI "middle" -> file "middle"
      lace: "lace", // UI "lace" -> file "lace"
      top: "top", // Jordan specific
    };

    let folder = "";
    let prefix = "";

    if (isNike) {
      folder = "nike-airmax";
      prefix = "mke_";
    } else if (isJordan) {
      folder = "jordan";
      prefix = "j_";
    } else {
      folder = "nike-airmax";
      prefix = "mke_";
    }

    // Map the part to correct file name
    const filePart = partMapping[part] || part;
    const fileName = `${prefix}${filePart}.png`;

    return `/sneakers/${folder}/${fileName}`;
  };

  // Get unique colors from customizations
  const colorChips = useMemo(() => {
    const colors: string[] = [];
    Object.values(designCustomizations).forEach((customization) => {
      if (customization?.color && !colors.includes(customization.color)) {
        colors.push(customization.color);
      }
    });
    return colors.slice(0, 5);
  }, [designCustomizations]);

  // Render sneaker preview
  const renderSneakerPreview = (showControls = false) => {
    return (
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 h-full">
        {showControls && (
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setZoom(Math.min(zoom + 0.1, 1.5));
              }}
              className="h-6 w-6 p-0"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setRotation(rotation + 90);
              }}
              className="h-6 w-6 p-0"
              title="Rotate"
            >
              ↻
            </Button>
          </div>
        )}

        {/* Sneaker Container */}
        <div className="flex items-center justify-center h-full overflow-hidden">
          <motion.div
            className="relative w-48 h-32"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            {/* Base Image */}
            <img
              src={getImagePath("base")}
              alt={`${product.name} base`}
              className="absolute inset-0 w-full h-full object-contain opacity-100"
              onError={(e) => {
                console.error(`Failed to load image: ${getImagePath("base")}`);
                e.currentTarget.style.display = "none";
              }}
            />

            {/* Color overlays for each customized part */}
            {Object.entries(designCustomizations).map(([part, data]) => {
              if (!data?.color) return null;

              // Map Jordan-specific part names to correct file names
              let imagePart = part;
              if (isJordan) {
                // Jordan parts that differ from Nike
                const jordanMapping: Record<string, string> = {
                  middle: "middle",
                  lace: "lace",
                  top: "top",
                };
                imagePart = jordanMapping[part] || part;
              }

              const maskUrl = getImagePath(imagePart);
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
                    backgroundColor: data.color,
                    opacity: 0.8,
                  }}
                />
              );
            })}

            {/* Text Engraving */}
            {designCustomizations.text?.text && (
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  color: designCustomizations.text.textColor || "#000000",
                  fontSize: isJordan ? "18px" : "22px",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(255,255,255,0.8)",
                  fontFamily: isJordan
                    ? "'Impact', sans-serif"
                    : "'Arial', sans-serif",
                }}
              >
                {designCustomizations.text.text}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  };

  // List View
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
      >
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Preview Section */}
              <div className="w-full md:w-64">
                <div className="h-48 rounded-xl overflow-hidden">
                  {renderSneakerPreview(true)}
                </div>

                {/* Quick stats */}
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    <span>{stats.colorCount} colors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    <span>{stats.materialCount} materials</span>
                  </div>
                  {stats.hasText && (
                    <div className="flex items-center gap-1">
                      <Type className="h-3 w-3" />
                      <span>Text</span>
                    </div>
                  )}
                </div>

                {/* Product Badge */}
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isNike
                        ? "bg-blue-100 text-blue-800"
                        : "bg-black text-white"
                    }`}
                  >
                    {product.name}
                  </span>
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {designName}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {designDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(designCreatedAt)}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {designTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {designTags.length === 0 && (
                    <span className="text-xs text-gray-400 italic">
                      No tags added
                    </span>
                  )}
                </div>

                {/* Customization Details */}
                {Object.keys(designCustomizations).length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Customizations:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(designCustomizations).map(
                        ([part, data]) => (
                          <div
                            key={part}
                            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <p className="text-xs font-medium text-gray-500 capitalize mb-2 flex items-center gap-1">
                              {part === "text" ? (
                                <Type className="h-3 w-3" />
                              ) : (
                                <Palette className="h-3 w-3" />
                              )}
                              {part}
                            </p>
                            {data?.color && (
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                  style={{ backgroundColor: data.color }}
                                  title={data.color}
                                />
                                <span className="text-sm font-medium">
                                  {data.color.toUpperCase()}
                                </span>
                              </div>
                            )}
                            {data?.material && (
                              <p className="text-sm font-medium text-gray-700">
                                {data.material}
                              </p>
                            )}
                            {data?.text && (
                              <div className="text-sm font-medium">
                                "{data.text}"
                                {data.textColor && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-gray-500">
                                      Color:
                                    </span>
                                    <div
                                      className="w-3 h-3 rounded-full border"
                                      style={{
                                        backgroundColor: data.textColor,
                                      }}
                                      title={data.textColor}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onEdit(design)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit in Studio
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicate(design)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(design)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(design)}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(design.id)}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="h-full group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        {/* Color accent bar */}
        <div
          className="h-1.5 w-full"
          style={{
            backgroundColor:
              designCustomizations.upper?.color ||
              designCustomizations.sole?.color ||
              (isNike ? "#0066cc" : "#000000"),
          }}
        />

        {/* Preview Area */}
        <CardHeader className="p-0">
          <div className="h-48 w-full relative">
            {renderSneakerPreview()}

            {/* Product Badge */}
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 ${
                  isNike ? "bg-blue-600" : "bg-black"
                } text-white text-xs rounded-full font-medium backdrop-blur-sm`}
              >
                {isNike ? "Nike" : "Jordan"}
              </span>
            </div>

            {/* Tags Overlay */}
            {designTags.length > 0 && (
              <div className="absolute top-2 right-2 flex gap-1 flex-wrap max-w-[70%]">
                {designTags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm truncate max-w-full"
                    title={tag}
                  >
                    {tag}
                  </span>
                ))}
                {designTags.length > 2 && (
                  <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
                    +{designTags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Customization count badge */}
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 bg-white/90 text-gray-800 text-xs rounded-full font-medium shadow-sm">
                {Object.keys(designCustomizations).length} parts
              </span>
            </div>

            {/* Hover overlay for quick edit */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                onClick={() => onEdit(design)}
                className="gap-1 bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
              >
                <Edit2 className="h-3 w-3" />
                Edit Design
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate" title={designName}>
                {designName}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                {formatDate(designCreatedAt)}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="space-y-2">
            {colorChips.length > 0 && (
              <div className="flex items-center gap-2">
                <Palette className="h-3 w-3 text-gray-400" />
                <div className="flex gap-1">
                  {colorChips.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {colorChips.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{colorChips.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            {stats.materialCount > 0 && (
              <div className="flex items-center gap-2">
                <Layers className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600">
                  {stats.materialCount} material
                  {stats.materialCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {stats.hasText && (
              <div className="flex items-center gap-2">
                <Type className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600 truncate">
                  "{designCustomizations.text?.text}"
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between border-t pt-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(design)}
            className="h-8 px-3"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDuplicate(design)}
              className="h-8 w-8 p-0"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onShare(design)}
              className="h-8 w-8 p-0"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(design.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
