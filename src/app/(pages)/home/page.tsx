import AuthContent from "@/components/auth/AuthContent";
import PageBodyWrapper from "@/components/body/PageBodyWrapper";
import HomePage from "@/components/home/HomePage";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <AuthContent>
        <PageBodyWrapper>
        <HomePage/>
    </PageBodyWrapper>
      </AuthContent>
  );
}


