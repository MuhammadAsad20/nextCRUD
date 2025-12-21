import TaskManager from "@/components/TaskManager";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Welcome back, <span className="text-indigo-500">{session.user.name}</span>
        </h1>
        <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">
            {new Date().toDateString()}
        </p>
      </header>
      
      {/* Aapka optimized Task Manager */}
      <TaskManager />
    </div>
  );
}
