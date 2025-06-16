
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Book } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BookFormModalProps {
  book?: Book | null;
  triggerButton: React.ReactNode;
  onSave: (bookData: Omit<Book, 'id' | 'issueDetails' | 'donatedBy'> | Book) => Promise<void>;
}

const bookStatuses: Book['status'][] = ['available', 'maintenance', 'lost'];
const bookCategories = ["Computer Science", "Fiction", "Science", "History", "Mathematics", "Engineering", "Literature", "Thriller", "Physics", "Electronics", "Other"];


export function BookFormModal({ book, triggerButton, onSave }: BookFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState<Book['status']>('available');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (book && isOpen) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
      setCategory(book.category || "");
      setPublishedDate(book.publishedDate || "");
      setDescription(book.description || "");
      setCoverImageUrl(book.coverImageUrl || "");
      // Don't allow direct edit of 'donated_pending_approval' or 'donated_approved' status here.
      // If book is donated, set default status to 'available' for editing general details.
      // Actual approval/rejection is handled elsewhere.
      if (book.status === 'donated_pending_approval' || book.status === 'donated_approved') {
        setStatus('available'); // Or keep its original status if editing non-donated specific fields is intended
      } else {
        setStatus(book.status);
      }
    } else if (!book && isOpen) {
      setTitle("");
      setAuthor("");
      setIsbn("");
      setCategory("");
      setPublishedDate("");
      setDescription("");
      setCoverImageUrl("");
      setStatus("available");
    }
  }, [book, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const baseBookData = {
      title,
      author,
      isbn,
      category,
      publishedDate,
      description,
      coverImageUrl,
      status,
    };

    let bookDataToSave: Omit<Book, 'id' | 'issueDetails' | 'donatedBy'> | Book;

    if (book) { // Editing existing book
      bookDataToSave = {
        ...book, // Preserve existing fields like id, issueDetails, donatedBy
        ...baseBookData, // Override with form values
        // Ensure status is correctly set, especially if it was 'donated_pending_approval'
        // The onSave function in BookManagementTab should handle Firestore update logic correctly.
      };
    } else { // Adding new book
      bookDataToSave = baseBookData;
    }


    try {
      await onSave(bookDataToSave);
      toast({
        title: `Book ${book ? 'Updated' : 'Added'}`,
        description: `"${title}" has been successfully ${book ? 'updated' : 'added'}.`,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: `Error ${book ? 'Updating' : 'Adding'} Book`,
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {book ? "Update the details of the book." : "Fill in the details to add a new book to the library."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
               <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date (Year)</Label>
              <Input id="publishedDate" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} placeholder="e.g., 2023" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Book['status'])} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {bookStatuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://placehold.co/cover.jpg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {book ? "Save Changes" : "Add Book"}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
