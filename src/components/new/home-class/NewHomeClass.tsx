"use client"
import CreateHomeClass from "@/components/new/home-class/CreateHomeClass";
import { useSession } from "next-auth/react";

export default function NewHomeClass() {
const { data: session } = useSession();
  if (!session || session.user.userType !== "FACULTYMEMBER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-300">
        <div className="p-6 rounded-lg bg-red-100 border-2 border-red-500 text-center max-w-lg w-full">
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
