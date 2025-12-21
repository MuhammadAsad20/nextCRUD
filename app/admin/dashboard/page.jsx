import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Task from "@/models/Task";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminCharts from "@/components/AdminCharts"; // Naya Component

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const tasks = await Task.find({}).lean();

  // Data Formatting for Charts
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const chartData = [
    { name: "Completed", value: completedTasks, fill: "#4f46e5" },
    { name: "Pending", value: pendingTasks, fill: "#e11d48" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">System <span className="text-indigo-500">Analytics</span></h1>
          <p className="text-slate-400 mt-1">Real-time overview of your platform performance.</p>
        </div>
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2 text-md">2025 v2.0 Stable</Badge>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminCharts data={chartData} total={tasks.length} />
        </div>
        <Card className="bg-slate-900 border-slate-800 shadow-2xl flex flex-col justify-center items-center p-6 text-center">
             <CardHeader>
                <CardTitle className="text-slate-400 text-sm uppercase tracking-widest">Growth Rate</CardTitle>
             </CardHeader>
             <CardContent>
                <h3 className="text-6xl font-black text-white">+{users.length * 12}%</h3>
                <p className="text-emerald-500 font-bold mt-2">Active Users: {users.length}</p>
             </CardContent>
        </Card>
      </div>

      {/* Modern User Table */}
      <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
        <CardHeader className="bg-slate-900/50 border-b border-slate-800">
          <CardTitle className="text-white text-xl flex items-center gap-2">
            User Management <Badge variant="secondary">{users.length}</Badge>
          </CardTitle>
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
              <TableRow key={u._id} className="border-slate-800 hover:bg-indigo-500/5 transition-all">
                <TableCell>
                  <div className="font-bold text-slate-200">{u.name}</div>
                  <div className="text-slate-500 text-xs">{u.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === 'admin' ? 'default' : 'outline'} className={u.role === 'admin' ? 'bg-indigo-600' : 'text-slate-400 border-slate-700'}>
                    {u.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-slate-500 font-mono text-xs">
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
