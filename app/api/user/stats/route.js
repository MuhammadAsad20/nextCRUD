import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  
  // Sirf logged-in user ke tasks dhoondna
  const totalTasks = await Task.countDocuments({ userId: session.user.id });
  const completedTasks = await Task.countDocuments({ userId: session.user.id, completed: true });
  const pendingTasks = totalTasks - completedTasks;

  return NextResponse.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  });
}
