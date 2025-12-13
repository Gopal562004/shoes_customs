"use client";

import { useState, useEffect } from "react";
import { useCustomizationStore } from "@/stores/customization-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import {
  Palette,
  Type,
  Grid,
  Droplet,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from "lucide-react";

interface CustomizationSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function CustomizationSidebar({
  onClose,
  isMobile = false,
}: CustomizationSidebarProps) {
  const {
    selectedProduct,
    customizations,
    updateCustomization,
    resetCustomization,
    saveCurrentDesign,
    selectProduct,
    products,
  } = useCustomizationStore();

  const [designName, setDesignName] = useState("My Custom Design");
  const [activePart, setActivePart] = useState("upper");
  const [expandedSections, setExpandedSections] = useState({
    product: true,
    parts: true,
    customization: true,
    actions: true,
  });

  // Auto-expand all sections on mobile for better UX
  useEffect(() => {
    if (isMobile) {
      setExpandedSections({
        product: true,
        parts: true,
        customization: true,
        actions: true,
      });
    }
  }, [isMobile]);

  if (!selectedProduct) return null;

  const colorOptions = selectedProduct.options.colors;
  const materialOptions = selectedProduct.options.materials;

  const handleSaveDesign = async () => {
    try {
      await saveCurrentDesign(designName, []);
      alert("Design saved successfully!");
      if (isMobile && onClose) {
        onClose();
      }
    } catch (error) {
      alert("Failed to save design");
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSectionHeader = (
    title: string,
    icon: React.ReactNode,
    section: keyof typeof expandedSections
  ) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-sm md:text-base">{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div
      className={`w-full bg-white ${
        isMobile
          ? "h-full overflow-y-auto pb-20"
          : "rounded-xl shadow-lg p-4 md:p-6"
      }`}
    >
      {/* Mobile Header with Close Button */}
      {isMobile && onClose && (
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Palette className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Customization Panel</h2>
              <p className="text-xs text-gray-500">
                Adjust your design settings
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Product Selection */}
      <div className={isMobile ? "mb-4 px-4" : "mb-6"}>
        {!isMobile && (
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Select Sneaker Model
          </Label>
        )}

        {(!isMobile || expandedSections.product) && (
          <Select
            defaultValue={selectedProduct.id}
            onValueChange={selectProduct}
          >
            <SelectTrigger className={isMobile ? "h-10 text-sm" : ""}>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id}
                  className="text-sm"
                >
                  {product.name} - ${product.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Part Selection */}
      <div className={isMobile ? "mb-4 px-4" : "mb-6"}>
        {!isMobile && (
          <Label className="text-sm font-medium mb-2">Customize Part</Label>
        )}

        {(!isMobile || expandedSections.parts) && (
          <div
            className={`flex ${
              isMobile ? "overflow-x-auto pb-2" : "flex-wrap"
            } gap-2`}
          >
            {selectedProduct.customizableParts.map((part) => (
              <Button
                key={part}
                variant={activePart === part ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setActivePart(part)}
                className={`capitalize ${
                  isMobile ? "whitespace-nowrap flex-shrink-0" : ""
                }`}
              >
                {part}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Customization Tabs */}
      <div className={isMobile ? "mb-4 px-4" : ""}>
        {!isMobile && (
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 h-10">
              <TabsTrigger value="colors" className="gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="materials" className="gap-2">
                <Droplet className="h-4 w-4" />
                Materials
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2">
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              <div>
                <Label>Select Color for {activePart}</Label>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => updateCustomization(activePart, { color })}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Hex: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Picker */}
              <div className="mt-4">
                <Label>Custom Color Picker</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    type="color"
                    className="w-16 h-12"
                    value={customizations[activePart]?.color || "#000000"}
                    onChange={(e) =>
                      updateCustomization(activePart, { color: e.target.value })
                    }
                  />
                  <span className="text-gray-600">
                    {customizations[activePart]?.color || "#000000"}
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <div>
                <Label>Select Material for {activePart}</Label>
                <div className="space-y-2 mt-3">
                  {materialOptions.map((material) => (
                    <Button
                      key={material}
                      variant={
                        customizations[activePart]?.material === material
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start capitalize"
                      onClick={() =>
                        updateCustomization(activePart, { material })
                      }
                    >
                      {material}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label>Engraving Text</Label>
                <Input
                  placeholder="Enter custom text"
                  value={customizations.text?.text || ""}
                  onChange={(e) =>
                    updateCustomization("text", { text: e.target.value })
                  }
                  className="mt-2"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 20 characters •{" "}
                  {20 - (customizations.text?.text?.length || 0)} remaining
                </p>
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex gap-3 mt-3">
                  {["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#FFD700"].map(
                    (color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          updateCustomization("text", { textColor: color })
                        }
                        title={`Hex: ${color}`}
                      />
                    )
                  )}
                  <Input
                    type="color"
                    className="w-12 h-8"
                    value={customizations.text?.textColor || "#000000"}
                    onChange={(e) =>
                      updateCustomization("text", { textColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Mobile Customization Options (Simplified) */}
        {isMobile && expandedSections.customization && (
          <div className="space-y-6">
            {/* Colors */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Colors for {activePart}
                </h4>
                <span className="text-xs text-gray-500">Tap to select</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.slice(0, 12).map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => updateCustomization(activePart, { color })}
                    title={`Hex: ${color}`}
                  />
                ))}
              </div>
              <div className="mt-3">
                <Label className="text-sm mb-2 block">Custom Color</Label>
                <Input
                  type="color"
                  className="w-full h-10"
                  value={customizations[activePart]?.color || "#000000"}
                  onChange={(e) =>
                    updateCustomization(activePart, { color: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Materials */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Materials</h4>
              <div className="grid grid-cols-2 gap-2">
                {materialOptions.map((material) => (
                  <Button
                    key={material}
                    variant={
                      customizations[activePart]?.material === material
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="capitalize"
                    onClick={() =>
                      updateCustomization(activePart, { material })
                    }
                  >
                    {material}
                  </Button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Personalization
              </h4>
              <Input
                placeholder="Add text (max 20 chars)"
                value={customizations.text?.text || ""}
                onChange={(e) =>
                  updateCustomization("text", { text: e.target.value })
                }
                className="mb-3"
                maxLength={20}
              />
              <div className="flex gap-2">
                {["#000000", "#FFFFFF", "#FF0000", "#0000FF"].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      updateCustomization("text", { textColor: color })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Design Name & Actions */}
      <div className={isMobile ? "mb-4 px-4" : "mt-6 space-y-4"}>
        {(!isMobile || expandedSections.actions) && (
          <>
            <div>
              <Label className={isMobile ? "text-sm block mb-1" : ""}>
                Design Name
              </Label>
              <Input
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="My Awesome Sneakers"
                className={isMobile ? "h-10 text-sm" : ""}
              />
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-2 mt-4 ${isMobile ? "" : ""}`}>
              <Button
                variant="outline"
                className={`${isMobile ? "flex-1" : "flex-1"} gap-2 ${
                  isMobile ? "h-10" : ""
                }`}
                onClick={resetCustomization}
              >
                <RefreshCw className="h-4 w-4" />
                Reset All
              </Button>
              <Button
                className={`${isMobile ? "flex-1" : "flex-1"} gap-2 ${
                  isMobile ? "h-10" : ""
                }`}
                onClick={handleSaveDesign}
              >
                <Save className="h-4 w-4" />
                Save Design
              </Button>
              {isMobile && onClose && (
                <Button
                  variant="secondary"
                  className="gap-2 h-10"
                  onClick={onClose}
                >
                  <Check className="h-4 w-4" />
                  Done
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Price Display */}
      <div
        className={`${
          isMobile
            ? "px-4 pt-4 border-t sticky bottom-0 bg-white"
            : "mt-6 pt-4 border-t"
        }`}
      >
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isMobile ? "text-sm" : ""}`}>
            Total Price:
          </span>
          <span
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-bold text-green-600`}
          >
            ${(selectedProduct.price + 20).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Base: ${selectedProduct.price} • Customization: $20.00
        </p>
      </div>

      {/* Mobile Bottom Spacing */}
      {isMobile && <div className="h-20" />}
    </div>
  );
}
