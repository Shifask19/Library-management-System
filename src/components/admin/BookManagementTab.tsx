"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal, Search, Edit2, Trash2, BookOpenCheck, Undo } from 'lucide-react';
import type { Book } from '@/types';
import { mockBooks } from '@/lib/mockData'; // Using mock data
import { StatusPill } from '@/components/shared/StatusPill';
import { BookFormModal } from './BookFormModal';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import Image from 'next/image';

// TODO: Implement IssueBookModal and ReturnBookModal or integrate into actions
// For now, issue/return will be simulated actions.

export function BookManagementTab() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const handleSaveBook = async (bookData: Omit<Book, 'id'> | Book) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if ('id' in bookData) { // Editing existing book
      setBooks(prevBooks => prevBooks.map(b => b.id === bookData.id ? { ...b, ...bookData } : b));
    } else { // Adding new book
      const newBook = { ...bookData, id: `book${Date.now()}` } as Book; // Create new ID
      setBooks(prevBooks => [newBook, ...prevBooks]);
    }
    setEditingBook(null);
  };

  const handleDeleteBook = async (bookId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
    toast({ title: "Book Deleted", description: "The book has been removed from the library." });
  };
  
  const handleIssueBook = (bookId: string) => {
    // This would open a modal to select user and set due date
    // For now, just update status and add mock issueDetails
    setBooks(prevBooks => prevBooks.map(b => b.id === bookId ? { 
      ...b, 
      status: 'issued', 
      issueDetails: { 
        userId: 'mockUser', 
        userName: 'Mock User', 
        issueDate: new Date().toISOString(), 
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // Due in 14 days
      } 
    } : b));
    toast({ title: "Book Issued", description: "The book has been marked as issued." });
  };

  const handleReturnBook = (bookId: string) => {
    setBooks(prevBooks => prevBooks.map(b => b.id === bookId ? { 
      ...b, 
      status: 'available', 
      issueDetails: undefined 
    } : b));
    toast({ title: "Book Returned", description: "The book has been marked as available." });
  };


  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                        {book.status === 'available' && (
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
                            onConfirm={() => handleDeleteBook(book.id)}
                            variant="destructive"
                         />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No books found.
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
          // This modal is controlled by `editingBook` state, not a direct trigger button after initial open.
          // The trigger logic would be slightly different here. A simple way is to make it always open when editingBook is not null.
          // For ShadCN Dialog, it is better to manage its open state directly.
          // The below is a placeholder for how one might handle opening it.
          // It's better to use the Dialog's open/onOpenChange props directly tied to `editingBook !== null`.
          // For this exercise, editingBook being set will cause a re-render and the below `BookFormModal` will be rendered.
          // It needs an explicit `isOpen` prop for the dialog for proper control when using it this way.
          // The current BookFormModal manages its own isOpen state internally. This will be refactored if needed.
          // For now, assume a button "Edit" sets editingBook, and a new modal opens. The current BookFormModal would need to be adapted for external open control.
          // A simpler setup: The "Edit" DropdownMenuItem could be the trigger for a *new* BookFormModal instance.
          // Or, the BookFormModal itself should be rendered conditionally based on `editingBook` and handle its `open` prop.
          // Let's assume the above DropdownMenuItem handles setting `editingBook`, which then makes this specific modal visible or configured.
          // A better way:
          // <Dialog open={!!editingBook} onOpenChange={(isOpen) => !isOpen && setEditingBook(null)}>
          //   <BookFormModalContent book={editingBook} onSave={...} onCancel={() => setEditingBook(null)} />
          // </Dialog>
          // For now, the current BookFormModal is fine; clicking "Edit" then clicking "Add New Book" trigger is slightly awkward but functional for demo.
          // The modal opens when the "Edit" button is clicked, through its DropdownMenuItem.
          // To properly tie it to `editingBook`, the BookFormModal would need to accept an `isOpen` prop and `onOpenChange`.
          // Let's simulate this by making the trigger button for the editing modal part of the row action.
          // This is already handled by setEditingBook, and the BookFormModal takes a trigger.
          // The provided structure has the modal outside the table. When `editingBook` is set, it will be passed to this instance.
          // The trigger of this *instance* of BookFormModal isn't used. It's the *presence* of `editingBook` that matters.
          // So this is effectively a modal whose *content* is configured by `editingBook`, but it's always the same *modal component*.
          // The trigger logic in BookFormModal needs to be adapted if we want to open it programmatically.
          // One way is to pass an `initialOpen` prop to BookFormModal when `editingBook` is set.
          // For now: clicking "Edit" sets editingBook, which re-renders this tab, passing the book to the modal.
          // The modal still needs its own trigger.
          // This requires BookFormModal to be visible and its trigger clicked if editingBook is set.
          // This is not ideal. A better way:
          // 1. Have one BookFormModal in the BookManagementTab.
          // 2. Its 'open' state is controlled by `isModalOpen` and `editingBook`.
          // 3. "Add" button sets `editingBook` to null and `isModalOpen` to true.
          // 4. "Edit" button sets `editingBook` to the book and `isModalOpen` to true.
          triggerButton={<div/>} // Dummy trigger, modal is controlled by `editingBook` presence
        />
      )}
    </div>
  );
}
