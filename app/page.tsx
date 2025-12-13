"use client";
import Link from "next/link";
import {
  ArrowRight,
  Palette,
  Sparkles,
  Zap,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Navigation - Responsive */}
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white" />
            <span className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              Sneaker Studio
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border border-black dark:border-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-black dark:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-black dark:bg-white text-white dark:text-black">
                  Get Started
                </Button>
              </Link>
              <Link href="/studio" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-black dark:text-white"
                >
                  Studio
                </Button>
              </Link>
              <Link href="/gallery" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-black dark:text-white"
                >
                  Gallery
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Responsive */}
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 dark:border-gray-700 mb-6 sm:mb-8">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700 dark:text-gray-300" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              🎨 Design Your Dream Sneakers
            </span>
          </div>

          {/* Main Heading - Responsive Text Sizes */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="text-black dark:text-white">
              Customize Sneakers
            </span>
            <br className="hidden sm:block" />
            <span className="text-gray-800 dark:text-gray-200">
              Like a Pro Designer
            </span>
          </h1>

          {/* Subtitle - Responsive */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Create unique sneaker designs with our real-time customizer. Mix
            colors, materials, add personal text, and see instant previews.
          </p>

          {/* CTA Buttons - Responsive Stacking */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-2 border-black dark:border-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Designing Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/studio" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-400 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 bg-white/80 dark:bg-black/80 text-black dark:text-white"
              >
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Preview Cards - Responsive Grid */}
          <div className="relative mb-16 sm:mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-30"></div>
            <div className="relative bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-300 dark:border-gray-800 p-4 sm:p-6 md:p-8 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    title: "SUMMER",
                    desc: "Summer Vibes Collection",
                    bg: "from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900",
                  },
                  {
                    title: "SPORT",
                    desc: "Sport Performance Line",
                    bg: "from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900",
                  },
                  {
                    title: "ART",
                    desc: "Artistic Designs",
                    bg: "from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800",
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-3 sm:space-y-4">
                    <div
                      className={`h-40 sm:h-48 bg-gradient-to-br ${item.bg} rounded-lg sm:rounded-xl flex items-center justify-center`}
                    >
                      <div className="text-black dark:text-white font-bold text-xl sm:text-2xl">
                        {item.title}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
            {[
              {
                icon: Palette,
                title: "Real-time Customization",
                desc: "See changes instantly as you customize",
                bg: "bg-gray-100 dark:bg-gray-900",
                iconColor: "text-black dark:text-white",
              },
              {
                icon: Zap,
                title: "AI-Powered Suggestions",
                desc: "Get design ideas from AI with simple prompts",
                bg: "bg-gray-100 dark:bg-gray-900",
                iconColor: "text-black dark:text-white",
              },
              {
                icon: CheckCircle,
                title: "Save & Share Designs",
                desc: "Save your creations to gallery and share",
                bg: "bg-gray-100 dark:bg-gray-900",
                iconColor: "text-black dark:text-white",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-800"
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${feature.bg} rounded-full mb-3 sm:mb-4`}
                >
                  <feature.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.iconColor}`}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* How It Works - Responsive */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-black dark:text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              {[
                { step: "01", title: "Sign Up", desc: "Create account" },
                { step: "02", title: "Pick Model", desc: "Choose sneaker" },
                { step: "03", title: "Customize", desc: "Design it" },
                { step: "04", title: "Save", desc: "Save design" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-black dark:from-gray-300 dark:to-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-sm sm:text-base mx-auto mb-2 sm:mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base text-black dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA - Responsive */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-300 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-black dark:text-white">
              Ready to Design Your Perfect Sneakers?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Join creators who've designed their dream sneakers. No credit card
              required to start.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-3 sm:mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-black dark:text-white hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Responsive */}
      <footer className="border-t border-gray-300 dark:border-gray-800 mt-12 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-white" />
              <span className="text-lg sm:text-xl font-bold text-black dark:text-white">
                Sneaker Studio
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center md:text-left">
              <p>
                © {new Date().getFullYear()} Sneaker Studio. Built with Next.js
                15
              </p>
              <p className="mt-1">Frontend Developer Intern Assignment</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/studio"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Studio
              </Link>
              <Link
                href="/gallery"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Access Floating Button - Mobile Optimized */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Link href="/login">
          <Button className="rounded-full shadow-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base">
            🚀 Go to Customizer
          </Button>
        </Link>
      </div>
    </div>
  );
}
