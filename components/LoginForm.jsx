"use client";
import { signIn, getSession } from "next-auth/react"; // getSession add kiya
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Credentials ke zariye sign-in
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Manual redirect handle karenge
    });

    if (result?.error) {
      alert("Invalid credentials!");
      setLoading(false);
    } else {
      // 2. Login ke baad foran naya session fetch karein taake 'role' mil jaye
      const session = await getSession();

      // 3. Role-based Redirection Logic
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

      router.refresh(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-slate-300 text-sm font-medium ml-1">Email Address</label>
        <input 
          type="email" 
          placeholder="name@company.com" 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-slate-500 transition-all" 
          required 
        />
      </div>

      <div className="space-y-2">
        <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-slate-500 transition-all" 
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-2"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
