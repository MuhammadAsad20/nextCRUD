"use client";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";
import { Trash2, Edit3, Search, Plus, Loader2, Tag, Save, ListFilter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // ✅ Tabs for Filtering
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TaskManager() {
  // --- States ---
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // ✅ Filter State
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Edit States
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (err) {
      toast.error("Sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Logic: Filtering & Sorting ---
  const processedTasks = useMemo(() => {
    // 1. Search Filter
    let result = tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Category Filter (Tabs)
    if (activeFilter !== "All") {
      result = result.filter((t) => t.category === activeFilter);
    }

    // 3. Priority Sorting
    const priority = { Urgent: 1, Work: 2, Personal: 3, General: 4 };
    return result.sort((a, b) => {
      const scoreA = priority[a.category] || 5;
      const scoreB = priority[b.category] || 5;
      if (scoreA !== scoreB) return scoreA - scoreB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [search, tasks, activeFilter]);

  // --- Action Handlers ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input, category }),
      });
      if (res.ok) {
        setInput("");
        fetchTasks();
        toast.success(`Task added to ${category}`);
      }
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const toggleTask = async (task) => {
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) fetchTasks();
  };

  const deleteTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.info("Task deleted");
    }
  };

  const handleEditSave = async () => {
    const res = await fetch(`/api/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editText }),
    });
    if (res.ok) {
      setIsDialogOpen(false);
      fetchTasks();
      toast.success("Updated");
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors theme="dark" />

      {/* --- Search & Add Bar --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
          <Input
            className="pl-12 bg-slate-900 border-slate-800 text-slate-100 rounded-2xl h-12 focus-visible:ring-indigo-500"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
          <Input
            className="bg-transparent border-none text-slate-100 h-10 focus-visible:ring-0 flex-1 placeholder:text-slate-600"
            placeholder="New task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Select value={category} onValueChange={(val) => setCategory(val)}>
            <SelectTrigger className="w-full sm:w-[130px] bg-slate-800 border-slate-700 text-slate-200 rounded-xl h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-10 px-6 font-bold shadow-lg shadow-indigo-500/20">
            <Plus size={20} />
          </Button>
        </form>
      </div>

      {/* --- ✅ Filter Tabs --- */}
      <div className="flex items-center gap-4">
        <ListFilter size={18} className="text-slate-500 hidden sm:block" />
        <Tabs defaultValue="All" className="w-full" onValueChange={(val) => setActiveFilter(val)}>
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-11 w-full sm:w-auto rounded-xl">
            <TabsTrigger value="All" className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-5">All</TabsTrigger>
            <TabsTrigger value="Urgent" className="rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white px-5">Urgent</TabsTrigger>
            <TabsTrigger value="Work" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white px-5">Work</TabsTrigger>
            <TabsTrigger value="Personal" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-5">Personal</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* --- Task List --- */}
      <div className="grid gap-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full bg-slate-900 rounded-2xl" />)
        ) : (
          <AnimatePresence mode="popLayout">
            {processedTasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task)} className="w-6 h-6 border-slate-700 data-[state=checked]:bg-indigo-600 border-2" />
                  <div className="flex flex-col">
                    <span className={`text-lg font-medium ${task.completed ? "text-slate-600 line-through" : "text-slate-100"}`}>{task.title}</span>
                    <Badge className={`w-fit mt-1 text-[10px] border-none ${
                      task.category === 'Urgent' ? 'bg-red-500/10 text-red-400' : 
                      task.category === 'Work' ? 'bg-blue-500/10 text-blue-400' :
                      task.category === 'Personal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Tag size={10} className="mr-1" /> {task.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingTask(task); setEditText(task.title); setIsDialogOpen(true); }} className="text-slate-400 hover:text-indigo-400"><Edit3 size={18} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* --- Edit Modal --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-3xl shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-bold font-mono">Update Task</DialogTitle></DialogHeader>
          <div className="py-4">
            <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus-visible:ring-indigo-500" onKeyDown={(e) => e.key === "Enter" && handleEditSave()} />
          </div>
          <DialogFooter><Button onClick={handleEditSave} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 font-bold"><Save size={18} className="mr-2" /> Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
