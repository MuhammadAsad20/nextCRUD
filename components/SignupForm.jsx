"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) router.push("/login");
    else alert("Signup failed!");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 border rounded shadow">
      <h2 className="text-xl font-bold">Create Account</h2>
      <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} className="border p-2" required />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="border p-2" required />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="border p-2" required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Sign Up</button>
    </form>
  );
}
