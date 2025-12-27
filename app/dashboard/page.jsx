import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";

export default async function MyOverview() {
  const session = await auth();
  await dbConnect();

  // Database se direct data fetching (Server Component)
  const total = await Task.countDocuments({ userId: session.user.id });
  const completed = await Task.countDocuments({ userId: session.user.id, completed: true });
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Welcome, <span className="text-indigo-500">{session?.user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Here is what's happening with your tasks today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={total} icon={<ListTodo className="text-indigo-500" />} desc="All time tasks" />
        <StatCard title="Completed" value={completed} icon={<CheckCircle2 className="text-emerald-500" />} desc="Tasks finished" />
        <StatCard title="Pending" value={pending} icon={<Clock className="text-rose-500" />} desc="Needs attention" />
        
        {/* Progress Card */}
        <Card className="bg-indigo-600 border-none shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 text-white" />
          </div>
          <CardContent className="p-6">
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Efficiency</p>
            <h3 className="text-4xl font-black text-white mt-2">{rate}%</h3>
            <p className="text-indigo-200 text-xs mt-1 font-medium">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-md p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              Focus Areas
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {pending > 0 ? (
              <p className="text-slate-400 text-sm leading-relaxed">
                You have <span className="text-white font-bold">{pending} pending tasks</span>. 
                Prioritize them to reach your goal for December 2025.
              </p>
            ) : (
              <p className="text-emerald-400 text-sm font-medium italic">
                Awesome! You are all caught up for now.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Small Component for Stats
function StatCard({ title, value, icon, desc }) {
  return (
    <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-md hover:border-slate-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">{icon}</div>
          <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-500 uppercase tracking-tighter">Live</Badge>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        <p className="text-slate-500 text-xs mt-1 font-medium">{title}</p>
      </CardContent>
    </Card>
  );
}
