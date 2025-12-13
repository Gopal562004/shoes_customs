"use client";

import { CustomizationSidebar } from "@/components/studio/CustomizationSidebar";
import { PreviewCanvas } from "@/components/studio/PreviewCanvas";
import { motion } from "framer-motion";
import { Sparkles, Zap, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function StudioPage() {
  const [showAI, setShowAI] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setShowMobileSidebar(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAISuggestions = () => {
    setShowAI(true);
    alert(
      "AI Suggestions feature would be implemented here with Gemini/OpenAI API"
    );
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".mobile-sidebar");
      const overlay = document.querySelector(".sidebar-overlay");
      const toggleButton = document.querySelector(".sidebar-toggle-button");

      if (
        isMobile &&
        showMobileSidebar &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        overlay &&
        overlay.contains(event.target as Node) &&
        !toggleButton?.contains(event.target as Node)
      ) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, showMobileSidebar]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="hidden md:block p-2 bg-white rounded-lg shadow-sm">
              <Settings className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Sneaker Studio
              </h1>
              <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                Real-time 3D customization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Customize Button */}
            {isMobile && !showMobileSidebar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileSidebar(true)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
            )}

            {/* Sidebar Toggle Button */}
            <Button
              variant={isMobile && showMobileSidebar ? "default" : "outline"}
              size="icon"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="sidebar-toggle-button lg:hidden"
            >
              {showMobileSidebar ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm md:text-base text-gray-600">
          Design your perfect sneakers in real-time. Customize colors,
          materials, and add personal text.
        </p>

        {/* Bonus Feature Button */}
        <Button
          className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full md:w-auto"
          onClick={handleAISuggestions}
          size={isMobile ? "sm" : "default"}
        >
          <Sparkles className="h-4 w-4" />
          Get AI Suggestions
          <Zap className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Sidebar - Left (Hidden on mobile unless toggled) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`lg:col-span-1 mobile-sidebar ${
              isMobile
                ? `fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    showMobileSidebar ? "translate-x-0" : "-translate-x-full"
                  }`
                : ""
            }`}
          >
            <CustomizationSidebar
              onClose={() => setShowMobileSidebar(false)}
              isMobile={isMobile}
            />
          </motion.div>

          {/* Overlay for mobile sidebar */}
          {isMobile && showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden sidebar-overlay"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Preview Canvas - Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`lg:col-span-2 ${
              isMobile && showMobileSidebar
                ? "opacity-30 pointer-events-none"
                : ""
            }`}
          >
            <div className="relative">
              <PreviewCanvas />

              {/* Floating Mobile Controls */}
              {isMobile && !showMobileSidebar && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg h-10 w-10"
                    onClick={() => setShowMobileSidebar(true)}
                    title="Open customization"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg h-10 w-10"
                    onClick={handleAISuggestions}
                    title="AI Suggestions"
                  >
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Customize Panel */}
            {isMobile && !showMobileSidebar && (
              <div className="mt-4 mb-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Quick Customization</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileSidebar(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    More Options →
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="h-10">
                    🎨 Colors
                  </Button>
                  <Button variant="outline" size="sm" className="h-10">
                    ✨ Materials
                  </Button>
                  <Button variant="outline" size="sm" className="h-10">
                    🔤 Text
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 md:mt-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
              <Button variant="outline" className="gap-2 h-10 md:h-auto">
                <span className="text-sm md:text-base">🎨</span>
                <span className="text-xs md:text-sm">Colors</span>
              </Button>
              <Button variant="outline" className="gap-2 h-10 md:h-auto">
                <span className="text-sm md:text-base">📱</span>
                <span className="text-xs md:text-sm">Share</span>
              </Button>
              <Button variant="outline" className="gap-2 h-10 md:h-auto">
                <span className="text-sm md:text-base">🛒</span>
                <span className="text-xs md:text-sm">Cart</span>
              </Button>
              <Button variant="outline" className="gap-2 h-10 md:h-auto">
                <span className="text-sm md:text-base">📷</span>
                <span className="text-xs md:text-sm">Capture</span>
              </Button>
            </div>

            {/* Tips */}
            <div className="mt-6 md:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
                💡 Design Tips
              </h3>
              <ul className="text-xs md:text-sm text-blue-700 space-y-1">
                <li>
                  • Tap on sneaker parts in the preview to select them quickly
                </li>
                <li>• Use complementary colors for a professional look</li>
                <li>• Save multiple versions to compare later</li>
                <li className="hidden md:block">
                  • Try different materials for unique textures
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mock AI Suggestions Modal */}
      {showAI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                AI Design Suggestions
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAI(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Enter a prompt like "summer vibe" or "sporty with blue accents"
            </p>
            <input
              type="text"
              placeholder="Describe your dream sneakers..."
              className="w-full border rounded-lg px-3 md:px-4 py-2 md:py-3 mb-3 md:mb-4 text-sm md:text-base"
            />
            <div className="space-y-2 mb-3 md:mb-4">
              <Button
                variant="outline"
                className="w-full justify-start text-xs md:text-sm h-10 md:h-auto"
              >
                🏖️ Summer Beach Vibes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs md:text-sm h-10 md:h-auto"
              >
                🏀 Sporty Performance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs md:text-sm h-10 md:h-auto"
              >
                🎨 Artistic Gradient
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-sm md:text-base h-10 md:h-auto"
                onClick={() => setShowAI(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-sm md:text-base h-10 md:h-auto">
                Apply
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
