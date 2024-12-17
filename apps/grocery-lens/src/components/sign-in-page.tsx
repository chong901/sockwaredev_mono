"use client";
import { GroceryLensLogo } from "@/components/grocery-lens";
import { Button } from "@/components/ui/button";
import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export const SignInPage = ({ providers }: { providers: Awaited<ReturnType<typeof getProviders>> }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <GroceryLensLogo className="w-28" />
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Welcome to Grocery Lens!</h1>
        <p className="mb-8 text-center text-gray-600">Sign in or sign up to continue to your account</p>
        {Object.values(providers!).map((provider) => (
          <div key={provider.name} className="mb-4">
            <Button
              onClick={() => signIn(provider.id, { callbackUrl })}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
            >
              <FcGoogle className="mr-2" size={24} />
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
