import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      // Log the request cookies for debugging

      // Verify token and return a boolean
      //const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: true, cookieName: 
      // process.env.NODE_ENV !== 'production' ? 'authjs.session-token' : '__Secure-authjs.session-token', });

      // let sessionToken;
      // if (process.env.NODE_ENV !== 'production') {
      //   sessionToken = req.cookies.get("next-auth.session-token");
      // }
      // else {
      //   sessionToken = req.cookies.get("__Secure-authjs.session-token");
      // }

      const secret = process.env.NEXT_AUTH_SECRET;
      const sessionToken = await getToken({
        req: req,
        secret: secret,
        raw: true,
      });

      if (sessionToken) return true;
      else return false;
    },
  },
});

export const config = { 
  matcher: [
    "/",
    "/home/:path*", 
    "/calendar/:path*", 
    "/new/:path*", 
    "/announcements/:path*",
    "/myclass/:path*",
    "/myaccount/:path*",
  ] 
};