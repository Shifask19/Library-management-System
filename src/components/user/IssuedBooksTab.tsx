
"use client";

import { useState } from 'react';
import type { Book } from '@/types';
import { mockBooks } from '@/lib/mockData'; // Using mock data
import { BookCard } from '@/components/shared/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, BookOpenCheck, Search, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RENEWAL_PERIOD_DAYS = 7; // Renew for 7 days

export function IssuedBooksTab() {
  // Assuming current user ID is 'user1' for mock data filtering
  const currentUserId = 'user1'; 
  const [userBooks, setUserBooks] = useState<Book[]>(
    mockBooks.filter(book => book.status === 'issued' && book.issueDetails?.userId === currentUserId)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'due_soon' | 'overdue'>('all');
  const { toast } = useToast();

  const handleRenewBook = (bookId: string) => {
    setUserBooks(prevBooks => {
      const bookIndex = prevBooks.findIndex(b => b.id === bookId);
      if (bookIndex === -1) {
        toast({
          title: "Renewal Failed",
          description: "Book not found.",
          variant: "destructive",
        });
        return prevBooks;
      }

      const bookToRenew = prevBooks[bookIndex];
      if (!bookToRenew.issueDetails) {
         toast({
          title: "Renewal Failed",
          description: "Book issue details not found.",
          variant: "destructive",
        });
        return prevBooks;
      }

      const currentDueDate = new Date(bookToRenew.issueDetails.dueDate);
      const newDueDate = new Date(currentDueDate);
      newDueDate.setDate(currentDueDate.getDate() + RENEWAL_PERIOD_DAYS);

      const updatedBook = {
        ...bookToRenew,
        issueDetails: {
          ...bookToRenew.issueDetails,
          dueDate: newDueDate.toISOString(),
        },
      };

      const updatedBooks = [...prevBooks];
      updatedBooks[bookIndex] = updatedBook;
      
      toast({
        title: "Book Renewed",
        description: `"${bookToRenew.title}" has been renewed. New due date: ${newDueDate.toLocaleDateString()}.`,
      });
      return updatedBooks;
    });
  };

  const filteredAndSortedBooks = userBooks
    .filter(book => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = book.title.toLowerCase().includes(lowerSearchTerm) ||
                            book.author.toLowerCase().includes(lowerSearchTerm);

      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      
      if (!book.issueDetails) return false; // Should not happen for issued books but good check
      const dueDate = new Date(book.issueDetails.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to start of day for comparison
      dueDate.setHours(0,0,0,0); // Normalize due date to start of day

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filter === 'overdue') return diffDays < 0;
      if (filter === 'due_soon') return diffDays >= 0 && diffDays <= 3; // Due in 3 days or less (including today)
      return true;
    })
    .sort((a, b) => 
      new Date(a.issueDetails!.dueDate).getTime() - new Date(b.issueDetails!.dueDate).getTime()
    ); // Sort by due date ascending

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your issued books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="due_soon">Due Soon</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book}
              actionLabel="Request Renewal"
              onAction={() => handleRenewBook(book.id)}
              // actionDisabled={/* Add complex logic here if needed, e.g., already overdue or renewal limit reached */}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

