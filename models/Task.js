import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true }, // Auth.js ki ID yahan save hogi
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
