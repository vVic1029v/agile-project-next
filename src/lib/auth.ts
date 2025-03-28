import bcrypt from "bcryptjs";

import { NextAuthOptions, getServerSession, Session, User, JWT as CustonJWT } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { getExpensiveUserByEmail } from "@/lib/database/database";

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

  pages: {
    signIn: "/auth/signin",
  },


  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  

  callbacks: {

    async session({ session, token }) {
      const tok = token as CustonJWT
      if (session.user) {
        session.user.id = tok.id;
        session.user.userType = tok.userType;
        session.user.firstName = tok.firstName;
        session.user.lastName = tok.lastName;
        session.user.homeClassId = tok.homeClassId ?? null;
        // if(session.user.profileImage !== undefined)
        session.user.profileImage = tok.profileImage;
      
      console.log("user session ",session);
      console.log("user tok ",tok);
      }
      return session;
    },

    async jwt({ token, user }) {
      
      const tok = token as CustonJWT
      if (user) {
        const fullUser = user as User;
        tok.id = fullUser.id;
        tok.userType = fullUser.userType;
        tok.firstName = fullUser.firstName;
        tok.lastName = fullUser.lastName;
        tok.homeClassId = fullUser.homeClassId ?? null;
        if (fullUser.profileImage !== undefined) {
          tok.profileImage = fullUser.profileImage;
        }
        
      }
      return tok;
    },

  },
  
};

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
    homeClassId: user.student?.homeClassId ?? null,
    facultyMemberId: user.facultyMember?.id ?? null,
    profileImage: user.profileImage,
  };
}

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

export async function authMiddleware(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  const session = await auth(...args)
  if (!session) {
    throw new Error("authMiddleware must be called with a middleware protected route. Check config in middleware.ts.");
  }
  return session;
}

