import { UserType } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    userType: UserType; // Add your custom userType
    firstName: string;
    lastName: string;
    profileImage?: string | null; 
  }

  interface Session extends DefaultSession {
    user: {
      
      id: string;
      userType: UserType;
      firstName: string;  // Include firstName and lastName in the session
      lastName: string;
      profileImage: string | null ;
     
    }
  }

  interface JWT extends DefaultJWT {
    id: string;
    userType: UserType;
    firstName: string;
    lastName: string;
    picture: string | null ;
  }
}