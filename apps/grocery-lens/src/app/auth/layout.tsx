import { nextAuth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await nextAuth.auth();
  if (session) {
    redirect("/");
  }
  return <>{children}</>;
}
