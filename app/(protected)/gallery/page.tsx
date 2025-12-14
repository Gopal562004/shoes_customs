// app/gallery/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { DesignCard } from "@/components/gallery/DesignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Download,
  Calendar,
  Tag,
  RefreshCw,
  Palette,
  Layers,
} from "lucide-react";
import { mockDesigns } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useCustomizationStore } from "@/stores/customization-store";
import { useAuthStore } from "@/stores/auth-store";
import { SavedDesign } from "@/types";
import { format } from "date-fns";

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  const router = useRouter();
  const {
    loadDesign,
    resetCustomization,
    savedDesigns,
    getSavedDesigns,
    deleteDesign,
  } = useCustomizationStore();
  const { isAuthenticated, user } = useAuthStore();

  // Get designs from store (combine with mock designs for initial state)
  const userDesigns = useMemo(() => {
    const storeDesigns = savedDesigns || [];
    // If no designs in store yet, use mock designs
    if (storeDesigns.length === 0) {
      return mockDesigns.map((design) => ({
        ...design,
        // Ensure mock designs have all required fields
        customizations: design.customizations || {},
        tags: design.tags || [],
        created_at: design.created_at || new Date().toISOString(), // Critical fix
        description: design.description || "",
      }));
    }
    return storeDesigns.map((design) => ({
      ...design,
      // Ensure store designs have all required fields too
      customizations: design.customizations || {},
      tags: design.tags || [],
      created_at: design.created_at || new Date().toISOString(),
    }));
  }, [savedDesigns]);

  // All unique tags from user designs
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    userDesigns.forEach((design) => {
      (design.tags || []).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [userDesigns]);

  // Filter designs based on search and tags
  const filteredDesigns = useMemo(() => {
    return userDesigns.filter((design) => {
      const matchesSearch =
        design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (design.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (design.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => (design.tags || []).includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, userDesigns]);

  // Sort designs
  const sortedDesigns = useMemo(() => {
    const designs = [...filteredDesigns];

    switch (sortBy) {
      case "newest":
        return designs.sort(
          (a, b) =>
            new Date(b.created_at || new Date()).getTime() -
            new Date(a.created_at || new Date()).getTime()
        );
      case "oldest":
        return designs.sort(
          (a, b) =>
            new Date(a.created_at || new Date()).getTime() -
            new Date(b.created_at || new Date()).getTime()
        );
      case "name":
        return designs.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return designs;
    }
  }, [filteredDesigns, sortBy]);

  // Get design statistics
  const stats = useMemo(() => {
    const totalDesigns = userDesigns.length;
    const thisMonth = userDesigns.filter(
      (d) =>
        new Date(d.created_at || new Date()).getMonth() ===
        new Date().getMonth()
    ).length;
    const totalColors = new Set(
      userDesigns.flatMap((d) =>
        Object.values(d.customizations || {})
          .filter((c: any) => c?.color)
          .map((c: any) => c.color)
      )
    ).size;
    const totalTags = allTags.length;

    return { totalDesigns, thisMonth, totalColors, totalTags };
  }, [userDesigns, allTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateNew = () => {
    resetCustomization();
    router.push("/studio");
  };

  const handleEditDesign = async (design: SavedDesign) => {
    try {
      loadDesign(design);
      router.push("/studio");
    } catch (error) {
      console.error("Failed to load design:", error);
      alert("Failed to load design. Please try again.");
    }
  };

  const handleDuplicateDesign = async (design: SavedDesign) => {
    setIsLoading(true);
    try {
      // First load the design into the current customization state
      loadDesign(design);

      // Then save it as a new design
      useCustomizationStore
        .getState()
        .saveCurrentDesign(`${design.name} (Copy)`, design.tags || []);

      alert(`Design "${design.name}" duplicated successfully!`);
    } catch (error) {
      console.error("Failed to duplicate design:", error);
      alert("Failed to duplicate design. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return;

    setIsLoading(true);
    try {
      // Delete from store
      deleteDesign(designId);
      alert("Design deleted successfully!");
    } catch (error) {
      console.error("Failed to delete design:", error);
      alert("Failed to delete design. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDesign = (design: SavedDesign) => {
    const dataStr = JSON.stringify(design, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${design.name.replace(
      /\s+/g,
      "_"
    )}_design.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleShareDesign = (design: SavedDesign) => {
    navigator.clipboard
      .writeText(`${window.location.origin}/share/design/${design.id}`)
      .then(() => {
        alert("Share link copied to clipboard!");
      });
  };

  // Export all designs
  const handleExportAll = () => {
    const dataStr = JSON.stringify(userDesigns, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "my_sneaker_designs.json");
    linkElement.click();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Design Gallery
              </h1>
              <p className="text-gray-600 mt-2">
                {isAuthenticated && user?.name
                  ? `Welcome back, ${user.name}! Browse your custom sneaker designs.`
                  : "Browse, edit, and manage your saved sneaker designs"}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportAll}
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-sm text-gray-500">Total Designs</p>
              </div>
              <p className="text-2xl font-bold">{stats.totalDesigns}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-green-500" />
                <p className="text-sm text-gray-500">This Month</p>
              </div>
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="h-3 w-3 text-purple-500" />
                <p className="text-sm text-gray-500">Colors Used</p>
              </div>
              <p className="text-2xl font-bold">{stats.totalColors}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="h-3 w-3 text-orange-500" />
                <p className="text-sm text-gray-500">Tags</p>
              </div>
              <p className="text-2xl font-bold">{stats.totalTags}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search designs by name, tags, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>

              <div className="flex flex-wrap gap-2 flex-1">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="capitalize"
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <span className="ml-1 text-xs bg-white/20 px-1 rounded">
                        ✓
                      </span>
                    )}
                  </Button>
                ))}
                {(selectedTags.length > 0 || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border rounded-lg px-3 py-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold">{filteredDesigns.length}</span> of{" "}
              {userDesigns.length} designs
              {searchQuery && (
                <span>
                  {" "}
                  for "<span className="font-semibold">{searchQuery}</span>"
                </span>
              )}
              {selectedTags.length > 0 && (
                <span>
                  {" "}
                  with tags:{" "}
                  <span className="font-semibold">
                    {selectedTags.join(", ")}
                  </span>
                </span>
              )}
            </p>
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  Active filters: {selectedTags.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Designs Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading designs...</p>
          </div>
        ) : sortedDesigns.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {sortedDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={viewMode === "list" ? "max-w-4xl" : ""}
              >
                <DesignCard
                  design={design}
                  viewMode={viewMode}
                  onEdit={() => handleEditDesign(design)}
                  onDuplicate={() => handleDuplicateDesign(design)}
                  onDelete={() => handleDeleteDesign(design.id)}
                  onExport={() => handleExportDesign(design)}
                  onShare={() => handleShareDesign(design)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/50 rounded-xl border-2 border-dashed"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery || selectedTags.length > 0
                ? "No designs found"
                : "No designs yet"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No designs matching "${searchQuery}"`
                : selectedTags.length > 0
                ? "No designs with selected tags"
                : "Create your first custom sneaker design!"}
            </p>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Start Designing
            </Button>
          </motion.div>
        )}

        {/* Quick Actions Bar */}
        {sortedDesigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 flex flex-col gap-2 z-50"
          >
            <Button
              size="lg"
              onClick={handleCreateNew}
              className="rounded-full shadow-lg h-14 w-14 p-0"
              title="Create new design"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-full shadow-lg h-14 w-14 p-0"
              title="Scroll to top"
            >
              ↑
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
