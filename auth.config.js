// auth.config.js
export const authConfig = {
  pages: {
    signIn: "/Login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiRoute = nextUrl.pathname.startsWith("/api/tasks");
      
      if (isApiRoute && !isLoggedIn) return false; // Unauthorized
      return true;
    },
  },
  providers: [], // Khali choren, ye lib/auth.js mein bharenge
};
