import { UserType } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    userType: UserType; // Add your custom userType
    firstName: string;
    lastName: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      userType: UserType;
      firstName: string;  // Include firstName and lastName in the session
      lastName: string;
    }
  }

  interface JWT extends DefaultJWT {
    id: string;
    userType: UserType;
    firstName: string;
    lastName: string;
  }
}