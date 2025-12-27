// app/dashboard/profile/actions.js
"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function updateProfile(formData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  await dbConnect();

  const updateData = {};

  if (formData.get("name")) updateData.name = formData.get("name");
  if (formData.get("imageUrl")) updateData.image = formData.get("imageUrl");

  if (formData.get("newPassword")) {
    updateData.password = await bcrypt.hash(formData.get("newPassword"), 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    updateData,
    { new: true }
  ).select("-password");

  return {
    success: true,
    user: {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
    },
  };
}
