import SignupForm from "@/components/SignupForm";
import SocialLogin from "@/components/SocialLogin";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Create Account</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Join us to manage your tasks efficiently</p>

        {/* Signup Form Component */}
        <SignupForm />

        {/* Social Login (GitHub) */}
        <SocialLogin />

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <Link 
              href="/Login" 
              className="text-emerald-400 font-bold hover:text-indigo-300 transition-colors hover:underline underline-offset-4"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
