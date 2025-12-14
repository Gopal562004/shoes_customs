// // stores/customization-store.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { mockProducts } from "@/lib/mock-data"; // Import from correct location
// import { Product, PartCustomization, SavedDesign } from "@/types";

// interface CustomizationState {
//   // Current customization
//   selectedProductId: string;
//   customizations: Record<string, PartCustomization>;
//   currentDesign: SavedDesign | null;
//   savedDesigns: SavedDesign[]; // Add this to store all saved designs

//   // Products
//   products: Product[];
//   selectedProduct: Product | null;

//   // Actions
//   selectProduct: (id: string) => void;
//   updateCustomization: (
//     part: string,
//     updates: Partial<PartCustomization>
//   ) => void;
//   resetCustomization: () => void;
//   saveCurrentDesign: (name: string, tags?: string[]) => Promise<SavedDesign>;
//   loadDesign: (design: SavedDesign) => void;
//   deleteDesign: (designId: string) => void;
//   getSavedDesigns: () => SavedDesign[]; // Add this
// }

// export const useCustomizationStore = create<CustomizationState>()(
//   persist(
//     (set, get) => ({
//       // Initial state - use imported mockProducts
//       selectedProductId: mockProducts[0].id,
//       products: mockProducts,
//       selectedProduct: mockProducts[0],
//       customizations: {},
//       currentDesign: null,
//       savedDesigns: [], // Initialize empty array

//       // Actions
//       selectProduct: (id: string) => {
//         const product = mockProducts.find((p) => p.id === id);
//         if (product) {
//           set({
//             selectedProductId: id,
//             selectedProduct: product,
//             customizations: {},
//             currentDesign: null,
//           });
//         }
//       },

//       updateCustomization: (
//         part: string,
//         updates: Partial<PartCustomization>
//       ) => {
//         set((state) => ({
//           customizations: {
//             ...state.customizations,
//             [part]: {
//               ...state.customizations[part],
//               ...updates,
//             },
//           },
//           currentDesign: null,
//         }));
//       },

//       resetCustomization: () => {
//         set({
//           customizations: {},
//           currentDesign: null,
//         });
//       },

//       saveCurrentDesign: async (name: string, tags: string[] = []) => {
//         const state = get();
//         const newDesign: SavedDesign = {
//           id: `design-${Date.now()}`,
//           userId: "user-1",
//           productId: state.selectedProductId,
//           name,
//           description: `Custom ${
//             state.selectedProduct?.name || "Sneaker"
//           } Design`,
//           customizations: { ...state.customizations },
//           tags,
//           created_at: new Date().toISOString(),
//           previewImage: "img",
//         };

//         // Add to saved designs array
//         const updatedDesigns = [...state.savedDesigns, newDesign];

//         set({
//           currentDesign: newDesign,
//           savedDesigns: updatedDesigns,
//         });

//         return newDesign;
//       },

//       loadDesign: (design: SavedDesign) => {
//         const product = mockProducts.find((p) => p.id === design.productId);
//         set({
//           selectedProductId: design.productId,
//           selectedProduct: product || mockProducts[0],
//           customizations: design.customizations,
//           currentDesign: design,
//         });
//       },

//       deleteDesign: (designId: string) => {
//         const state = get();
//         const updatedDesigns = state.savedDesigns.filter(
//           (design) => design.id !== designId
//         );

//         set({
//           savedDesigns: updatedDesigns,
//           currentDesign:
//             state.currentDesign?.id === designId ? null : state.currentDesign,
//         });
//       },

//       getSavedDesigns: () => {
//         return get().savedDesigns;
//       },
//     }),
//     {
//       name: "customization-storage",
//       // Add migration to clear old data if needed
//       migrate: (persistedState: any, version: number) => {
//         console.log("Migrating customization store...");

//         // If there's a mismatch, clear and start fresh
//         if (persistedState?.products?.[0]?.name === "Air Max 90") {
//           console.log("Clearing old mock data...");
//           return {
//             selectedProductId: mockProducts[0].id,
//             products: mockProducts,
//             selectedProduct: mockProducts[0],
//             customizations: {},
//             currentDesign: null,
//             savedDesigns: [],
//           };
//         }

//         return persistedState;
//       },
//     }
//   )
// );
// stores/customization-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockProducts } from "@/lib/mock-data";
import { Product, PartCustomization, SavedDesign } from "@/types";

interface CustomizationState {
  selectedProductId: string;
  customizations: Record<string, PartCustomization>;
  currentDesign: SavedDesign | null;
  savedDesigns: SavedDesign[];
  products: Product[];
  selectedProduct: Product | null;

  selectProduct: (id: string) => void;
  updateCustomization: (
    part: string,
    updates: Partial<PartCustomization>
  ) => void;
  resetCustomization: () => void;
  saveCurrentDesign: (name: string, tags?: string[]) => Promise<SavedDesign>;
  loadDesign: (design: SavedDesign) => void;
  deleteDesign: (designId: string) => void;
  getSavedDesigns: () => SavedDesign[];
}

export const useCustomizationStore = create<CustomizationState>()(
  persist(
    (set, get) => ({
      selectedProductId: mockProducts[0].id,
      products: mockProducts,
      selectedProduct: mockProducts[0],
      customizations: {},
      currentDesign: null,
      savedDesigns: [],

      selectProduct: (id: string) => {
        const product = mockProducts.find((p) => p.id === id);
        if (product) {
          set({
            selectedProductId: id,
            selectedProduct: product,
            customizations: {},
            currentDesign: null,
          });
        }
      },

      updateCustomization: (
        part: string,
        updates: Partial<PartCustomization>
      ) => {
        set((state) => ({
          customizations: {
            ...state.customizations,
            [part]: {
              ...state.customizations[part],
              ...updates,
            },
          },
          currentDesign: null,
        }));
      },

      resetCustomization: () => {
        set({
          customizations: {},
          currentDesign: null,
        });
      },

      saveCurrentDesign: async (name: string, tags: string[] = []) => {
        const state = get();
        const newDesign: SavedDesign = {
          id: `design-${Date.now()}`,
          userId: "user-1",
          productId: state.selectedProductId,
          name,
          description: `Custom ${
            state.selectedProduct?.name || "Sneaker"
          } Design`,
          customizations: { ...state.customizations },
          tags,
          created_at: new Date().toISOString(),
          previewImage: "img",
        };

        const updatedDesigns = [...state.savedDesigns, newDesign];

        set({
          currentDesign: newDesign,
          savedDesigns: updatedDesigns,
        });

        return newDesign;
      },

      loadDesign: (design: SavedDesign) => {
        const product = mockProducts.find((p) => p.id === design.productId);
        
        // FIX: Filter out undefined values from customizations
        const validCustomizations: Record<string, PartCustomization> = {};
        
        for (const [key, value] of Object.entries(design.customizations)) {
          if (value !== undefined) {
            validCustomizations[key] = value;
          }
        }
        
        set({
          selectedProductId: design.productId,
          selectedProduct: product || mockProducts[0],
          customizations: validCustomizations, // Use filtered version
          currentDesign: design,
        });
      },

      deleteDesign: (designId: string) => {
        const state = get();
        const updatedDesigns = state.savedDesigns.filter(
          (design) => design.id !== designId
        );

        set({
          savedDesigns: updatedDesigns,
          currentDesign:
            state.currentDesign?.id === designId ? null : state.currentDesign,
        });
      },

      getSavedDesigns: () => {
        return get().savedDesigns;
      },
    }),
    {
      name: "customization-storage",
      migrate: (persistedState: any, version: number) => {
        console.log("Migrating customization store...");

        if (persistedState?.products?.[0]?.name === "Air Max 90") {
          console.log("Clearing old mock data...");
          return {
            selectedProductId: mockProducts[0].id,
            products: mockProducts,
            selectedProduct: mockProducts[0],
            customizations: {},
            currentDesign: null,
            savedDesigns: [],
          };
        }

        return persistedState;
      },
    }
  )
);

// REMOVE these duplicate type definitions since you're importing from "@/types"
// export interface Product { ... }
// export interface PartCustomization { ... }
// export interface SavedDesign { ... }
// export interface User { ... }
// export interface AuthState { ... }