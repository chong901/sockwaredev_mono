"use client";

import { GroceryLensLogo } from "@/components/grocery-lens";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const session = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [{ name: "Home", href: "#" }];

  return (
    <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0">
              <GroceryLensLogo className="h-8 w-8" />
            </a>
            <nav className="ml-10 hidden md:block">
              <ul className="flex space-x-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-purple-500 hover:bg-opacity-75">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="hidden items-center space-x-4 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.data?.user?.image ?? undefined} alt="@username" />
                    <AvatarFallback>{session.data?.user?.name ? session.data.user.name.slice(0, 2).toUpperCase() : "UN"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.data?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.data?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-purple-500 hover:bg-opacity-75" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-purple-500 hover:bg-opacity-75">
                {item.name}
              </a>
            ))}
          </div>
          <div className="border-t border-purple-500 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.data?.user?.image ?? "/placeholder-avatar.jpg"} alt="@username" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none">{session.data?.user?.name ?? ""}</div>
                <div className="text-sm font-medium leading-none text-purple-200">{session.data?.user?.email ?? ""}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Button
                variant="ghost"
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-purple-500 hover:bg-opacity-75"
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
