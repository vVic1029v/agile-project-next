import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req }) => {
      // Log the request cookies for debugging
      console.log("Request Cookies:", req.cookies);

      // Verify token and return a boolean
      //const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: true, cookieName: 
      // process.env.NODE_ENV !== 'production' ? 'authjs.session-token' : '__Secure-authjs.session-token', });

      let sessionToken;
      if (process.env.NODE_ENV !== 'production') {
        sessionToken = req.cookies.get("authjs.session-token");
      }
      else {
        sessionToken = req.cookies.get("__Secure-authjs.session-token");
      }

      console.log("Session Token:", sessionToken); // Log the session token for debugging

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