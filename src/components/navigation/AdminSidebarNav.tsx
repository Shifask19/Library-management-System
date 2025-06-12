
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { LayoutDashboard, BookMarked, Users, Gift, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard?tab=books", label: "Book Management", icon: BookMarked },
  { href: "/admin/dashboard?tab=users", label: "User Management", icon: Users },
  { href: "/admin/dashboard?tab=donations", label: "Donations", icon: Gift },
  { href: "/admin/dashboard?tab=transactions", label: "Transaction Log", icon: History },
  { href: "/admin/dashboard?tab=settings", label: "Settings", icon: Settings },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const isActive = (itemHref: string) => {
    const [linkPath, queryString] = itemHref.split('?');
    
    if (pathname !== linkPath) {
      return false; 
    }

    const defaultTabForDashboard = "books"; // Assuming 'books' is the default when no tab is specified for /admin/dashboard

    // For the main "/admin/dashboard" link (no query params in its href - represents the dashboard overview or first tab)
    if (!queryString) { 
      // Active if currentTab is null (no specific tab selected, so dashboard overview is active) 
      // OR if currentTab is the defaultTabForDashboard (explicitly on the default tab)
      return !currentTab || currentTab === defaultTabForDashboard;
    }

    // For links with query params, e.g., "/admin/dashboard?tab=users"
    const linkQuery = new URLSearchParams(queryString);
    const linkTab = linkQuery.get('tab');

    // If the link's tab is the default tab, it's active if currentTab is the default OR if currentTab is null (implicit default)
    if (linkTab === defaultTabForDashboard) {
        return currentTab === defaultTabForDashboard || !currentTab;
    }
    
    // For any other tab, it's active only if currentTab matches linkTab
    return currentTab === linkTab;
  };

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 p-4">
        {adminNavItems.map((item) => (
          <Button
            key={item.href + item.label} // Ensure unique key
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
