"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard",    icon: "📊", label: "Dashboard"    },
  { href: "/transactions", icon: "💸", label: "Transactions" },
  { href: "/categories",   icon: "🏷️",  label: "Categories"  },
  { href: "/statistics",   icon: "📈", label: "Statistics"   },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-900 border-r border-gray-800 flex flex-col">

      <div className="px-6 h-16 flex items-center gap-3 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-base">
          💰
        </div>
        <span className="text-base font-semibold text-white">FinTrack</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2.5 rounded-lg bg-gray-800">
          <p className="text-xs text-gray-500">FinTrack</p>
          <p className="text-sm font-medium text-gray-300">v1.0.0</p>
        </div>
      </div>

    </aside>
  );
}