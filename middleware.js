// middleware.js
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Is line se middleware sirf tasks aur dashboard par chalega
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/tasks/:path*"],
};
