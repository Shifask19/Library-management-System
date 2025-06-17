
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { LayoutDashboard, Library, Gift, History, Settings } from "lucide-react"; // Added Library
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const userNavItems: NavItem[] = [
  { href: "/user/dashboard?tab=issued-books", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/dashboard?tab=browse", label: "Browse Library", icon: Library },
  { href: "/user/dashboard?tab=donate", label: "Donate a Book", icon: Gift },
  { href: "/user/dashboard?tab=history", label: "My History", icon: History },
  { href: "/user/dashboard?tab=settings", label: "Settings", icon: Settings, disabled: true },
];

export function UserSidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (itemHref: string) => {
    const [linkPath, linkQueryString] = itemHref.split('?');
    if (pathname !== linkPath) {
      return false;
    }

    const itemTab = new URLSearchParams(linkQueryString).get('tab');
    // Default tab for /user/dashboard if no specific tab is in the URL
    const currentTabInUrl = searchParams.get('tab') || 'issued-books'; 
    
    return currentTabInUrl === itemTab;
  };

  return (
    <ScrollArea className="h-full">
      <nav className="flex flex-col gap-1 p-4">
        {userNavItems.map((item) => (
          <Button
            key={item.href + item.label}
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
