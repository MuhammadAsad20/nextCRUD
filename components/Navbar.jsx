"use client";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Navbar({ session }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      {/* lg:ml-64 add kiya taake sidebar ki jagah chorr de */}
      <div className="flex h-20 items-center justify-between px-6 lg:px-10 lg:ml-64">
        
        {/* Left Side: Page Title ya Search (Optional) */}
        <div className="hidden md:block">
           <h2 className="text-slate-400 font-medium text-sm tracking-widest uppercase">Task Manager</h2>
        </div>

        {/* Right Side: User Actions */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Notifications */}
          <div className="relative cursor-pointer group p-2 hover:bg-slate-900 rounded-full transition-all">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
          </div>

          <div className="h-6 w-[1px] bg-slate-800"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white tracking-tight">
                {session?.user?.name || "Admin User"}
              </p>
              <Badge 
                variant="outline" 
                className="text-[10px] py-0 border-indigo-500/30 text-indigo-400 bg-indigo-500/5 shadow-sm shadow-indigo-500/10"
              >
                {session?.user?.role === 'admin' ? 'PRO ADMIN' : 'USER'}
              </Badge>
            </div>
            
            {/* Avatar Style - Premium Gradient */}
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center border border-indigo-400/20 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform cursor-pointer">
               <User className="text-white w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
