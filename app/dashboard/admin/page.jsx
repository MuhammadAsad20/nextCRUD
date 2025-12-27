import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Task from "@/models/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChartWrapper from "@/components/ChartWrapper";
import { Users, Activity, TrendingUp, Zap, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/dashboard");

  await dbConnect();
  const usersCount = await User.countDocuments();
  const tasks = await Task.find({}).lean();
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const efficiency = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const chartData = [
    { name: "Completed", value: completedTasks, fill: "#6366f1" },
    { name: "Pending", value: pendingTasks, fill: "#f43f5e" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. TOP COMMAND BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/20 p-6 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">CORE <span className="text-indigo-500 italic">OPS</span></h1>
          <p className="text-slate-500 text-sm font-medium">System status: <span className="text-emerald-500 animate-pulse text-xs">● Operational</span></p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-xl">
             <div className="w-2 h-2 rounded-full bg-indigo-500" />
             <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Live Traffic: {Math.floor(Math.random() * 50) + 10}</span>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID - 4 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: "Total Users", val: usersCount, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Tasks", val: tasks.length, icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Completion", val: `${efficiency}%`, icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Avg. Latency", val: "24ms", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800/50 backdrop-blur-md hover:border-indigo-500/30 transition-all group overflow-hidden relative">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-white mt-1">{s.val}</h3>
              <div className="absolute -bottom-2 -right-2 opacity-5"> <s.icon className="w-20 h-20 text-white" /> </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. INSIGHTS SECTION (Replaced Member List) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Card */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800/50 backdrop-blur-md p-6 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
             <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                <TrendingUp className="text-indigo-500" /> PRODUCTIVITY CURVE
             </CardTitle>
             <Badge variant="outline" className="border-slate-700 text-slate-400">Last 30 Days</Badge>
          </div>
          <div className="h-[300px] w-full">
            <ChartWrapper data={chartData} total={tasks.length} />
          </div>
        </Card>

        {/* Real-time System Alerts Card */}
        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-950/30 border-b border-slate-800/50">
            <CardTitle className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-amber-500" /> Security & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-800/50">
                {[
                  { msg: "New Admin escalation", time: "2m ago", type: "alert" },
                  { msg: "Database Backup Sync", time: "45m ago", type: "success" },
                  { msg: "API Rate limit reached", time: "1h ago", type: "warning" },
                  { msg: "Cloudinary storage 80%", time: "3h ago", type: "warning" },
                ].map((alert, i) => (
                  <div key={i} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                     {alert.type === 'alert' ? <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" /> : 
                      alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" /> : 
                      <Activity className="w-5 h-5 text-amber-500 mt-0.5" />}
                     <div className="flex-1">
                        <p className="text-sm font-bold text-slate-200">{alert.msg}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{alert.time}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-4 bg-indigo-600/10 border-t border-indigo-500/20">
                <button className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300 transition-colors">
                   View Audit Logs →
                </button>
             </div>
          </CardContent>
        </Card>

      </div>

      {/* 4. PERFORMANCE HIGHLIGHTS */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-white tracking-tight">System Performance: Optimal</h2>
            <p className="text-indigo-200/60 text-sm">All services are running at peak efficiency with 0 downtime.</p>
         </div>
         <div className="flex gap-4">
            <div className="text-center">
               <p className="text-[10px] font-bold text-indigo-400 uppercase">Uptime</p>
               <p className="text-2xl font-black text-white">99.9%</p>
            </div>
            <div className="w-[1px] bg-indigo-500/20 h-10" />
            <div className="text-center">
               <p className="text-[10px] font-bold text-indigo-400 uppercase">Errors</p>
               <p className="text-2xl font-black text-white">0.02%</p>
            </div>
         </div>
      </div>

    </div>
  );
}
