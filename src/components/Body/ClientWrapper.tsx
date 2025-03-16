"use client";

import { usePathname } from "next/navigation";
import PageBodyWrapper from "@/components/body/PageBodyWrapper";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react"

export default function ClientWrapper({ children }: { children: React.ReactNode}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth/signin");

  return (
    <>
    <SessionProvider>
    {!isAuthPage ? <PageBodyWrapper>{children}</PageBodyWrapper> : children}

    </SessionProvider>
   
   
    </>
  );
}