
import Image from 'next/image';
import type { Book } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusPill } from './StatusPill';
import { BookText, CalendarDays, UserCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface BookCardProps {
  book: Book;
  onAction?: (bookId: string) => void; // Kept for potential generic actions
  actionLabel?: string; // Kept for potential generic actions
  actionDisabled?: boolean; // Kept for potential generic actions
  children?: ReactNode; // To allow passing custom action components like ConfirmationDialog
}

export function BookCard({ book, onAction, actionLabel, actionDisabled, children }: BookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={book.coverImageUrl || `https://placehold.co/400x600.png?text=${encodeURIComponent(book.title)}`}
          alt={book.title}
          data-ai-hint={book.dataAiHint || "book cover"}
          width={400}
          height={600}
          className="object-cover w-full aspect-[2/3]"
        />
        <div className="absolute top-2 right-2">
          <StatusPill book={book} size="sm"/>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-1">By {book.author}</CardDescription>
        
        <div className="text-xs text-muted-foreground space-y-1 mt-2">
          {book.category && (
            <p className="flex items-center gap-1">
              <BookText size={14} /> Category: {book.category}
            </p>
          )}
          {book.isbn && (
            <p className="flex items-center gap-1">
              ISBN: {book.isbn}
            </p>
          )}
           {book.publishedDate && (
            <p className="flex items-center gap-1">
              <CalendarDays size={14} /> Published: {book.publishedDate}
            </p>
          )}
          {book.status === 'issued' && book.issueDetails && (
            <>
              <p className="flex items-center gap-1">
                <UserCircle size={14} /> Issued to: {book.issueDetails.userName}
              </p>
              <p className="flex items-center gap-1">
                <CalendarDays size={14} /> Due: {new Date(book.issueDetails.dueDate).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
      </CardContent>
      {(onAction && actionLabel || children) && (
        <CardFooter className="p-4 pt-0">
          {children ? (
            <div className="w-full">{children}</div>
          ) : (
            onAction && actionLabel && (
              <Button 
                onClick={() => onAction(book.id)} 
                className="w-full" 
                variant="default"
                disabled={actionDisabled}
              >
                {actionLabel}
              </Button>
            )
          )}
        </CardFooter>
      )}
    </Card>
  );
}
