"use client";

import { useState } from 'react';
import type { Book } from '@/types';
import { mockBooks } from '@/lib/mockData'; // Using mock data
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Gift, History, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

const getDonationStatusDetails = (status: Book['status']) => {
  switch (status) {
    case 'donated_pending_approval':
      return { text: 'Pending Approval', icon: HelpCircle, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' };
    case 'donated_approved':
      return { text: 'Approved', icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
    // Add a 'donated_rejected' status if needed
    // case 'donated_rejected':
    //   return { text: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-700' };
    default:
      return { text: 'Unknown', icon: HelpCircle, className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
  }
};

export function DonationHistoryTab() {
  // Assuming current user ID is 'user1' for mock data filtering
  const currentUserId = 'user1';
  const [donationHistory, setDonationHistory] = useState<Book[]>(
    mockBooks.filter(book => book.donatedBy?.userId === currentUserId && (book.status === 'donated_pending_approval' || book.status === 'donated_approved'))
  );

  return (
    <div className="space-y-6">
      {donationHistory.length > 0 ? (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Cover</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationHistory.map(book => {
                const statusDetails = getDonationStatusDetails(book.status);
                const Icon = statusDetails.icon;
                return (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Image
                        src={book.coverImageUrl || `https://placehold.co/50x75.png?text=${book.title.substring(0,1)}`}
                        alt={book.title}
                        data-ai-hint={book.dataAiHint || "book cover small"}
                        width={40}
                        height={60}
                        className="rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.donatedBy?.date ? new Date(book.donatedBy.date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusDetails.className}`}>
                        <Icon className="mr-1 h-3.5 w-3.5" />
                        {statusDetails.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <History className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Donation History</h3>
          <p className="text-muted-foreground">You haven't made any book donations yet, or none are pending/approved.</p>
          <Button variant="link" className="mt-4 text-primary" asChild>
            <a href="/user/dashboard?tab=donate">Donate a Book Now</a>
          </Button>
        </div>
      )}
    </div>
  );
}
