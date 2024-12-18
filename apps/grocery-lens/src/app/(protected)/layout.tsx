import { ApolloWrapper } from "@/app/ApolloWrapper";
import { nextAuth } from "@/auth";
import { Header } from "@/components/header";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await nextAuth.auth();
  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <SessionProvider session={session}>
      <ApolloWrapper>
        <Header />
        <div className="container mx-auto mt-4 w-full flex-1 overflow-scroll rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 p-6 shadow-lg">{children}</div>
      </ApolloWrapper>
    </SessionProvider>
  );
}
