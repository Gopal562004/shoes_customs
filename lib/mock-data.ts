// lib/mock-data.ts - Make sure this matches
export const mockProducts = [
  {
    id: "prod-1",
    name: "Nike Air Max", // Should be consistent
    baseImage: "../public/sneakers/nike-airmax/mke_base.png",
    customizableParts: ["upper", "sole", "midsole", "laces", "swoosh"],
    options: {
      colors: [
        "#FF3B30",
        "#007AFF",
        "#34C759",
        "#FF9500",
        "#5AC8FA",
        "#AF52DE",
        "#5856D6",
        "#FF2D55",
      ],
      materials: ["leather", "canvas", "mesh", "suede", "rubber"],
      textures: ["smooth", "perforated", "woven"],
    },
    price: 129.99,
    description: "Nike Air Max with visible air cushioning",
  },
  {
    id: "prod-2",
    name: "Jordan 1",
    baseImage: "../public/sneakers/jordan/j_base.png",
    customizableParts: ["upper", "sole", "middle", "lace", "top"],
    options: {
      colors: [
        "#FF3B30",
        "#007AFF",
        "#34C759",
        "#FF9500",
        "#5AC8FA",
        "#AF52DE",
        "#5856D6",
        "#FF2D55",
      ],
      materials: ["leather", "patent-leather", "suede"],
      textures: ["smooth", "tumbled"],
    },
    price: 149.99,
    description: "Air Jordan 1 high-top",
  },
];

// lib/mock-data.ts
// lib/mock-data.ts - CORRECTED VERSION
export const mockDesigns = [
  {
    id: "design-1",
    userId: "user-1",
    productId: "prod-1",  // This should match product.id from mockProducts
    name: "Summer Vibes",
    customizations: {
      upper: { color: "#FF9500", material: "canvas" },
      sole: { color: "#FFFFFF", material: "rubber" },
      laces: { color: "#34C759" },
      text: { text: "AIR", textColor: "#000000" },
    },
    previewImage: "/designs/summer-vibes.png",
    tags: ["summer", "orange", "casual"],
    created_at: "2024-01-15T10:00:00Z", // REQUIRED - was missing
    description: "Bright summer design with orange accents" // Optional
  },
  {
    id: "design-2",
    userId: "user-1",
    productId: "prod-1",  // This should match product.id from mockProducts
    name: "Midnight Blue",
    customizations: {
      upper: { color: "#1e3a8a", material: "leather" },
      sole: { color: "#0f172a", material: "rubber" },
      swoosh: { color: "#fbbf24" },
      text: { text: "MAX", textColor: "#ffffff" },
    },
    previewImage: "/designs/midnight-blue.png",
    tags: ["blue", "premium", "night"],
    created_at: "2024-01-20T14:30:00Z", // REQUIRED - was missing
    description: "Premium midnight blue design" // Optional
  },
];

// Add this to your mock-data file
export const mockUsers = [
  {
    id: "user-1",
    email: "test@example.com",
    name: "John Doe",
    password: "password123", // In real app, use hashed passwords
  },
];
