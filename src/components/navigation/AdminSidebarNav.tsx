"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { LayoutDashboard, BookMarked, Users, Gift, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/books", label: "Book Management", icon: BookMarked },
  { href: "/admin/dashboard/users", label: "User Management", icon: Users },
  { href: "/admin/dashboard/donations", label: "Donations", icon: Gift },
  { href: "/admin/dashboard/transactions", label: "Transaction Log", icon: History },
  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings, disabled: true },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  // For more precise active state, especially with nested routes
  const isActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname !== "/admin/dashboard") return false;
    return pathname.startsWith(href);
  };

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 p-4">
        {adminNavItems.map((item) => (
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
