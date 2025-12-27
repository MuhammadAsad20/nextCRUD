"use server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId) {
  await dbConnect();
  await User.findByIdAndDelete(userId);
  revalidatePath("/dashboard/admin/users");
}

export async function updateRole(userId, newRole) {
  await dbConnect();
  await User.findByIdAndUpdate(userId, { role: newRole });
  revalidatePath("/dashboard/admin/users");
}
