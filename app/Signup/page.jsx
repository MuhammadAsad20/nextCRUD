import SignupForm from "@/components/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    // Background ko mazeed deep aur mesh gradient look diya gaya hai
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* 1. Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* 2. Main Card with Glassmorphism */}
      <div className="w-full max-w-md relative group">
        {/* Card Outer Glow (Hover effect) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative bg-slate-900/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.8rem] border border-slate-800/50 shadow-2xl overflow-hidden">
          
          {/* Top Subtle Line Decoration */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">Start Your Journey</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
              Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">Account</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
              Join us today and experience the next level of data management.
            </p>
          </div>

          {/* Signup Form (Working logic preserved) */}
          <div className="relative z-10">
            <SignupForm />
          </div>

          {/* Footer Section */}
          <div className="mt-8 pt-8 border-t border-slate-800/60 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already part of the community?{" "}
              <Link 
                href="/Login" 
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-all duration-300 relative group/link inline-block"
              >
                Sign in
                <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-indigo-400 transition-all duration-300 group-hover/link:w-full" />
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* 3. Bottom Subtle Attribution (Optional) */}
      <p className="absolute bottom-6 text-slate-600 text-[10px] uppercase tracking-[0.3em]">Secure • Scalable • Fast</p>
    </div>
  );
}
