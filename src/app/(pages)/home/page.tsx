"use client";

import { SessionProvider, useSession } from "next-auth/react";
import AuthButton from "@/components/auth/AuthButton";


export default function Home() {
  return (
    <SessionProvider>
      <AuthContent />
    </SessionProvider>
  );
}

function AuthContent() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {status === "loading" ? "Checking authentication..." : session ? "Welcome Back!" : "Welcome"}
        </h1>

        {status === "loading" ? (
          <p className="text-gray-400">Please wait...</p>
        ) : session ? (
          <>
            <p className="text-green-400">You're signed in as {session.user?.email}</p>
            <AuthButton />
          </>
        ) : (
          <>
            <p className="text-gray-400">You're not signed in</p>
            <AuthButton />
          </>
        )}
      </div>
    </div>
  );
}
