"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!session ? (
        <>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      ) : (
        <>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
};