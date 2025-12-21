import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Task from "@/models/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ChartWrapper from "@/components/ChartWrapper"; // Wrapper import karein

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const tasks = await Task.find({}).lean();

  const chartData = [
    { name: "Completed", value: tasks.filter(t => t.completed).length, fill: "#4f46e5" },
    { name: "Pending", value: tasks.length - tasks.filter(t => t.completed).length, fill: "#e11d48" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 space-y-10 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black tracking-tight">System <span className="text-indigo-500">Analytics</span></h1>
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2">2025 Stable</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Chart Wrapper call karein jo ssr:false handle karta hai */}
          <ChartWrapper data={chartData} total={tasks.length} />
        </div>
        <Card className="bg-slate-900 border-slate-800 flex flex-col justify-center items-center p-6 text-center">
             <CardHeader><CardTitle className="text-slate-400 text-sm uppercase">Growth Rate</CardTitle></CardHeader>
             <CardContent>
                <h3 className="text-6xl font-black">+{users.length * 12}%</h3>
                <p className="text-emerald-500 font-bold mt-2">Active Users: {users.length}</p>
             </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <CardHeader className="bg-slate-900/50 border-b border-slate-800 p-6">
          <CardTitle className="text-xl">User Management <Badge className="bg-slate-800 text-indigo-400 ml-2">{users.length}</Badge></CardTitle>
        </CardHeader>
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Identity</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Joined On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id.toString()} className="border-slate-800 hover:bg-indigo-500/5 transition-all">
                <TableCell className="py-4">
                  <div className="font-bold text-slate-200">{u.name}</div>
                  <div className="text-slate-500 text-xs">{u.email}</div>
                </TableCell>
                <TableCell>
                  <Badge className={u.role === 'admin' ? 'bg-indigo-600' : 'text-slate-400 border-slate-700'}>{u.role?.toUpperCase() || 'USER'}</Badge>
                </TableCell>
                <TableCell suppressHydrationWarning className="text-right text-slate-500 font-mono text-xs">
                  {new Date(u.createdAt).toDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
