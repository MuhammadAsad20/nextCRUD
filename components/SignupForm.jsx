"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
      } else {
        router.push("/Login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-slate-300 text-sm font-medium ml-1">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-slate-500 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-slate-300 text-sm font-medium ml-1">Email Address</label>
        <input
          type="email"
          placeholder="name@company.com"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-slate-500 transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-slate-300 text-sm font-medium ml-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-slate-500 transition-all"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-2"
      >
        {loading ? "Creating account..." : "Get Started"}
      </button>
    </form>
  );
}
