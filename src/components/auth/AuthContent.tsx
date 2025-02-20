"use client";

import React, { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import AuthButton from "@/components/auth/AuthButton";

interface AuthContentProps {
  children?: ReactNode;
  tryingToAccess?: string;
}

export default function AuthContent({ children, tryingToAccess }: AuthContentProps) {
  return (
    <SessionProvider>
      <AuthContentSession tryingToAccess={tryingToAccess}>
        {children}
      </AuthContentSession>
    </SessionProvider>
  );
}

function AuthContentSession({ children, tryingToAccess }: AuthContentProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return ( <></>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 sm:px-6">
        <div className="bg-purple-700 p-8 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">
            {tryingToAccess ? `Access to ${tryingToAccess} requires authentication` : "Authentication Required"}
          </h1>
          <p className="mb-6 text-gray-200">Please sign in to continue.</p>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {children}
    </div>
  );
}
