"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { LayoutDashboard, BookOpenCheck, Gift, History, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const userNavItems: NavItem[] = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/dashboard/issued-books", label: "My Issued Books", icon: BookOpenCheck },
  { href: "/user/dashboard/donate", label: "Donate a Book", icon: Gift },
  { href: "/user/dashboard/history", label: "My History", icon: History },
  { href: "/user/dashboard/export", label: "Export Data", icon: Download },
  { href: "/user/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
];

export function UserSidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
     if (href === "/user/dashboard" && pathname !== "/user/dashboard") return false;
    return pathname.startsWith(href);
  };

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 p-4">
        {userNavItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-10 text-sm",
              isActive(item.href) && "bg-primary/10 text-primary hover:bg-primary/20",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={item.disabled}
          >
            <Link href={item.disabled ? "#" : item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </ScrollArea>
  );
}
