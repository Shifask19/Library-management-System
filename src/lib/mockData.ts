
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
  },
  {
    id: 'book7',
    title: 'Practical Electronics for Inventors',
    author: 'Paul Scherz & Simon Monk',
    isbn: '978-1259587542',
    status: 'available',
    category: 'Electronics',
    publishedDate: '2016',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'electronics circuits',
    description: 'A hands-on guide to electronics, from basic theory to circuit design.'
  },
  {
    id: 'book8',
    title: 'The Art of Electronics',
    author: 'Paul Horowitz & Winfield Hill',
    isbn: '978-0521809269',
    status: 'available',
    category: 'Electronics',
    publishedDate: '2015',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'electronics reference',
    description: 'A comprehensive and authoritative text on analog and digital electronics.'
  },
  {
    id: 'book9',
    title: 'Fundamentals of Microelectronics',
    author: 'Behzad Razavi',
    isbn: '978-1119523878',
    status: 'maintenance',
    category: 'Electronics',
    publishedDate: '2020',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'microelectronics textbook',
    description: 'Covers the analysis and design of electronic circuits, focusing on microelectronics.'
  },
  {
    id: 'book10',
    title: 'Digital Design and Computer Architecture',
    author: 'David Harris & Sarah Harris',
    isbn: '978-0128200622',
    status: 'available',
    category: 'Electronics',
    publishedDate: '2021',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'digital design',
    description: 'Takes the reader from the fundamentals of digital logic to the actual design of a MIPS processor.'
  },
  // Start of new electronics books (issued)
  {
    id: 'elec001',
    title: 'Grob\'s Basic Electronics',
    author: 'Mitchel E. Schultz',
    isbn: '978-0073373874',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2015',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'electronics textbook',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -12).toISOString(),
      dueDate: addDays(today, 2).toISOString(), // Due soon
    },
    description: 'A foundational text covering DC/AC circuits, semiconductors, and basic electronic devices.'
  },
  {
    id: 'elec002',
    title: 'Electronic Devices and Circuit Theory',
    author: 'Robert L. Boylestad & Louis Nashelsky',
    isbn: '978-0132622264',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2012',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'circuit theory',
    issueDetails: {
      userId: 'user2',
      userName: 'Rohan Verma',
      issueDate: addDays(today, -5).toISOString(),
      dueDate: addDays(today, 9).toISOString(),
    },
    description: 'Comprehensive coverage of electronic devices and circuits with a focus on analysis and design.'
  },
  {
    id: 'elec003',
    title: 'Principles of Electric Circuits',
    author: 'Thomas L. Floyd & David M. Buchla',
    isbn: '978-0134879413',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2019',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'electric circuits',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -25).toISOString(),
      dueDate: addDays(today, -11).toISOString(), // Overdue
    },
    description: 'A clear and straightforward presentation of the fundamentals of electric circuits.'
  },
  {
    id: 'elec004',
    title: 'Microelectronic Circuits',
    author: 'Adel S. Sedra & Kenneth C. Smith',
    isbn: '978-0190853464',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2019',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'microchip circuit',
    issueDetails: {
      userId: 'user2',
      userName: 'Rohan Verma',
      issueDate: addDays(today, -8).toISOString(),
      dueDate: addDays(today, 6).toISOString(),
    },
    description: 'A classic text known for its comprehensive treatment of microelectronic circuits.'
  },
  {
    id: 'elec005',
    title: 'Introduction to Electrodynamics',
    author: 'David J. Griffiths',
    isbn: '978-1108420419',
    status: 'issued',
    category: 'Electronics', // Could also be Physics
    publishedDate: '2017',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'electromagnetism book',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -3).toISOString(),
      dueDate: addDays(today, 11).toISOString(),
    },
    description: 'A well-regarded textbook on classical electrodynamics.'
  },
  {
    id: 'elec006',
    title: 'CMOS Digital Integrated Circuits Analysis & Design',
    author: 'Sung-Mo Kang & Yusuf Leblebici',
    isbn: '978-0073380623',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2014',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'integrated circuit',
    issueDetails: {
      userId: 'user3',
      userName: 'Dr. Priya Singh',
      issueDate: addDays(today, -15).toISOString(),
      dueDate: addDays(today, -1).toISOString(), // Overdue
    },
    description: 'Focuses on the analysis and design of CMOS digital integrated circuits.'
  },
  {
    id: 'elec007',
    title: 'Signals and Systems',
    author: 'Alan V. Oppenheim & Alan S. Willsky',
    isbn: '978-0138147570',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '1996',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'signal processing',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -6).toISOString(),
      dueDate: addDays(today, 8).toISOString(),
    },
    description: 'A classic textbook on signals and systems theory.'
  },
  {
    id: 'elec008',
    title: 'Power Electronics: Converters, Applications, and Design',
    author: 'Ned Mohan, Tore M. Undeland, & William P. Robbins',
    isbn: '978-0471226932',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2003',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'power supply',
    issueDetails: {
      userId: 'user2',
      userName: 'Rohan Verma',
      issueDate: addDays(today, -18).toISOString(),
      dueDate: addDays(today, -4).toISOString(), // Overdue
    },
    description: 'Comprehensive coverage of power electronics converters and their applications.'
  },
   {
    id: 'elec009',
    title: 'Embedded Systems Design with ARM Cortex-M Microcontrollers',
    author: 'Yifeng Zhu',
    isbn: '978-0982692665',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2017',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'microcontroller board',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -2).toISOString(),
      dueDate: addDays(today, 12).toISOString(),
    },
    description: 'A practical guide to designing embedded systems using ARM Cortex-M microcontrollers.'
  },
  {
    id: 'elec010',
    title: 'Digital Signal Processing: Principles, Algorithms, and Applications',
    author: 'John G. Proakis & Dimitris K. Manolakis',
    isbn: '978-0131873742',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2006',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'digital signal wave',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -9).toISOString(),
      dueDate: addDays(today, 5).toISOString(),
    },
    description: 'A comprehensive text on the principles and applications of digital signal processing.'
  },
  {
    id: 'elec011',
    title: 'RF Microelectronics',
    author: 'Behzad Razavi',
    isbn: '978-0132839419',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2011',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'radio frequency antenna',
    issueDetails: {
      userId: 'user2',
      userName: 'Rohan Verma',
      issueDate: addDays(today, -7).toISOString(),
      dueDate: addDays(today, 7).toISOString(),
    },
    description: 'A detailed look into the design of radio frequency integrated circuits.'
  },
  {
    id: 'elec012',
    title: 'Make: Electronics - Learning Through Discovery',
    author: 'Charles Platt',
    isbn: '978-1680456875',
    status: 'issued',
    category: 'Electronics',
    publishedDate: '2021',
    coverImageUrl: 'https://placehold.co/300x450.png',
    dataAiHint: 'diy electronics kit',
    issueDetails: {
      userId: 'user1',
      userName: 'Aisha Sharma',
      issueDate: addDays(today, -1).toISOString(),
      dueDate: addDays(today, 13).toISOString(), // Due in 13 days
    },
    description: 'A hands-on, discovery-based approach to learning basic electronics.'
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
  // Mock transactions for new electronics books could be added here if needed
  // For example, for 'elec001' issued to user1:
  // {
  //   id: 'txnElec001',
  //   bookId: 'elec001',
  //   bookTitle: 'Grob\'s Basic Electronics',
  //   userId: 'user1',
  //   userName: 'Aisha Sharma',
  //   type: 'issue',
  //   timestamp: addDays(today, -12).toISOString(),
  //   dueDate: addDays(today, 2).toISOString(),
  // }
];

