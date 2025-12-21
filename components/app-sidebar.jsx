"use client";
import { 
  LayoutDashboard, 
  Settings, 
  UserCircle, 
  LogOut, 
  ShieldCheck, 
  CheckSquare 
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ user }) {
  const pathname = usePathname();

  const menuItems = [
    { title: "My Tasks", url: "/dashboard", icon: CheckSquare },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-slate-800 bg-slate-900 shadow-2xl">
      <SidebarHeader className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="text-white font-black tracking-tight text-lg uppercase">Focus<span className="text-indigo-500 text-sm">v2</span></span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 px-2 py-4 uppercase text-[10px] tracking-[0.2em] font-bold">General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className={`h-11 rounded-xl transition-all ${pathname === item.url ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Link href={item.url} className="flex items-center gap-3 px-3">
                      <item.icon size={18} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section (Only visible if user.role is admin) */}
        {user?.role === "admin" && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-slate-500 px-2 py-4 uppercase text-[10px] tracking-[0.2em] font-bold">Admin Panel</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/dashboard"} className={`h-11 rounded-xl ${pathname === "/admin/dashboard" ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                  <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 text-purple-400">
                    <ShieldCheck size={18} />
                    <span className="font-medium">System Stats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700">
           <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.name?.[0] || 'U'}
           </div>
           <div className="flex flex-col truncate">
              <span className="text-slate-200 text-xs font-bold truncate">{user?.name}</span>
              <span className="text-slate-500 text-[10px] truncate uppercase tracking-tight">{user?.role}</span>
           </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut()} className="w-full h-11 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
              <LogOut size={18} className="mr-3" />
              <span className="font-bold uppercase text-xs tracking-wider">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
