import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; 
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  // Agar user logged in nahi hai toh Dashboard access nahi kar sakta
  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-950 w-full">
        {/* Sidebar Component (User details ke sath) */}
        <AppSidebar user={session.user} />
        
        <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto">
          {/* Mobile Sidebar Button */}
          <div className="lg:hidden mb-6">
            <SidebarTrigger className="bg-slate-900 border-slate-800 text-white" />
          </div>
          
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
