import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser, authOptions } from "@/lib/auth";


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
