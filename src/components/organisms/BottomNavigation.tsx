// components/BottomNavigation.tsx
import { FavIcon } from "@/components/atoms/FavIcon";
import { HomeIcon } from "@/components/atoms/HomeIcon";
import { useSearchParamWithDefault } from "@/hooks/useSearchParamWithDefault";
import Link from "next/link";
import React from "react";

// Define type for navigation items
type NavItem = {
  name: string;
  tag: string;
  icon: JSX.Element;
};

// Define the navigation items
const navItems: NavItem[] = [
  {
    name: "Home",
    tag: "home",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    name: "Favorites",
    tag: "favorites",
    icon: <FavIcon className="h-6" />,
  },
];

const BottomNavigation: React.FC = () => {
  const tag = useSearchParamWithDefault("tag", "home");
  return (
    <nav className={`shadow-lg`}>
      <div className="pb-safe-bottom flex justify-around px-2 pt-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={`?tag=${item.tag}`}
            className={`flex flex-col items-center ${tag === item.tag ? "!text-blue-500" : "!text-slate-500"}`}
          >
            {item.icon}
            <span className="mt-1 text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
