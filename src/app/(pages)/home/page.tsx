import AuthContent from "@/components/auth/AuthContent";
import PageBodyWrapper from "@/components/body/PageBodyWrapper";
import HomePage from "@/components/home/HomePage";
import { authMiddleware } from "@/lib/auth";

export default async function Home() {
  const session = await authMiddleware();
  return (
    <AuthContent>
      <PageBodyWrapper>
        <HomePage />
      </PageBodyWrapper>
    </AuthContent>
  );
}


