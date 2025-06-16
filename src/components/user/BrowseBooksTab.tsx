
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Book, User } from '@/types';
import { BookCard } from '@/components/shared/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Library, Loader2 as SpinnerIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase.ts';
import { collection, getDocs, doc, updateDoc, query, where, orderBy, addDoc } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';

interface BrowseBooksTabProps {
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

const bookCategories = ["All", "Computer Science", "Fiction", "Science", "History", "Mathematics", "Engineering", "Literature", "Thriller", "Physics", "Electronics", "Other"];


export function BrowseBooksTab({ currentUser }: BrowseBooksTabProps) {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchAvailableBooks = useCallback(async () => {
    if (!db) {
      setTimeout(() => toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" }), 0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    console.log("BrowseBooksTab: Querying Firestore for books with status 'available' or 'donated_approved'.");
    try {
      const booksCollection = collection(db, "books");
      // Query for books with status 'available' or 'donated_approved'
      const q = query(
        booksCollection,
        where("status", "in", ["available", "donated_approved"]),
        orderBy("title")
      );
      const booksSnapshot = await getDocs(q);
      const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      console.log(`BrowseBooksTab: Fetched books count from Firestore: ${booksList.length}`);
      if (booksList.length > 0) {
        // console.log('BrowseBooksTab: First fetched book from Firestore:', JSON.stringify(booksList[0])); // Optionally log first book for debugging
      } else {
        console.log('BrowseBooksTab: No books with status "available" or "donated_approved" found in Firestore based on the current query.');
      }
      setAllBooks(booksList);
    } catch (error: any) {
      console.error("Error fetching available books:", error);
       setTimeout(() => toast({
        title: "Error Fetching Books",
        description: error.message || "Could not load available books.",
        variant: "destructive"
      }), 0);
       if (error.code === 'failed-precondition') {
        setTimeout(() => toast({
          title: "Index Required",
          description: "The query for available books requires an index: 'books' collection, fields: status (ASC), title (ASC). Please check Firestore indexes.",
          variant: "destructive",
          duration: 10000,
        }), 0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAvailableBooks();
  }, [fetchAvailableBooks]);

  const handleIssueBook = async (bookId: string, bookTitle: string) => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "You must be logged in to issue a book.", variant: "destructive" });
      return;
    }
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }

    const bookRef = doc(db, "books", bookId);
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(issueDate.getDate() + 14); // Due in 14 days

    const issueDetails = {
      userId: currentUser.id,
      userName: currentUser.name || currentUser.email || 'User',
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
    };

    try {
      await updateDoc(bookRef, { status: 'issued', issueDetails });

      await logTransaction({
        bookId: bookId,
        bookTitle: bookTitle,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email || 'User',
        type: 'issue',
        dueDate: dueDate.toISOString(),
      });

      toast({
        title: "Book Issued!",
        description: `"${bookTitle}" has been issued to you. Due Date: ${dueDate.toLocaleDateString()}.`,
      });
      fetchAvailableBooks(); // Refresh the list of available books
    } catch (error) {
      console.error("Error issuing book:", error);
      toast({ title: "Error Issuing Book", description: "Could not issue the book. Please try again.", variant: "destructive" });
    }
  };

  const filteredBooks = allBooks
    .filter(book => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = book.title.toLowerCase().includes(lowerSearchTerm) ||
                            book.author.toLowerCase().includes(lowerSearchTerm) ||
                            (book.isbn && book.isbn.toLowerCase().includes(lowerSearchTerm));

      const matchesCategory = categoryFilter === 'all' || (book.category && book.category === categoryFilter);

      return matchesSearch && matchesCategory;
    });


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-10 w-full sm:max-w-sm" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-96 w-full rounded-lg" />)}
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
            placeholder="Search by title, author, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {bookCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              actionLabel="Issue This Book"
              onAction={() => { /* This will be handled by ConfirmationDialog's onConfirm */ }}
              actionDisabled={!currentUser}
            >
              <ConfirmationDialog
                triggerButton={
                  <Button
                    className="w-full mt-2"
                    variant="default"
                    disabled={!currentUser || book.status !== 'available' && book.status !== 'donated_approved'}
                  >
                    Issue This Book
                  </Button>
                }
                title="Confirm Book Issue"
                description={`Are you sure you want to issue "${book.title}"? It will be due in 14 days.`}
                onConfirm={() => handleIssueBook(book.id, book.title)}
                confirmText="Yes, Issue Book"
              />
            </BookCard>
          ))}
        </div>
      ) : (
         <div className="text-center py-12 rounded-lg bg-card border">
          <Library className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Books Available</h3>
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter !== 'all'
              ? "No books match your current search or filter criteria."
              : "No books are currently marked as 'available' or 'donated_approved' in the library system. Please check back later or contact an admin."}
          </p>
        </div>
      )}
    </div>
  );
}

