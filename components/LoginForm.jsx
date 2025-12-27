"use client";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password!");
      setLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-400/10 border border-red-400/20 text-red-400 p-3 rounded-2xl text-xs text-center animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2 group">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              type="email" 
              placeholder="name@company.com" 
              onChange={(e) => setEmail(e.target.value)} 
              className="pl-11 bg-slate-900/50 border-slate-800 h-12 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition-all border-slate-800 shadow-inner"
              required 
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2 group">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)} 
              className="pl-11 bg-slate-900/50 border-slate-800 h-12 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition-all border-slate-800 shadow-inner"
              required 
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] mt-4"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Verifying...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Sign In</span>
            <LogIn className="w-4 h-4" />
          </div>
        )}
      </Button>
    </form>
  );
}
