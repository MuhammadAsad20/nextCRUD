"use client";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="h-16 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <SidebarTrigger className="text-slate-400 hover:text-indigo-400" />

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-slate-400" />

<Link href="/dashboard/profile">
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">
              {session?.user?.name}
            </p>
            <p className="text-[10px] text-indigo-400 uppercase">
              {session?.user?.role}
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-indigo-600 overflow-hidden flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
        </Link>
      </div>
    </nav>
  );
}
