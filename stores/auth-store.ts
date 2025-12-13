// // lib/store/auth-store.ts
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, name?: string) => Promise<void>;
//   logout: () => void;
//   initializeFromStorage: () => void;
// }

// // Custom storage that syncs with localStorage
// const authStorage = {
//   getItem: (name: string): string | null => {
//     if (typeof window === "undefined") return null;

//     const token = localStorage.getItem("auth-token");
//     const userStr = localStorage.getItem("user");

//     if (token && userStr) {
//       return JSON.stringify({
//         state: {
//           user: JSON.parse(userStr),
//           token,
//           isAuthenticated: true,
//         },
//       });
//     }

//     return localStorage.getItem(name);
//   },

//   setItem: (name: string, value: string) => {
//     if (typeof window === "undefined") return;

//     const state = JSON.parse(value).state;

//     // Sync with localStorage
//     if (state.token) {
//       localStorage.setItem("auth-token", state.token);
//     }
//     if (state.user) {
//       localStorage.setItem("user", JSON.stringify(state.user));
//     }

//     localStorage.setItem(name, value);
//   },

//   removeItem: (name: string) => {
//     if (typeof window === "undefined") return;

//     // Clear from localStorage
//     localStorage.removeItem("auth-token");
//     localStorage.removeItem("user");
//     localStorage.removeItem(name);
//   },
// };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,

//       login: async (email: string, password: string) => {
//         try {
//           const response = await fetch("/api/auth/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//           });

//           const data = await response.json();

//           if (!data.success) {
//             throw new Error(data.message);
//           }

//           const { token, user } = data.data;

//           // Update state
//           set({
//             user,
//             token,
//             isAuthenticated: true,
//           });

//           return data;
//         } catch (error) {
//           throw error;
//         }
//       },

//       register: async (email: string, password: string, name?: string) => {
//         try {
//           const response = await fetch("/api/auth/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password, name }),
//           });

//           const data = await response.json();

//           if (!data.success) {
//             throw new Error(data.message);
//           }

//           const { token, user } = data.data;

//           set({
//             user,
//             token,
//             isAuthenticated: true,
//           });

//           return data;
//         } catch (error) {
//           throw error;
//         }
//       },

//       logout: () => {
//         // Clear from localStorage
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("auth-token");
//           localStorage.removeItem("user");
//         }

//         set({
//           user: null,
//           token: null,
//           isAuthenticated: false,
//         });
//       },

//       initializeFromStorage: () => {
//         if (typeof window === "undefined") return;

//         const token = localStorage.getItem("auth-token");
//         const userStr = localStorage.getItem("user");

//         if (token && userStr) {
//           set({
//             user: JSON.parse(userStr),
//             token,
//             isAuthenticated: true,
//           });
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => authStorage),
//     }
//   )
// );
// stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

// Mock API function (replace with real API in production)
const mockLoginAPI = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (email === 'test@example.com' && password === 'password123') {
    return {
      success: true,
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJpYXQiOjE2MzAwMDAwMDAsImV4cCI6MTk0NTM2MDAwMH0.mock-jwt-token-for-development'
      }
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegisterAPI = async (email: string, password: string, name?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      user: {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0]
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im5ldy11c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxOTQ1MzYwMDAwfQ.mock-jwt-token-for-new-user'
    }
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // In production: Replace with real API call
          // const response = await fetch('/api/auth/login', {...})
          const result = await mockLoginAPI(email, password);
          
          set({
            user: result.data.user,
            token: result.data.token,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Store in localStorage for manual access if needed
          if (typeof window !== 'undefined') {
            localStorage.setItem('jwt_token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (email: string, password: string, name?: string) => {
        set({ isLoading: true });
        
        try {
          const result = await mockRegisterAPI(email, password, name);
          
          set({
            user: result.data.user,
            token: result.data.token,
            isAuthenticated: true,
            isLoading: false
          });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('jwt_token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage'); // Clear Zustand storage too
        }
      },
      
      initializeAuth: () => {
        if (typeof window === 'undefined') return;
        
        // Check if we have auth data in localStorage
        const token = localStorage.getItem('jwt_token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true
            });
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      // Store in localStorage for persistence
    }
  )
);