import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
           <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2">Version 2.0 Stable (2025)</Badge>
           <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
            Focus <span className="text-indigo-600">Board.</span>
           </h1>
           <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
            The professional space to organize your tasks, manage teams, and boost 2025 productivity.
           </p>
        </div>

        <div className="flex gap-4 justify-center">
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 text-lg font-bold rounded-2xl">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/Login">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-10 text-lg font-bold rounded-2xl">
                  Get Started
                </Button>
              </Link>
              <Link href="/Signup">
                <Button size="lg" variant="outline" className="border-slate-800 text-white h-14 px-10 text-lg font-bold rounded-2xl hover:bg-slate-900">
                  Join Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Chota Badge component for Hero
function Badge({ children, className }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    )
}
