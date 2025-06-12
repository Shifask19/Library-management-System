"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Loader2 } from 'lucide-react';
import Image from 'next/image';

export function DonateBookTab() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState(''); // Or publishedYear
  const [condition, setCondition] = useState(''); // e.g., New, Good, Fair
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call to submit donation request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Donation Submitted:", { title, author, isbn, edition, condition, notes });
      
      toast({
        title: "Donation Submitted",
        description: `Thank you for donating "${title}"! Your request is pending approval.`,
      });
      // Reset form
      setTitle('');
      setAuthor('');
      setIsbn('');
      setEdition('');
      setCondition('');
      setNotes('');
    } catch (error) {
      console.error("Donation submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Could not submit your donation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Gift className="h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-headline">Donate a Book</CardTitle>
          <CardDescription>Share your books with the PES community. Fill out the form below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author(s)</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required disabled={isLoading} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN (Optional)</Label>
                <Input id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="e.g., 978-3-16-148410-0" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edition">Edition / Published Year</Label>
                <Input id="edition" value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="e.g., 3rd Edition or 2021" required disabled={isLoading} />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="condition">Book Condition</Label>
                <Input id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g., Like New, Good, Fair with notes" required disabled={isLoading} />
              </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific details about the book or donation." rows={3} disabled={isLoading} />
            </div>
             <CardFooter className="p-0 pt-4">
                <Button type="submit" className="w-full text-base" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Gift className="mr-2 h-5 w-5" />
                )}
                Submit Donation Request
                </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
       <div className="mt-8 text-center">
          <Image 
            src="https://placehold.co/400x250.png" 
            alt="Books donation illustration"
            data-ai-hint="books donation"
            width={400} 
            height={250} 
            className="rounded-lg shadow-md mx-auto"
          />
          <p className="text-muted-foreground mt-4 text-sm">
            Your contributions help enrich our library and support fellow students and faculty.
          </p>
        </div>
    </div>
  );
}
