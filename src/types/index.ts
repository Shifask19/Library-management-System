import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string | null;
  role: 'admin' | 'user';
  name?: string | null;
  // Additional fields like studentId, facultyId could be added
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverImageUrl?: string; // URL to cover image
  status: 'available' | 'issued' | 'donated_pending_approval' | 'donated_approved' | 'lost' | 'maintenance';
  category?: string;
  publishedDate?: string; // Consider storing as ISO string or just year
  description?: string;
  donatedBy?: {
    userId: string;
    userName: string; 
    date: string; // ISO string
  };
  issueDetails?: {
    userId: string;
    userName: string;
    issueDate: string; // ISO string
    dueDate: string; // ISO string
    returnedDate?: string; // ISO string
  };
  tags?: string[];
  copies?: number; // If managing multiple copies of the same book
  location?: string; // Shelf number, section etc.
}

export interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string; 
  userId: string;
  userName: string;
  type: 'issue' | 'return' | 'donate_request' | 'donate_approve' | 'donate_reject' | 'fine_paid' | 'renewal';
  timestamp: string; // ISO string
  dueDate?: string; // ISO string, for issue transactions
  notes?: string;
  fineAmount?: number;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  isActive?: (pathname: string) => boolean;
}

export type BookStatusVariant = 
  | "available"
  | "issued"
  | "overdue"
  | "due_soon"
  | "pending_approval"
  | "donated"
  | "lost"
  | "maintenance";

export interface BookStatusPillDetail {
  text: string;
  bgColorClass: string;
  textColorClass: string;
  borderColorClass?: string;
  icon?: LucideIcon;
}

// Example User for mock data
export const sampleUser: User = {
  id: 'user123',
  email: 'student@pes.edu',
  role: 'user',
  name: 'PES Student',
};

export const sampleAdmin: User = {
  id: 'admin001',
  email: 'admin@pes.edu',
  role: 'admin',
  name: 'Library Admin',
};
