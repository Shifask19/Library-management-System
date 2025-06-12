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
  book?: Book | null; // Pass book data for editing, null/undefined for adding
  triggerButton: React.ReactNode;
  onSave: (bookData: Omit<Book, 'id'> | Book) => Promise<void>; // Callback after saving
}

const bookStatuses: Book['status'][] = ['available', 'maintenance', 'lost'];
const bookCategories = ["Computer Science", "Fiction", "Science", "History", "Mathematics", "Engineering", "Literature", "Thriller", "Physics"];


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
      setStatus(book.status === 'donated_pending_approval' || book.status === 'donated_approved' ? 'available' : book.status);
    } else if (!book && isOpen) {
      // Reset form for adding new book
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
    
    const bookData: Omit<Book, 'id'> | Book = {
      ...(book ? { id: book.id } : {}), // Include id if editing
      title,
      author,
      isbn,
      category,
      publishedDate,
      description,
      coverImageUrl,
      status,
      // issueDetails and donatedBy should be handled by issue/donate logic, not directly in this form
      // For editing, ensure existing issueDetails/donatedBy are preserved if not modifying status
      ...(book?.issueDetails && status === 'issued' && { issueDetails: book.issueDetails }),
      ...(book?.donatedBy && (status === 'donated_pending_approval' || status === 'donated_approved') && { donatedBy: book.donatedBy }),
    };

    try {
      await onSave(bookData as Book); // Type assertion for simplicity, onSave should handle Omit<Book, 'id'> for new books
      toast({
        title: `Book ${book ? 'Updated' : 'Added'}`,
        description: `"${title}" has been successfully ${book ? 'updated' : 'added'}.`,
      });
      setIsOpen(false); // Close dialog on success
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
               <Select value={category} onValueChange={setCategory}>
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
            <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://example.com/cover.jpg" />
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
