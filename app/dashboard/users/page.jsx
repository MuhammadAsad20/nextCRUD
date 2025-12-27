import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import UserTableClient from "@/components/UserTableClient";

export default async function MemberListPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/dashboard");

  await dbConnect();
  // Fetch users and convert to plain objects for client component
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  const serializedUsers = users.map(user => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Member <span className="text-indigo-500">Directory</span></h1>
        <p className="text-slate-400 text-sm mt-1">Manage all registered users, toggle roles, and maintain security.</p>
      </div>

      {/* Client component for search and CRUD */}
      <UserTableClient initialUsers={serializedUsers} />
    </div>
  );
}
