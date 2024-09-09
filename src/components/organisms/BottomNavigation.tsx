// components/BottomNavigation.tsx
import { FavIcon } from "@/components/atoms/FavIcon";
import { HomeIcon } from "@/components/atoms/HomeIcon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const searchParam = useSearchParams();
  const tag = searchParam.get("tag") ?? navItems[0].tag;
  return (
    <nav className={`shadow-lg`}>
      <div className="flex justify-around p-2">
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
