
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Book, User } from '@/types';
// import { mockBooks } from '@/lib/mockData'; // Switching to Firestore
import { BookCard } from '@/components/shared/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, BookOpenCheck, Search, RefreshCcw, Loader2 as SpinnerIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase.ts';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const RENEWAL_PERIOD_DAYS = 7;

interface IssuedBooksTabProps {
  currentUser: User | null;
}

// Helper function to log transactions
async function logTransaction(transactionData: Omit<import('@/types').Transaction, 'id' | 'timestamp'>) {
  if (!db) return;
  try {
    await addDoc(collection(db, "transactions"), {
      ...transactionData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging transaction:", error);
  }
}

export function IssuedBooksTab({ currentUser }: IssuedBooksTabProps) {
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'due_soon' | 'overdue'>('all');
  const { toast } = useToast();

  const fetchIssuedBooks = useCallback(async () => {
    if (!currentUser || !currentUser.id) {
      setIsLoading(false);
      // Potentially show a message if no user is logged in, or rely on UserDashboardClient to handle this.
      return;
    }
    if (!db) {
      setTimeout(() => toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" }), 0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const booksCollection = collection(db, "books");
      const q = query(
        booksCollection, 
        where("issueDetails.userId", "==", currentUser.id),
        where("status", "==", "issued"),
        orderBy("issueDetails.dueDate", "asc") // Sort by due date
      );
      const querySnapshot = await getDocs(q);
      const booksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      setUserBooks(booksList);
    } catch (error: any) {
      console.error("Error fetching issued books:", error);
      setTimeout(() => toast({ 
        title: "Error Fetching Your Books", 
        description: error.message || "Could not load your issued books.", 
        variant: "destructive" 
      }), 0);
      if (error.code === 'failed-precondition') {
        setTimeout(() => toast({
          title: "Index Required",
          description: "The query for issued books requires an index. Please deploy Firestore indexes.",
          variant: "destructive",
          duration: 10000,
        }), 0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    fetchIssuedBooks();
  }, [fetchIssuedBooks]);

  const handleRenewBook = async (bookId: string, bookTitle: string) => {
     if (!currentUser || !db) {
      toast({ title: "Error", description: "Cannot renew book at this time.", variant: "destructive" });
      return;
    }
    
    const bookToRenew = userBooks.find(b => b.id === bookId);
    if (!bookToRenew || !bookToRenew.issueDetails) {
      toast({ title: "Renewal Failed", description: "Book or issue details not found.", variant: "destructive" });
      return;
    }

    const currentDueDate = new Date(bookToRenew.issueDetails.dueDate);
    // Basic check: prevent renewal if already overdue by more than a grace period (e.g. 1 day)
    // For a stricter rule, check if currentDueDate < today.
    const today = new Date();
    today.setHours(0,0,0,0);
    if (currentDueDate < today) {
        toast({ title: "Renewal Not Allowed", description: "Overdue books cannot be renewed through this system. Please contact the library.", variant: "destructive" });
        return;
    }

    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(currentDueDate.getDate() + RENEWAL_PERIOD_DAYS);

    const bookRef = doc(db, "books", bookId);
    try {
      await updateDoc(bookRef, {
        "issueDetails.dueDate": newDueDate.toISOString(),
      });

      await logTransaction({
        bookId: bookId,
        bookTitle: bookTitle,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email || 'User',
        type: 'renewal',
        dueDate: newDueDate.toISOString(),
        notes: `Renewed from ${currentDueDate.toLocaleDateString()} to ${newDueDate.toLocaleDateString()}`
      });

      toast({
        title: "Book Renewed",
        description: `"${bookTitle}" has been renewed. New due date: ${newDueDate.toLocaleDateString()}.`,
      });
      fetchIssuedBooks(); // Refresh the list
    } catch (error) {
      console.error("Error renewing book:", error);
      toast({ title: "Renewal Failed", description: "Could not renew the book. Please try again.", variant: "destructive" });
    }
  };

  const filteredAndSortedBooks = userBooks
    .filter(book => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = book.title.toLowerCase().includes(lowerSearchTerm) ||
                            book.author.toLowerCase().includes(lowerSearchTerm);

      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      
      if (!book.issueDetails) return false;
      const dueDate = new Date(book.issueDetails.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0,0,0,0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filter === 'overdue') return diffDays < 0;
      if (filter === 'due_soon') return diffDays >= 0 && diffDays <= 3;
      return true;
    })
    // Already sorted by Firestore query: orderBy("issueDetails.dueDate", "asc")

  if (isLoading && !userBooks.length) { // Show skeleton only on initial load
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-10 w-full sm:max-w-sm" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-96 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1 bg-muted/50 rounded-lg">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your issued books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="due_soon">Due Soon</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && userBooks.length > 0 && <SpinnerIcon className="mx-auto h-8 w-8 animate-spin text-primary my-4" />}


      {!isLoading && filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book}
              actionLabel="Request Renewal"
              onAction={() => handleRenewBook(book.id, book.title)}
              actionDisabled={!currentUser /* Add more complex logic if book is overdue etc. */}
            />
          ))}
        </div>
      ) : (
        !isLoading && ( // Only show "No Books" if not loading
          <div className="text-center py-12 rounded-lg bg-card border">
            {searchTerm || filter !== 'all' ? (
              <>
                <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Books Found</h3>
                <p className="text-muted-foreground">No books match your current search or filter.</p>
              </>
            ) : (
              <>
                <BookOpenCheck className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No Books Issued</h3>
                <p className="text-muted-foreground">You currently have no books issued from the library.</p>
                <Button variant="link" className="mt-4 text-primary" asChild>
                    <a href="/user/dashboard?tab=browse">Browse Library Catalog</a>
                </Button>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}
