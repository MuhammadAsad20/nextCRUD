import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
  category: { type: String, default: "General" }, 
}, { timestamps: true });

// ✅ Next.js 16/Turbopack Fix: Delete existing model if it exists to force schema update
if (mongoose.models.Task) {
  delete mongoose.models.Task;
}

export default mongoose.model("Task", TaskSchema);
