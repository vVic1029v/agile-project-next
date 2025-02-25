"use client";

import { usePathname } from "next/navigation";
import PageBodyWrapper from "@/components/Body/PageBodyWrapper";


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth/signin");

  return (
    <>
   
    {!isAuthPage ? <PageBodyWrapper>{children}</PageBodyWrapper> : children}
   
    </>
  );
}