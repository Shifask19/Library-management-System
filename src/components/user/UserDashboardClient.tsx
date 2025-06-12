"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssuedBooksTab } from "./IssuedBooksTab";
import { DonateBookTab } from "./DonateBookTab";
import { DonationHistoryTab } from "./DonationHistoryTab";
import { ExportHistoryButton } from "./ExportHistoryButton";
import { BookOpenCheck, Gift, History, Download } from 'lucide-react';
import { PageHeader } from "../shared/PageHeader";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function UserDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab = searchParams.get('tab') || 'issued-books';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromQuery = searchParams.get('tab') || 'issued-books';
    if (tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab]);

  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${pathname}?tab=${value}`, { scroll: false });
  };

  // Assuming current user for page header, replace with actual user data
  const userName = "PES User"; 

  return (
    <div className="space-y-8">
       <PageHeader 
        title={`Welcome, ${userName}!`}
        description="Manage your library activities here."
        actions={activeTab === 'history' ? <ExportHistoryButton /> : undefined}
      />
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-2 h-auto p-1">
          <TabsTrigger value="issued-books" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpenCheck className="h-5 w-5" /> <span>My Issued Books</span>
          </TabsTrigger>
          <TabsTrigger value="donate" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gift className="h-5 w-5" /> <span>Donate a Book</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="h-5 w-5" /> <span>Donation History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issued-books" className="mt-6">
          <IssuedBooksTab />
        </TabsContent>
        <TabsContent value="donate" className="mt-6">
          <DonateBookTab />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <DonationHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
