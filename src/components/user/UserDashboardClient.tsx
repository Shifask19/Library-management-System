
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssuedBooksTab } from "./IssuedBooksTab";
import { DonateBookTab } from "./DonateBookTab";
import { DonationHistoryTab } from "./DonationHistoryTab";
import { BrowseBooksTab } from "./BrowseBooksTab"; // Added for the new tab
import { BookOpenCheck, Gift, History, Library } from 'lucide-react';
import { PageHeader } from "../shared/PageHeader";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from '@/types'; // Import User type
// import { auth, db } from '@/lib/firebase'; // For real auth
// import { doc, getDoc } from 'firebase/firestore'; // For real auth

export function UserDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab = searchParams.get('tab') || 'issued-books';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Placeholder for current user. In a real app, fetch from auth context/hook.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pageTitleUserName, setPageTitleUserName] = useState<string>("User");

  useEffect(() => {
    // Simulate fetching user data. Replace with actual auth logic.
    // Changed mockUser.id to 'user1' to match mockData for issued books.
    const mockUser: User = { id: 'user1', email: 'user1@example.com', role: 'user', name: 'Aisha Sharma (Mock)' };
    setCurrentUser(mockUser);
    setPageTitleUserName(mockUser.name || 'User');

    // Handle tab changes from URL
    const tabFromQuery = searchParams.get('tab') || 'issued-books';
    if (tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab]); // Dependencies for tab sync

  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
       <PageHeader 
        title={`Welcome, ${pageTitleUserName}!`}
        description="Manage your library activities here."
        // actions={activeTab === 'history' ? <ExportHistoryButton /> : undefined} // ExportHistoryButton is not defined yet
      />
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="issued-books" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpenCheck className="h-5 w-5" /> <span>My Issued Books</span>
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Library className="h-5 w-5" /> <span>Browse Library</span>
          </TabsTrigger>
          <TabsTrigger value="donate" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gift className="h-5 w-5" /> <span>Donate a Book</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="h-5 w-5" /> <span>Donation History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issued-books" className="mt-6">
          <IssuedBooksTab currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="browse" className="mt-6">
          <BrowseBooksTab currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="donate" className="mt-6">
          <DonateBookTab currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <DonationHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
