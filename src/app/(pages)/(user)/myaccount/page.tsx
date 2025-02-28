import { authMiddleware } from "@/lib/auth";
import ProfilePage from "@/components/ProfilePage";
import { useSession } from "next-auth/react";

export default async function Profile() {
 
  return (
    <ProfilePage />
      
  
);

}