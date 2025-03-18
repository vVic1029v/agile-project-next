"use client";

import React, { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import AuthButton from "@/app/auth/AuthButton";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  if (status === "loading") {
    return ( <></>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6">
        <div className="p-8 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">
            {tryingToAccess ? `Access to ${tryingToAccess} requires authentication` : "Authentication Required"}
          </h1>
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
