export interface Product {
  id: string;
  name: string;
  baseImage: string;
  customizableParts: string[];
  options: {
    colors: string[];
    materials: string[];
    textures?: string[];
  };
  price: number;
  description?: string;
}

export interface PartCustomization {
  color?: string;
  material?: string;
  texture?: string;
  text?: string;
  textColor?: string;
}

export interface SavedDesign {
  id: string;
  userId: string;
  productId: string;
  name: string;
  customizations: Record<string, PartCustomization>;
  previewImage?: string;
  tags: string[];
  created_at: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}