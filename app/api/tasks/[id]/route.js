export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const session = await auth();
  const { id } = await params; // Next.js 16 fix
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  try {
    const body = await req.json();
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true }
    );
    return NextResponse.json(task);
  } catch (err) {
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await auth();
  const { id } = await params;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  try {
    await Task.findOneAndDelete({ _id: id, userId: session.user.id });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Delete error" }, { status: 500 });
  }
}
