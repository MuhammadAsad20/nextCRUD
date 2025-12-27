import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; 
import { authConfig } from "@/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise), 
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // ✅ Pass role to authorize
          image: user.image || null, 
        };
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      token.role = user.role;
      token.picture = user.image;
    }
    // 🔥 Client-side update() ko handle karne ke liye
    if (trigger === "update" && session?.user) {
      if (session.user.name) token.name = session.user.name;
      if (session.user.image) token.picture = session.user.image;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.image = token.picture;
    }
    return session;
  },
},

});
