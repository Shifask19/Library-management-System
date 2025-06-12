
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { LayoutDashboard, BookOpenCheck, Gift, History, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const userNavItems: NavItem[] = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/dashboard?tab=issued-books", label: "My Issued Books", icon: BookOpenCheck },
  { href: "/user/dashboard?tab=donate", label: "Donate a Book", icon: Gift },
  { href: "/user/dashboard?tab=history", label: "My History", icon: History },
  { href: "/user/dashboard?tab=history", label: "Export Data", icon: Download }, // Points to history tab as button is there
  { href: "/user/dashboard?tab=settings", label: "Settings", icon: Settings, disabled: true },
];

export function UserSidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const isActive = (itemHref: string) => {
    const [linkPath, queryString] = itemHref.split('?');
    
    if (pathname !== linkPath) {
      return false; 
    }
    
    const defaultTab = "issued-books";

    // For the main "/user/dashboard" link (no query params in its href)
    if (!queryString) {
      // Active if currentTab is null (implicit default) or currentTab is the defaultTab
      return !currentTab || currentTab === defaultTab;
    }

    // For links with query params, e.g., "/user/dashboard?tab=donate"
    const linkQuery = new URLSearchParams(queryString);
    const linkTab = linkQuery.get('tab');

    if (linkTab === defaultTab) {
      // Active if currentTab is defaultTab OR if currentTab is null (implicit default)
      return currentTab === defaultTab || !currentTab;
    }
    // Active if currentTab matches linkTab
    return currentTab === linkTab;
  };

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 p-4">
        {userNavItems.map((item) => (
          <Button
            key={item.href + item.label} // Ensure unique key as hrefs can be same for "My History" and "Export Data"
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
