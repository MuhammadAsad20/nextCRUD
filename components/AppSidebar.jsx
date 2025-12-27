"use client";
import { 
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter, 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel 
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, BarChart3, LogOut, Database } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AppSidebar({ user }) {
  const isAdmin = user?.role === "admin";

  return (
    // ✅ Yahan !bg-slate-950 aur !border-slate-800 add kiya hai taake white color override ho jaye
    <Sidebar collapsible="icon" className="!bg-slate-950 !border-slate-800 border-r">
      
      {/* Header Area */}
      <SidebarHeader className="h-20 flex items-center justify-center !bg-slate-950 border-b border-slate-800/30">
        <Link href="/">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg border border-indigo-400/30 transition-transform hover:rotate-12">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-black text-indigo-400 text-xl tracking-tighter leading-none">
              Focus<span className="text-white">Board</span>
            </span>
          </div>
        </div>
        </Link>
      </SidebarHeader>

      {/* Content Area */}
      <SidebarContent className="!bg-slate-950 p-3 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-[10px] uppercase tracking-[0.25em] mb-4 px-4 font-bold">Main Dashboard</SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-12 rounded-2xl text-slate-300 hover:!bg-slate-900 hover:!text-white transition-all group border border-transparent hover:border-slate-800">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400" />
                  <span className="font-semibold">Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-2xl text-slate-300 hover:!bg-indigo-600/10 hover:!text-indigo-400 border border-transparent hover:border-indigo-500/20 shadow-indigo-500/5">
                  <Link href="/dashboard/admin">
                    <BarChart3 className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <span className="font-bold tracking-wide italic">Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-12 rounded-2xl text-slate-300 hover:!bg-slate-900 hover:!text-white transition-all group border border-transparent hover:border-slate-800">
                <Link href="/dashboard/tasks">
                  <Users className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400" />
                  <span className="font-semibold">My Task</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-2xl text-slate-300 hover:!bg-indigo-600/10 hover:!text-indigo-400 border border-transparent hover:border-indigo-500/20 shadow-indigo-500/5">
                  <Link href="/dashboard/users">
                    <BarChart3 className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <span className="font-bold tracking-wide italic">Member List</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-12 rounded-2xl text-slate-300 hover:!bg-slate-900 hover:!text-white transition-all group border border-transparent hover:border-slate-800">
                <Link href="/dashboard/profile">
                  <LayoutDashboard className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400" />
                  <span className="font-semibold">My Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Area */}
      <SidebarFooter className="p-4 border-t border-slate-800/30 !bg-slate-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut()} 
              className="h-12 rounded-2xl text-red-400 hover:!bg-red-500/10 hover:!text-red-300 transition-all w-full flex items-center gap-3 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden font-bold tracking-wide">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
