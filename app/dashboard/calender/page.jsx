import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { Calendar } from "@/components/ui/calendar"; // Shadcn component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export default async function CalendarPage() {
  const session = await auth();
  await dbConnect();
  
  // Tasks fetch karein jo abhi tak complete nahi hue
  const tasks = await Task.find({ 
    userId: session.user.id,
    completed: false 
  }).lean();

  // Tasks ki dates ko format karein taake Calendar unhe highlight kar sake
  const deadlineDates = tasks.map(task => new Date(task.createdAt)); 

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <CalendarIcon className="text-indigo-500 w-8 h-8" /> Schedule <span className="text-indigo-500">Timeline</span>
        </h1>
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1">2025 Calendar View</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: The Calendar Component */}
        <Card className="lg:col-span-7 bg-slate-900/50 border-slate-800/50 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl">
          <Calendar
            mode="multiple"
            selected={deadlineDates}
            className="rounded-md border-none text-white mx-auto"
            classNames={{
              day_selected: "bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl",
              day_today: "bg-slate-800 text-indigo-400 font-bold",
            }}
          />
        </Card>

        {/* Right Side: Upcoming Deadlines List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 px-2">Upcoming Deadlines</h3>
          {tasks.length > 0 ? (
            tasks.slice(0, 5).map((task) => (
              <Card key={task._id.toString()} className="bg-slate-900/40 border-slate-800/50 hover:border-indigo-500/30 transition-all rounded-2xl group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-200 font-bold group-hover:text-indigo-400 transition-colors">{task.title}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 uppercase font-bold tracking-tighter">
                      <Clock className="w-3 h-3" /> Due: {new Date(task.createdAt).toDateString()}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-slate-600 italic text-sm px-2">No upcoming deadlines found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
