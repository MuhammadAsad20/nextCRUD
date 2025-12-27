"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Loader2, Mail, Lock, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ---------------- PREVIEW CLEANUP ---------------- */
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleImageChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  /* ---------------- CLOUDINARY UPLOAD ---------------- */
  const uploadToCloudinary = async (imageFile) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Missing Cloudinary Configuration");
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, image: imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      router.push("/Login");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-2xl text-center text-xs animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      {/* 1. Avatar Picker - Modern Style */}
      <div className="flex flex-col items-center justify-center space-y-3 mb-8">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full border-2 border-slate-800 bg-slate-900/50 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-indigo-500/50 shadow-2xl">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <UserCircle2 className="w-14 h-14 text-slate-700" />
            )}
            
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Camera className="w-6 h-6 text-white/80" />
            </div>
          </div>

          <label className="absolute bottom-1 right-1 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-500 transition-all shadow-lg border-4 border-slate-950 active:scale-90">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Profile Picture</span>
      </div>

      {/* 2. Form Inputs with Icons */}
      <div className="space-y-4">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <Input
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-11 bg-slate-900/50 border-slate-800 h-12 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition-all"
            required
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-11 bg-slate-900/50 border-slate-800 h-12 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition-all"
            required
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <Input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-11 bg-slate-900/50 border-slate-800 h-12 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition-all"
            required
          />
        </div>
      </div>

      {/* 3. Enhanced Button */}
      <Button 
        disabled={loading} 
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] mt-4"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Creating...</span>
          </div>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
