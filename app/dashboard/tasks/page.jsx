import TaskManager from "@/components/TaskManager"; // Aapka existing component
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ListTodo, Sparkles } from "lucide-react";

export default async function MyTasksPage() {
  const session = await auth();
  
  // Security Check
  if (!session) redirect("/Login");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header Section with Theme Elements */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <ListTodo className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/70">Workspace</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            My <span className="text-indigo-500">Tasks</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage, track and complete your daily objectives.
          </p>
        </div>

        {/* 2. Quick Info Badge */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">Productivity Mode</p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">Active for 2025</p>
          </div>
        </div>
      </div>

      {/* 3. Your Task Manager Component */}
      <div className="relative group">
        {/* Subtle Background Glow for the component */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-[2rem] blur-2xl opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          <TaskManager />
        </div>
      </div>

      {/* 4. Footer Hint */}
      <p className="text-center text-slate-600 text-[10px] uppercase tracking-[0.4em] pt-10">
        End-to-End Encrypted • Real-time Sync
      </p>
    </div>
  );
}
