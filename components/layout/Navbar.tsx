// components/layout/Navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import {
  LogOut,
  Home,
  Palette,
  Grid,
  User,
  ShoppingBag,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Studio",
      href: "/studio",
      icon: <Home className="h-4 w-4" />,
      active: pathname === "/studio",
    },
    {
      name: "Gallery",
      href: "/gallery",
      icon: <Grid className="h-4 w-4" />,
      active: pathname === "/gallery",
    }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg border-b shadow-sm"
          : "bg-white/90 backdrop-blur-sm border-b"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Palette className="h-6 w-6 text-blue-600 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sneaker Studio
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                Design. Customize. Create.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`gap-2 transition-all ${
                    item.active
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {item.active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                  )}
                </Button>
              </Link>
            ))}

            {/* AI Studio Button */}
            <Link href="/studio">
              <Button
                variant="ghost"
                className="gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                  AI Studio
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* User & Actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <>
              {/* User Profile */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation (Simplified) */}
      <div className="md:hidden border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-around">
            {navItems.slice(0, 3).map((item) => (
              <Link key={item.name} href={item.href} className="flex-1">
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full flex-col h-auto py-2"
                >
                  <div
                    className={`${
                      item.active ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      item.active
                        ? "font-semibold text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
