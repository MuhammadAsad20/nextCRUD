export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  try {
    const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  try {
    const { title } = await req.json();
    const newTask = await Task.create({ title, userId: session.user.id });
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Creation error" }, { status: 500 });
  }
}
