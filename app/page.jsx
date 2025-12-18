import TaskManager from "@/components/TaskManager";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      {session ? (
        // ✅ Agar logged in hai toh Task Manager dikhao
        <div className="w-full max-w-2xl">
          <h1 className="text-white text-xl mb-6 opacity-60">
            Welcome back, <span className="text-indigo-400 font-bold">{session.user.name}</span>
          </h1>
          <TaskManager />
        </div>
      ) : (
        // ❌ Agar login nahi hai toh yeh Section dikhao
        <div className="text-center space-y-8 bg-slate-900/50 p-12 rounded-3xl border border-slate-800 shadow-2xl max-w-lg">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold text-white tracking-tight">
              Focus <span className="text-indigo-500">Board</span>
            </h1>
            <p className="text-slate-400 text-lg">
              The ultimate space to organize your tasks and boost productivity. 
              Sign in to start your journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/Login" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
            >
              Login to Start
            </Link>
            <Link 
              href="/Signup" 
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-slate-700"
            >
              Create Account
            </Link>
          </div>
          
          <p className="text-slate-500 text-xs uppercase tracking-widest pt-4">
            Trusted by 100+ developers in 2025
          </p>
        </div>
      )}
    </main>
  );
}
