// app/(auth)/login/page.tsx
import { LoginForm } from "@/app/(auth)/LoginForm";
import { redirect } from "next/navigation";

// Check for existing token on server side
const checkAuth = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt_token");
    return !!token;
  }
  return false;
};

export default function LoginPage() {
  // Check if already logged in
  const isAuthenticated = checkAuth();

  if (isAuthenticated) {
    redirect("/studio");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sneaker Studio
        </h1>
        <p className="text-gray-600">Design your perfect custom sneakers</p>
      </div>

      <LoginForm />

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Login persists across browser sessions using JWT tokens</p>
        <p className="mt-1">Token stored securely in localStorage</p>
      </div>
    </div>
  );
}
