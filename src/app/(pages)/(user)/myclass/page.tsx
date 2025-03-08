"use client"
import React,{useState} from "react";
import { authMiddleware } from "@/lib/auth";
import ProfilePage from "@/components/ProfilePage";

import MyClassPage from "@/components/Myclass.Page";
import { useSession } from "next-auth/react";


export default function Myclass() {
 

  
  return (

   <MyClassPage></MyClassPage>
      
  
);

}