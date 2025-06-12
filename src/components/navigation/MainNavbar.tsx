import { AppLogo } from "./AppLogo";
import { UserMenu } from "./UserMenu";
import type { User } from "@/types";
import { sampleAdmin } from "@/types"; // Using sample for now
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainNavbarProps {
  userRole: "admin" | "user";
  sidebarNav: React.ReactNode; // To inject AdminSidebarNav or UserSidebarNav for mobile
}

// This component will be a server component if user data is fetched server-side,
// or a client component if auth state is managed client-side.
// For now, let's assume user data is passed as a prop or fetched client-side.
export function MainNavbar({ userRole, sidebarNav }: MainNavbarProps) {
  // In a real app, user would be fetched from context or server session
  const user: User | null = userRole === 'admin' ? sampleAdmin : { id: 'user-mock', email: 'user@pes.edu', role: 'user', name: 'Mock User' };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
             <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 pt-8 bg-sidebar">
                  <div className="p-4 mb-4">
                    <AppLogo />
                  </div>
                  {sidebarNav}
                </SheetContent>
              </Sheet>
          </div>
          <div className="hidden md:block">
            <AppLogo />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Future additions: Theme toggle, notifications */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
