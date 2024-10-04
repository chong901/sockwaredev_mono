import { SignInPage } from "@/components/sign-in-page";
import { getProviders } from "next-auth/react";

export default async function SignIn() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/providers`);
  const providers = (await res.json()) as Awaited<
    ReturnType<typeof getProviders>
  >;
  return <SignInPage providers={providers} />;
}
