import { authMiddleware } from "@/lib/auth";
import ProfilePage from "@/components/ProfilePage";
import { useSession } from "next-auth/react";
import MyClassPage from "@/components/Myclass.Page";

export default async function Myclass() {
 
  return (
   <MyClassPage></MyClassPage>
      
  
);

}