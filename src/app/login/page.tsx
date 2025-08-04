"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (login(email, password)) {
        setError("");
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, they should be redirected by AuthGuard

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form 
        className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-[#23a69a] text-center mb-8">VibeRMM</h1>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-[#23a69a] focus:border-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <button 
              type="button"
              className="text-sm text-[#23a69a] hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-[#23a69a] focus:border-transparent"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          className={`w-full py-2 px-4 rounded bg-[#23a69a] text-white font-medium hover:bg-[#1e968b] transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or</span>
          </div>
        </div>
        
        <button 
          type="button" 
          className="w-full py-2 px-4 rounded border border-gray-600 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
        >
          Login with SSO
        </button>
        
        <div className="text-center text-xs text-gray-500 mt-6">
          Demo credentials: admin@vibermm.com / admin
        </div>
      </form>
    </div>
  );
}
