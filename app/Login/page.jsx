import LoginForm from "@/components/LoginForm";
import SocialLogin from "@/components/SocialLogin"; 
import Link from "next/link"; // Next.js ka Link import karein

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Please enter your details to sign in</p>
        
        {/* Email/Password Form */}
        <LoginForm />

        {/* GitHub Button Section */}
        <SocialLogin />

        {/* ✅ Signup Redirect Link */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link 
              href="/Signup" 
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors hover:underline underline-offset-4"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
