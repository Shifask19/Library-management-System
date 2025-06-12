import type { Book, User, Transaction } from '@/types';

export const mockUsers: User[] = [
  { id: 'user1', email: 'student1@pes.edu', role: 'user', name: 'Aisha Sharma' },
  { id: 'user2', email: 'student2@pes.edu', role: 'user', name: 'Rohan Verma'},
  { id: 'user3', email: 'faculty1@pes.edu', role: 'user', name: 'Dr. Priya Singh' },
  { id: 'admin1', email: 'admin@pes.edu', role: 'admin', name: 'Library Admin PES' },
];

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const mockBooks: Book[] = [
  {
    id: 'book1',
    title: 'The Digital Fortress',
    author: 'Dan Brown',
    isbn: '978-0307277040',
    status: 'issued',
    category: 'Thriller',
    publishedDate: '1998',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'book cover',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -10).toISOString(),
      dueDate: addDays(today, 4).toISOString(),
    },
    description: 'A gripping thriller about cryptography and national security.'
  },
  {
    id: 'book2',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    status: 'available',
    category: 'Computer Science',
    publishedDate: '2020',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'textbook cover',
    description: 'The leading textbook in Artificial Intelligence.'
  },
  {
    id: 'book3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    status: 'available',
    category: 'History',
    publishedDate: '2015',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'history book',
    description: 'A groundbreaking narrative of humanity\'s creation and evolution.'
  },
  {
    id: 'book4',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    status: 'donated_pending_approval',
    category: 'Software Engineering',
    publishedDate: '2008',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'coding book',
    donatedBy: { userId: 'user2', userName: 'Rohan Verma', date: addDays(today, -2).toISOString() },
    description: 'Essential reading for any software developer.'
  },
  {
    id: 'book5',
    title: 'The Laws of Thermodynamics',
    author: 'Peter Atkins',
    isbn: '978-0199572199',
    status: 'issued',
    category: 'Physics',
    publishedDate: '2010',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'science textbook',
    issueDetails: {
      userId: 'user3',
      userName: 'Dr. Priya Singh',
      issueDate: addDays(today, -20).toISOString(),
      dueDate: addDays(today, -5).toISOString(), // Overdue
    },
    description: 'A concise introduction to the principles of thermodynamics.'
  },
  {
    id: 'book6',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    status: 'donated_approved',
    category: 'Computer Science',
    publishedDate: '2009',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'algorithms textbook',
    donatedBy: { userId: 'user1', userName: 'Aisha Sharma', date: addDays(today, -30).toISOString() },
    description: 'A comprehensive guide to algorithms and data structures.'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn1',
    bookId: 'book1',
    bookTitle: 'The Digital Fortress',
    userId: 'user1',
    userName: 'Aisha Sharma',
    type: 'issue',
    timestamp: addDays(today, -10).toISOString(),
    dueDate: addDays(today, 4).toISOString(),
  },
  {
    id: 'txn2',
    bookId: 'book4',
    bookTitle: 'Clean Code',
    userId: 'user2',
    userName: 'Rohan Verma',
    type: 'donate_request',
    timestamp: addDays(today, -2).toISOString(),
  },
  {
    id: 'txn3',
    bookId: 'book5',
    bookTitle: 'The Laws of Thermodynamics',
    userId: 'user3',
    userName: 'Dr. Priya Singh',
    type: 'issue',
    timestamp: addDays(today, -20).toISOString(),
    dueDate: addDays(today, -5).toISOString(),
  },
   {
    id: 'txn4',
    bookId: 'book6',
    bookTitle: 'Introduction to Algorithms',
    userId: 'user1',
    userName: 'Aisha Sharma',
    type: 'donate_approve',
    timestamp: addDays(today, -28).toISOString(),
  }
];
