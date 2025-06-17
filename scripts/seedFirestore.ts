// scripts/seedFirestore.ts
import { db } from '../src/lib/firebase';
import { mockBooks } from '../src/lib/mockData';
import { collection, addDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import type { Book } from '../src/types';

async function seedFirestore() {
  if (!db) {
    console.error(
      "Firestore is not initialized. Please check your Firebase configuration (.env.local) " +
      "and ensure environment variables are loaded correctly. Restart your terminal if needed."
    );
    process.exit(1);
  }

  const booksCollectionRef = collection(db, "books");
  console.log(`Found ${mockBooks.length} books in mockData.ts. Starting seeding process...`);
  let booksAddedCount = 0;
  let booksSkippedCount = 0;
  const booksToAdd: Omit<Book, 'id'>[] = [];

  // First, gather all unique books from mockData that are not in Firestore yet
  for (const book of mockBooks) {
    const q = query(booksCollectionRef, where("isbn", "==", book.isbn));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Remove 'id' if present from mock data, as Firestore will auto-generate it
      const { id, ...bookData } = book;
      booksToAdd.push(bookData);
    } else {
      console.log(`Book with ISBN ${book.isbn} ("${book.title}") already exists in Firestore. Skipping.`);
      booksSkippedCount++;
    }
  }

  if (booksToAdd.length === 0) {
    console.log("No new books to add from mockData.ts.");
  } else {
    // Use writeBatch for more efficient bulk writes (up to 500 operations per batch)
    const batchSize = 499; // Firestore batch limit
    for (let i = 0; i < booksToAdd.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = booksToAdd.slice(i, i + batchSize);
      
      console.log(`Preparing batch ${Math.floor(i / batchSize) + 1} with ${chunk.length} books...`);

      for (const bookData of chunk) {
        const newBookRef = doc(booksCollectionRef); // Create a new document reference with an auto-generated ID
        batch.set(newBookRef, bookData);
        console.log(`  Scheduled addition for: "${bookData.title}" (ISBN: ${bookData.isbn})`);
      }

      try {
        await batch.commit();
        booksAddedCount += chunk.length;
        console.log(`Batch ${Math.floor(i / batchSize) + 1} committed successfully. ${chunk.length} books added in this batch.`);
      } catch (error) {
        console.error(`Error committing batch ${Math.floor(i / batchSize) + 1}:`, error);
        console.error("Some books in this batch might not have been added.");
      }
    }
  }

  console.log("\n--- Seeding Complete ---");
  console.log(`${booksAddedCount} books added to Firestore.`);
  console.log(`${booksSkippedCount} books were skipped (already existed or other reasons).`);
  if (booksAddedCount > 0) {
    console.log("Please verify the 'books' collection in your Firebase console.");
  }
  console.log("--------------------------");
}

seedFirestore()
  .then(() => {
    console.log("Firestore seeding process finished successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error during seeding process:", error);
    process.exit(1);
  });
