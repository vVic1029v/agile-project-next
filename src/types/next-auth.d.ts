import { UserType } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    userType: UserType; // Add your custom userType
    firstName: string;
    lastName: string;
    homeClassId?: string | null;
    profileImage?: string | null; 
      student?: {
      id: string;
      homeClassId: string | null;
    };
    facultyMember?: {
      id: string;
    };
  }

  interface Session extends DefaultSession {
    user: {
      
      id: string;
      email:string;
      userType: UserType;
      firstName: string;  // Include firstName and lastName in the sessio
      lastName: string;
      profileImage: string | null ;
      homeClassId?: string | null;
     
    }
  }

  interface JWT extends DefaultJWT {
    id: string;
    userType: UserType;
    firstName: string;
    lastName: string;
    profileImage: string | null ;
    homeClassId?: string | null;
  }
}