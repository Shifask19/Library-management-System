
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Eye, Gift as GiftIcon, Loader2 as SpinnerIcon } from 'lucide-react';
import type { Book } from '@/types';
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
import { db } from '@/lib/firebase.ts';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';

export function DonationApprovalTab() {
  const [donations, setDonations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingDonation, setViewingDonation] = useState<Book | null>(null);
  const { toast } = useToast();

  const fetchPendingDonations = useCallback(async () => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const booksCollection = collection(db, "books");
      // Query for books with status 'donated_pending_approval'
      const q = query(
        booksCollection, 
        where("status", "==", "donated_pending_approval"),
        orderBy("donatedBy.date", "desc") // Show newest donations first
      );
      const donationsSnapshot = await getDocs(q);
      const donationsList = donationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      setDonations(donationsList);
    } catch (error) {
      console.error("Error fetching pending donations:", error);
      toast({ title: "Error Fetching Donations", description: "Could not load pending donations.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPendingDonations();
  }, [fetchPendingDonations]);

  const handleApproveDonation = async (bookId: string, bookTitle: string) => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }
    const bookRef = doc(db, "books", bookId);
    try {
      await updateDoc(bookRef, { status: 'donated_approved' }); // Or 'available' if that's the desired status after approval
      toast({ title: "Donation Approved", description: `"${bookTitle}" has been approved and added to the library.` });
      fetchPendingDonations(); // Refresh list
    } catch (error) {
      console.error("Error approving donation:", error);
      toast({ title: "Error Approving Donation", description: "Could not approve the donation.", variant: "destructive" });
    }
  };

  const handleRejectDonation = async (bookId: string, bookTitle: string) => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }
    // Option 1: Delete the book document for a rejected donation
    // Option 2: Update status to 'donated_rejected' if you want to keep a record
    try {
      await deleteDoc(doc(db, "books", bookId)); // Option 1
      // await updateDoc(doc(db, "books", bookId), { status: 'donated_rejected' }); // Option 2
      toast({ title: "Donation Rejected", description: `The donation request for "${bookTitle}" has been rejected.`});
      fetchPendingDonations(); // Refresh list
    } catch (error) {
      console.error("Error rejecting donation:", error);
      toast({ title: "Error Rejecting Donation", description: "Could not reject the donation.", variant: "destructive" });
    }
  };

  if (isLoading) {
     return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 mb-4" /> {/* Placeholder for a title or info */}
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                 {[1,2,3,4,5,6].map(i => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1,2,3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-10 rounded" /></TableCell>
                  {[1,2,3,4,5].map(j => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {donations.length === 0 ? (
        <div className="text-center py-12">
          <GiftIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
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
                    <Dialog onOpenChange={(open) => !open && setViewingDonation(null)}>
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
                          <div className="space-y-2 text-sm max-h-[60vh] overflow-y-auto">
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
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleApproveDonation(book.id, book.title)}>
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleRejectDonation(book.id, book.title)}>
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
