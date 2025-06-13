
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal, Search, Edit2, Trash2, BookOpenCheck, Undo, Loader2 as SpinnerIcon } from 'lucide-react';
import type { Book } from '@/types';
import { StatusPill } from '@/components/shared/StatusPill';
import { BookFormModal } from './BookFormModal';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import Image from 'next/image';
import { db } from '@/lib/firebase.ts';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';


export function BookManagementTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const fetchBooks = useCallback(async () => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const booksCollection = collection(db, "books");
      const q = query(booksCollection, orderBy("title")); // Example: order by title
      const booksSnapshot = await getDocs(q);
      const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      setBooks(booksList);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({ title: "Error Fetching Books", description: "Could not load books from the database.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSaveBook = async (bookData: Omit<Book, 'id' | 'issueDetails' | 'donatedBy'> | Book) => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }
    
    try {
      if ('id' in bookData && bookData.id) { // Editing existing book
        const bookRef = doc(db, "books", bookData.id);
        // Ensure we don't overwrite nested objects like issueDetails or donatedBy unintentionally unless they are part of bookData
        const { id, ...dataToUpdate } = bookData; 
        await updateDoc(bookRef, dataToUpdate);
        toast({ title: "Book Updated", description: `"${bookData.title}" has been successfully updated.` });
      } else { // Adding new book
        // For new books, issueDetails and donatedBy should typically be undefined or handled by specific actions (issue/donate)
        const { issueDetails, donatedBy, ...newBookData } = bookData as Omit<Book, 'id'>;
        await addDoc(collection(db, "books"), newBookData);
        toast({ title: "Book Added", description: `"${bookData.title}" has been successfully added.` });
      }
      fetchBooks(); // Re-fetch books to update the list
      setEditingBook(null);
    } catch (error) {
      console.error("Error saving book:", error);
      toast({ title: "Error Saving Book", description: "An unexpected error occurred.", variant: "destructive" });
    }
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }
    try {
      await deleteDoc(doc(db, "books", bookId));
      toast({ title: "Book Deleted", description: `"${bookTitle}" has been removed from the library.` });
      fetchBooks(); 
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({ title: "Error Deleting Book", description: "Could not remove the book.", variant: "destructive" });
    }
  };
  
  const handleIssueBook = async (bookId: string) => {
     if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }
    // This would typically open a modal to select user and set due date
    // For now, simulate with mock user and update status in Firestore
    const bookRef = doc(db, "books", bookId);
    const issueDetails = { 
      userId: 'mockUserToReplace', // Replace with actual user ID from a modal/selection
      userName: 'Mock User To Replace', // Replace with actual user name
      issueDate: new Date().toISOString(), 
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // Due in 14 days
    };
    try {
      await updateDoc(bookRef, { status: 'issued', issueDetails });
      toast({ title: "Book Issued", description: "The book has been marked as issued." });
      fetchBooks();
    } catch (error) {
      console.error("Error issuing book:", error);
      toast({ title: "Error Issuing Book", description: "Could not issue the book.", variant: "destructive" });
    }
  };

  const handleReturnBook = async (bookId: string) => {
    if (!db) {
      toast({ title: "Error", description: "Firestore is not initialized.", variant: "destructive" });
      return;
    }
    const bookRef = doc(db, "books", bookId);
    try {
      // When returning, we clear issueDetails. Firestore's `deleteField()` could be used for more robust clearing.
      // For simplicity, setting to null or undefined is also common.
      await updateDoc(bookRef, { status: 'available', issueDetails: null }); 
      toast({ title: "Book Returned", description: "The book has been marked as available." });
      fetchBooks();
    } catch (error) {
      console.error("Error returning book:", error);
      toast({ title: "Error Returning Book", description: "Could not return the book.", variant: "destructive" });
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {[1,2,3,4,5,6,7,8].map(i => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1,2,3,4,5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-10 rounded" /></TableCell>
                  {[1,2,3,4,5,6,7].map(j => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
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
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books by title, author, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <BookFormModal
          book={null}
          onSave={handleSaveBook}
          triggerButton={
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Book
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
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
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    <StatusPill book={book} />
                  </TableCell>
                  <TableCell>
                    {book.status === 'issued' && book.issueDetails?.userName 
                      ? book.issueDetails.userName 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {book.status === 'issued' && book.issueDetails?.dueDate 
                      ? new Date(book.issueDetails.dueDate).toLocaleDateString() 
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditingBook(book)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {(book.status === 'available' || book.status === 'donated_approved') && (
                          <DropdownMenuItem onClick={() => handleIssueBook(book.id)}>
                            <BookOpenCheck className="mr-2 h-4 w-4" /> Issue Book
                          </DropdownMenuItem>
                        )}
                        {book.status === 'issued' && (
                          <DropdownMenuItem onClick={() => handleReturnBook(book.id)}>
                            <Undo className="mr-2 h-4 w-4" /> Return Book
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <ConfirmationDialog
                            triggerButton={
                                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:bg-destructive/10">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </button>
                            }
                            title="Delete Book"
                            description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                            onConfirm={() => handleDeleteBook(book.id, book.title)}
                            variant="destructive"
                         />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No books found. {searchTerm && "Try a different search term."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {editingBook && (
        <BookFormModal
          book={editingBook}
          onSave={handleSaveBook}
          triggerButton={<div style={{display: 'none'}} />} // Modal is controlled by editingBook state. This is a conceptual trigger.
        />
      )}
    </div>
  );
}
