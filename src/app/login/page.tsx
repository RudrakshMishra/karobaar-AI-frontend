"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("All fields are required");
    }

    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (res?.error) {
        throw new Error(res.error);
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F0EA] p-4 text-[#050505] font-sans selection:bg-[#1A1A1A] selection:text-[#050505]">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[rgba(212,163,115,0.15)] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpg" alt="Karobaar AI Logo" className="h-16 w-auto object-contain mix-blend-multiply mx-auto mb-4" />
          <p className="text-[rgba(0,0,0,0.6)] text-sm mt-1">Log in to your Karobaar AI dash</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-[#FF4D4D] bg-[rgba(255,77,77,0.1)] border border-[#FF4D4D] rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-[rgba(0,0,0,0.8)] mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] focus:border-[rgba(0,0,0,0.4)] focus:ring-1 focus:ring-[#FFFFFF] text-[#050505] rounded-lg px-3.5 py-2.5 transition-all outline-none"
              placeholder="you@example.com" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-[rgba(0,0,0,0.8)]">Password</label>
              <Link href="#" className="text-sm text-[#050505] hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-[#E8E6DF] border border-[rgba(212,163,115,0.2)] focus:border-[rgba(0,0,0,0.4)] focus:ring-1 focus:ring-[#FFFFFF] text-[#050505] rounded-lg px-3.5 py-2.5 transition-all outline-none"
              placeholder="••••••••" 
            />
          </div>
          
          <div className="flex items-center mt-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-[rgba(212,163,115,0.2)] bg-[#E8E6DF] text-[#050505] focus:ring-[#FFFFFF]"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[rgba(0,0,0,0.8)]">Remember me</label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-[#1A1A1A] text-[#050505] font-bold rounded-lg mt-6 hover:shadow-[0_0_20px_rgba(212,163,115,0.4)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-grow border-t border-[#D6D3CB]"></div>
          <span className="px-3 text-xs text-[rgba(0,0,0,0.6)] uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-[#D6D3CB]"></div>
        </div>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full h-11 mt-6 bg-[#F2F0EA] border border-[rgba(0,0,0,0.12)] text-[#050505] font-medium rounded-lg hover:bg-[#E8E6DF] transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm text-[rgba(0,0,0,0.6)] mt-8">
          Don't have an account? <Link href="/signup" className="text-[#050505] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
