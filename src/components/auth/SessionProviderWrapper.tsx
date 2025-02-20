"use client";

import { SessionProvider } from "next-auth/react";
import ClientWrapper from "../Body/ClientWrapper";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);


  return <ClientWrapper>{children}</ClientWrapper>;
}

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {

   
  return (<SessionProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </SessionProvider>
    )
}
