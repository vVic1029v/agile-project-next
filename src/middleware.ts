import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      // verify token and return a boolean
      // const sessionToken = req.cookies.get("next-auth.session-token");
      const sessionToken = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: true, cookieName: process.env.NODE_ENV !== 'production' ? 'authjs.session-token' : '__Secure-authjs.session-token', });
      if (sessionToken) return true;
      else return false;
    },
  },
});

export const config = { 
  matcher: [
    "/home/:path*", 
    "/calendar/:path*", 
    "/new/:path*", 
    "/announcements/:path*",
    "/myclass/:path*",
    "/myaccount/:path*",
   
  ] 
};
