"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const session = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [{ name: "Home", href: "#" }];

  return (
    <header className="bg-gradient-to-r w-full from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </a>
            <nav className="hidden md:block ml-10">
              <ul className="flex space-x-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-white hover:bg-purple-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        session.data?.user?.image ?? "/placeholder-avatar.jpg"
                      }
                      alt="@username"
                    />
                    <AvatarFallback>
                      {session.data?.user?.name
                        ? session.data.user.name.slice(0, 2).toUpperCase()
                        : "UN"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.data?.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.data?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-purple-500 hover:bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:bg-purple-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-purple-500">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.data?.user?.image ?? "/placeholder-avatar.jpg"}
                    alt="@username"
                  />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none">
                  Username
                </div>
                <div className="text-sm font-medium leading-none text-purple-200">
                  user@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Button
                variant="ghost"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-500 hover:bg-opacity-75"
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-500 hover:bg-opacity-75"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-500 hover:bg-opacity-75"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
