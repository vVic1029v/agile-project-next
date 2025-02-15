"use client";

import { SessionProvider, useSession } from "next-auth/react";
import AuthButton from "@/components/auth/AuthButton";
import { auth } from "@/lib/auth";

export default function AuthContent({tryingToAccess}: {tryingToAccess?: string}) {
    return (
        <SessionProvider>
            <AuthContentSession tryingToAccess={tryingToAccess}/>
        </SessionProvider>
    );
}

function AuthContentSession({tryingToAccess}: {tryingToAccess?: string}) {
    const { data: session, status } = useSession();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                    <h1 className="text-2xl font-semibold mb-4">
                        {status === "loading" ? "Checking authentication..." : session ? "Welcome Back!" : (tryingToAccess ? "You're trying to acces "+tryingToAccess+" but you're not signed in." : "Welcome")}
                    </h1>
            
                    {status === "loading" ? (
                        <p className="text-gray-400">Please wait...</p>
                    ) : session ? (
                        <>
                        <p className="text-green-400">You're signed in as {session.user?.email}</p>
                        <AuthButton />
                        <br/>
                        <a rel="icon" href="/calendar">Calendar</a>
                        </>
                    ) : (
                        <>
                        <p className="text-gray-400">You're not signed in</p>
                        <AuthButton />
                        </>
                    )}
                </div>
            </div>
    )
}