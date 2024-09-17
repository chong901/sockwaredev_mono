// components/BottomNavigation.tsx
import Link from "next/link";

// Define type for navigation items
export type NavItem = {
  name: string;
  tag: string;
  icon: JSX.Element;
};

type BottomNavigationProps = {
  items: NavItem[];
  tag: string;
};

export const BottomNavigation = ({ items, tag }: BottomNavigationProps) => {
  return (
    <nav className={`shadow-lg`}>
      <div className="flex justify-around px-2 pb-safe-bottom pt-2">
        {items.map((item) => (
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
