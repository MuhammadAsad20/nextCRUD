import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect("/Login"); // Case-sensitive check karein (Signup/Login)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-slate-950 w-full font-sans selection:bg-indigo-500/30">
        
        {/* Sidebar Component */}
        <AppSidebar user={session.user} />

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Background subtle glow consistent with Login/Signup */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none" />

          {/* ✅ Navbar: SidebarTrigger ab Navbar ke andar move hoga */}
          <Navbar session={session} />

          <main className="flex-1 overflow-y-auto relative z-10">
            <div className="max-w-7xl mx-auto p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
