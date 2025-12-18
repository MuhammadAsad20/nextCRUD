"use client"; // <--- Yeh lazmi hona chahiye

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() { // <--- "default" export hona chahiye
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between p-4 bg-gray-950">
      <Link href="/" className="font-bold">Task Manager</Link>
      <div className="flex gap-4">
        {session ? (
          <button onClick={() => signOut()}>Logout</button>
        ) : (
          <Link href="/Login">Login</Link>
        )}
      </div>
    </nav>
  );
}
