"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CheckSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { signOut } from "next-auth/react"; // 1. Ye import karein

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Manage Users", icon: Users, href: "/admin/users" },
  { name: "Tasks Control", icon: CheckSquare, href: "/admin/tasks" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AppSidebar({ user }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex-col z-50">
      <div className="p-8">
        <h2 className="text-2xl font-black text-white tracking-tighter italic">
          NEXT<span className="text-indigo-500 underline">CRUD</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                buttonVariants({ variant: isActive ? "default" : "ghost" }),
                "w-full justify-start gap-3 h-12 rounded-xl transition-all",
                isActive 
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
              <span className="font-semibold tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 2. Logout Button Section */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })} // 3. Click handler add kiya
          className={cn(
            buttonVariants({ variant: "ghost" }), 
            "w-full justify-start gap-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 h-12 rounded-xl"
          )}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
