"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User, Camera, Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { updateProfile } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MyProfile() {
  const { data: session, update } = useSession();

  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPreview(session.user.image || null);
    }
  }, [session]);

  const uploadToCloudinary = async () => {
    if (!file) return "";
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      const imageUrl = await uploadToCloudinary();
      const formData = new FormData();
      formData.append("name", name);
      if (newPassword) formData.append("newPassword", newPassword);
      if (imageUrl) formData.append("imageUrl", imageUrl);

      const result = await updateProfile(formData);

      if (result.success) {
        await update({ ...session, user: result.user });
        toast.success("Profile updated successfully", { id: toastId });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error, { id: toastId });
      }
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[100px]" />
        
        <header className="relative text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-400 mt-2">Update your personal information and security</p>
        </header>

        <form onSubmit={handleSave} className="relative space-y-8">
          {/* --- Avatar Selection UI --- */}
          <div className="flex flex-col items-center group">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-950 p-1 transition-all duration-500 group-hover:border-indigo-500/50 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <User className="w-12 h-12 text-slate-700" />
                    </div>
                  )}
                </div>
              </div>
              
              <label className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-500 p-3 rounded-full cursor-pointer shadow-xl border-4 border-slate-950 transition-all active:scale-90">
                <Camera className="w-5 h-5 text-white" />
                <input hidden type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
                }} />
              </label>
            </div>
            
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{session?.user?.role || "User"}</span>
            </div>
          </div>

          {/* --- Form Inputs --- */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="pl-12 bg-slate-950/50 border-slate-800 h-12 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="pl-12 bg-slate-950/50 border-slate-800 h-12 rounded-2xl text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="pl-12 bg-slate-950/50 border-slate-800 h-12 rounded-2xl text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button 
            disabled={loading} 
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Saving Changes...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
