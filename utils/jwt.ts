// utils/jwt.ts
// Utility functions for JWT token handling

// Mock JWT token verification (in production, use a proper JWT library)
export const verifyToken = (token: string): boolean => {
  if (!token) return false;

  try {
    // Simple validation - in production, decode and verify signature
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Check if token is expired (mock)
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      console.log("Token expired");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

export const getUserFromToken = (token: string): any => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    return null;
  }
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt_token", token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
  }
};
