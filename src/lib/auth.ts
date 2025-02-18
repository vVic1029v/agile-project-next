import bcrypt from "bcrypt";
import {getExpensiveUserByEmail} from "./database";

import { NextAuthOptions, getServerSession, Session, User, JWT as CustonJWT } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { UserType } from "@prisma/client";

export async function verifyUser(email: string, password: string) {
  const user = await getExpensiveUserByEmail(email);

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
    studentId: user.student?.id ?? null,
    facultyMemberId: user.facultyMember?.id ?? null,
  };
}

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await verifyUser(credentials.email, credentials.password);
        if (!user) return null;
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      const tok = token as CustonJWT
      if (session.user) {
        session.user.id = tok.id;
        session.user.userType = tok.userType;
        session.user.firstName = tok.firstName;
        session.user.lastName = tok.lastName;
      }
      return session;
    },
    async jwt({ token, user }) {
      const tok = token as CustonJWT
      if (user) {
        tok.id = user.id; 
        tok.userType = user.userType;
        tok.firstName = user.firstName;
        tok.lastName = user.lastName;
      }
      return tok;
    },
  },
  
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}

export function isAuthorized(session: Session | null, userId: string | null): boolean {
  return !!session && !!session.user.id && (userId === session.user.id || session.user.userType === "ADMIN");
}

