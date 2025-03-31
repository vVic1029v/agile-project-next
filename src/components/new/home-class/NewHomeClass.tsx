"use client"
import CreateHomeClass from "@/components/new/home-class/CreateHomeClass";
import { useSession } from "next-auth/react";

export default function NewHomeClass() {
const { data: session } = useSession();
  if (!session || session.user.userType !== "FACULTYMEMBER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/uploads/frontyard.webp')] px-4 z[-2]">
           <div className="absolute inset-0 bg-black bg-opacity-70 z[-1] h-full w-full"></div>
           <div className="p-6 rounded-lg bg-red-100 border-2 border-red-500 text-center max-w-lg w-full z-10">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-700">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <CreateHomeClass/>
    </div>
  );
}
