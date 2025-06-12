"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import type { Book } from '@/types';
import { mockBooks } from '@/lib/mockData'; // Using mock data
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DonationApprovalTab() {
  const [donations, setDonations] = useState<Book[]>(mockBooks.filter(b => b.status === 'donated_pending_approval'));
  const [viewingDonation, setViewingDonation] = useState<Book | null>(null);
  const { toast } = useToast();

  const handleApproveDonation = async (bookId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setDonations(prevDonations => 
      prevDonations.filter(b => b.id !== bookId) // Remove from pending list
    );
    // In a real app, you'd also update the book's status in the main books list or Firestore
    // For example: mockBooks.find(b => b.id === bookId)!.status = 'donated_approved';
    toast({ title: "Donation Approved", description: "The book has been added to the library." });
  };

  const handleRejectDonation = async (bookId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setDonations(prevDonations => 
      prevDonations.filter(b => b.id !== bookId) // Remove from pending list
    );
    // In a real app, you might mark it as 'donated_rejected' or just remove
    toast({ title: "Donation Rejected", description: "The donation request has been rejected.", variant: "default" });
  };

  return (
    <div className="space-y-6">
      {donations.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Pending Donations</h3>
          <p className="text-muted-foreground">There are currently no books awaiting donation approval.</p>
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Donated By</TableHead>
                <TableHead>Date Donated</TableHead>
                <TableHead className="text-right w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((book) => (
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
                  <TableCell>{book.donatedBy?.userName || 'N/A'}</TableCell>
                  <TableCell>{book.donatedBy?.date ? new Date(book.donatedBy.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setViewingDonation(book)}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                      </DialogTrigger>
                      {viewingDonation && viewingDonation.id === book.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{viewingDonation.title}</DialogTitle>
                            <DialogDescription>By {viewingDonation.author}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 text-sm">
                            <p><strong>ISBN:</strong> {viewingDonation.isbn}</p>
                            <p><strong>Category:</strong> {viewingDonation.category}</p>
                            <p><strong>Published:</strong> {viewingDonation.publishedDate}</p>
                            <p><strong>Donated By:</strong> {viewingDonation.donatedBy?.userName} on {viewingDonation.donatedBy?.date ? new Date(viewingDonation.donatedBy.date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Description:</strong> {viewingDonation.description || "No description provided."}</p>
                             {viewingDonation.coverImageUrl && 
                                <Image src={viewingDonation.coverImageUrl} alt={viewingDonation.title} width={150} height={225} className="rounded mt-2" data-ai-hint={viewingDonation.dataAiHint || "book cover"} />
                             }
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleApproveDonation(book.id)}>
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleRejectDonation(book.id)}>
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
// Temporary Gift icon for empty state
import { Gift } from 'lucide-react';
