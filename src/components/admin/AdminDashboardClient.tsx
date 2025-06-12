"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookManagementTab } from "./BookManagementTab";
import { UserManagementTab } from "./UserManagementTab";
import { DonationApprovalTab } from "./DonationApprovalTab";
// Placeholder for TransactionLogTab
// import { TransactionLogTab } from "./TransactionLogTab";
import { BookMarked, Users, Gift, History } from 'lucide-react';
import { PageHeader } from "../shared/PageHeader";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab = searchParams.get('tab') || 'books';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // Ensure activeTab state is updated if query param changes externally
    const tabFromQuery = searchParams.get('tab') || 'books';
    if (tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, activeTab]);

  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Dashboard"
        description="Oversee and manage all library operations."
      />
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="books" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookMarked className="h-5 w-5" /> <span>Book Management</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-5 w-5" /> <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gift className="h-5 w-5" /> <span>Donation Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex-col sm:flex-row h-auto py-2 sm:py-1.5 gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" disabled>
            <History className="h-5 w-5" /> <span>Transaction Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="mt-6">
          <BookManagementTab />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserManagementTab />
        </TabsContent>
        <TabsContent value="donations" className="mt-6">
          <DonationApprovalTab />
        </TabsContent>
        <TabsContent value="transactions" className="mt-6">
          <div className="text-center py-12">
            <History className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Transaction Log</h3>
            <p className="text-muted-foreground">This feature is coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
