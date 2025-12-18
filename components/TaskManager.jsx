"use client";
import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    const res = await fetch("/api/tasks");
    const data = await res.json();
    if (Array.isArray(data)) setTasks(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: input }),
    });
    if (res.ok) {
      setInput("");
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t._id !== id));
  };

  const saveEdit = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editText }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchTasks();
    }
  };

  const toggleTask = async (task) => {
    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  return (
    <div className="max-w-xl mx-auto bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
      {/* Dynamic Dark Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 p-8">
        <h2 className="text-white text-3xl font-extrabold text-center tracking-tight">Focus Board</h2>
        <p className="text-indigo-100 text-center text-sm mt-2 font-medium opacity-80 italic">Master your workflow</p>
      </div>

      <div className="p-8 space-y-8 bg-[#0f172a]">
        {/* Modern Neon Input */}
        <form onSubmit={addTask} className="flex gap-3">
          <input 
            className="flex-1 bg-slate-900 border border-slate-700 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 shadow-inner" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Add a new mission..."
          />
          <button className="bg-white hover:bg-slate-200 text-black px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center">
            ADD
          </button>
        </form>

        {/* Task Container */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : tasks.length > 0 ? (
            tasks.map(task => (
              <div 
                key={task._id} 
                className="group flex justify-between items-center p-5 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all duration-300"
              >
                <div className="flex-1 flex items-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task)}
                      className="w-6 h-6 rounded-lg border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 cursor-pointer appearance-none checked:bg-purple-600 border-2 transition-all"
                    />
                    {task.completed && <span className="absolute text-white pointer-events-none text-xs">✓</span>}
                  </div>
                  
                  {editingId === task._id ? (
                    <input 
                      className="bg-slate-800 border border-purple-500 px-3 py-1.5 rounded-xl w-full focus:outline-none text-slate-100 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(task._id)}
                    />
                  ) : (
                    <span 
                      className={`text-lg font-medium transition-all duration-500 ${
                        task.completed ? 'line-through text-slate-600 italic' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                {/* Cyberpunk Style Buttons */}
                <div className="flex gap-3 ml-4">
                  {editingId === task._id ? (
                    <button 
                      onClick={() => saveEdit(task._id)} 
                      className="text-emerald-400 hover:text-emerald-300 font-black text-xs tracking-widest uppercase p-2"
                    >
                      SAVE
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingId(task._id);
                        setEditText(task.title);
                      }} 
                      className="text-slate-500 hover:text-purple-400 transition-colors p-2"
                    >
                      EDIT
                    </button>
                  )}

                  <button 
                    onClick={() => deleteTask(task._id)} 
                    className="text-slate-500 hover:text-red-500 transition-colors p-2"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-medium">Your mission list is empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Futuristic Footer */}
      <div className="bg-slate-950/50 p-5 border-t border-slate-800 flex justify-center">
        <div className="px-4 py-1 rounded-full bg-slate-900 border border-slate-800">
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            Active Tasks: {tasks.filter(t => !t.completed).length}
          </p>
        </div>
      </div>
    </div>
  );
}
