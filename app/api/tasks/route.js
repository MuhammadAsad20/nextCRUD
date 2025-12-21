export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Node.js runtime ensure karein

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// --- GET Method: Saare tasks fetch karne ke liye ---
export async function GET() {
  try {
    const session = await auth();
    
    // Auth check
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Sirf logged-in user ke tasks find karein
    const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("GET Tasks Error:", err);
    return NextResponse.json({ error: "Server error fetching tasks" }, { status: 500 });
  }
}

// --- POST Method: Naya task create karne ke liye ---
export async function POST(req) {
  try {
    const session = await auth();
    
    // Auth check
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Request body se data nikaalein
    const { title, category } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Task create karein
    const task = await Task.create({
      title,
      category: category || "General", // Frontend se category na aaye toh "General" save ho
      userId: session.user.id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST Task Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
